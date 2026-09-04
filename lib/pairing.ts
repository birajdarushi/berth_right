import type { BerthId, ConstraintResult, Pairing, RacEntry, StationCode } from "./types";

/**
 * Deterministic gender-aware RAC pairing solver — SPEC.md §6. Pure, no network calls,
 * no LLM. Given identical input it always returns identical output.
 *
 * Hard constraints (never violated): same_gender_only only matches same gender or stays
 * unpaired; an unaccompanied minor is never paired; a berth never holds more than two;
 * journey segments must overlap.
 *
 * Soft constraints (optimised, in priority order): companions paired together;
 * prefer_same_gender honoured where it doesn't displace a hard constraint; queue order
 * preserved as closely as the above allow.
 */

// ponytail: RacEntry has no companion-link field (types.ts is fixed per SPEC.md §5), so
// "same booking" is approximated by identical bookedAt + boarding/alighting stations.
// Upgrade path: add an explicit companionOf id to RacEntry if this proves too loose.
function isSameBooking(a: RacEntry, b: RacEntry): boolean {
  return (
    a.bookedAt === b.bookedAt &&
    a.boardingStation === b.boardingStation &&
    a.alightingStation === b.alightingStation
  );
}

/**
 * True if two journey segments share any travel time on the train, using `route` (an
 * ordered list of station codes) to resolve positions. An empty route is treated as "one
 * segment, always overlapping" — the common case here, since every seeded RAC entry
 * travels the train's full endpoint-to-endpoint route.
 */
export function segmentsOverlap(
  route: StationCode[],
  aBoard: StationCode,
  aAlight: StationCode,
  bBoard: StationCode,
  bAlight: StationCode
): boolean {
  if (route.length === 0) return true;
  const idx = (s: StationCode) => route.indexOf(s);
  const [aB, aA, bB, bA] = [idx(aBoard), idx(aAlight), idx(bBoard), idx(bAlight)];
  if (aB === -1 || aA === -1 || bB === -1 || bA === -1) return true; // unknown station: permissive default
  return aB < bA && bB < aA;
}

function isUnaccompaniedMinor(entry: RacEntry): boolean {
  return entry.passenger.isMinor && entry.passenger.travellingAlone;
}

function buildExplanation(occupants: [RacEntry, RacEntry?], reason: string): string {
  const names = occupants.filter(Boolean).map((o) => o!.passenger.displayName);
  return `${names.join(" & ")}: ${reason}`;
}

function buildConstraints(
  occupants: [RacEntry, RacEntry?],
  route: StationCode[]
): ConstraintResult[] {
  const [a, b] = occupants;
  const results: ConstraintResult[] = [
    { name: "capacity", satisfied: true, detail: "Berth holds at most two occupants." },
  ];
  if (!b) {
    results.push({ name: "gender", satisfied: true, detail: "Single occupant; no pairing constraint applies." });
    return results;
  }
  const genderMatch = a.passenger.gender === b.passenger.gender;
  results.push({
    name: "gender",
    satisfied: a.preference !== "same_gender_only" || genderMatch,
    detail: genderMatch ? "Occupants share the same gender." : "Occupants do not share the same gender.",
  });
  const overlap = segmentsOverlap(route, a.boardingStation, a.alightingStation, b.boardingStation, b.alightingStation);
  results.push({
    name: "journey_overlap",
    satisfied: overlap,
    detail: overlap ? "Journeys overlap on the train." : "Journeys do not overlap.",
  });
  results.push({
    name: "minor_safety",
    satisfied: !isUnaccompaniedMinor(a) && !isUnaccompaniedMinor(b),
    detail: "Neither occupant is an unaccompanied minor.",
  });
  return results;
}

export function pairRacQueue(
  racQueue: RacEntry[],
  berthIds: BerthId[],
  route: StationCode[] = []
): { pairings: Pairing[]; unpaired: RacEntry[] } {
  const sorted = [...racQueue].sort((a, b) => a.position - b.position);
  const unpaired: RacEntry[] = [];
  const pairs: [RacEntry, RacEntry?][] = [];
  const paired = new Set<string>();

  const overlaps = (a: RacEntry, b: RacEntry) =>
    segmentsOverlap(route, a.boardingStation, a.alightingStation, b.boardingStation, b.alightingStation);

  // Hard constraint: an unaccompanied minor is never paired with an unrelated adult.
  // We have no relation data, so the safe default is to never pair them at all.
  for (const entry of sorted) {
    if (isUnaccompaniedMinor(entry)) {
      unpaired.push(entry);
      paired.add(entry.passenger.id);
    }
  }

  const isFree = (e: RacEntry) => !paired.has(e.passenger.id);

  // Phase 1 (soft, priority 1): companions on the same booking, paired together.
  for (const entry of sorted) {
    if (!isFree(entry) || entry.preference !== "companion") continue;
    const partner = sorted.find(
      (candidate) =>
        candidate !== entry &&
        isFree(candidate) &&
        candidate.preference === "companion" &&
        isSameBooking(entry, candidate) &&
        overlaps(entry, candidate)
    );
    if (partner) {
      pairs.push([entry, partner]);
      paired.add(entry.passenger.id);
      paired.add(partner.passenger.id);
    }
  }

  // Phase 2 (hard): same_gender_only matches only same gender, or stays unpaired.
  for (const entry of sorted) {
    if (!isFree(entry) || entry.preference !== "same_gender_only") continue;
    const partner = sorted.find(
      (candidate) =>
        candidate !== entry &&
        isFree(candidate) &&
        candidate.passenger.gender === entry.passenger.gender &&
        overlaps(entry, candidate)
    );
    if (partner) {
      pairs.push([entry, partner]);
      paired.add(entry.passenger.id);
      paired.add(partner.passenger.id);
    } else {
      unpaired.push(entry);
      paired.add(entry.passenger.id);
    }
  }

  // Phase 3 (soft, priority 2): prefer_same_gender honoured where it doesn't displace
  // anyone still holding a hard constraint — safe here since same_gender_only entries
  // are already resolved above.
  for (const entry of sorted) {
    if (!isFree(entry) || entry.preference !== "prefer_same_gender") continue;
    const partner = sorted.find(
      (candidate) =>
        candidate !== entry &&
        isFree(candidate) &&
        candidate.passenger.gender === entry.passenger.gender &&
        overlaps(entry, candidate)
    );
    if (partner) {
      pairs.push([entry, partner]);
      paired.add(entry.passenger.id);
      paired.add(partner.passenger.id);
    }
  }

  // Phase 4: everyone still free (no_preference, unmatched prefer_same_gender, unmatched
  // companions) is paired in queue order — the closest we can get to preserving position
  // once the hard and soft-priority passes above are done.
  for (const entry of sorted) {
    if (!isFree(entry)) continue;
    const partner = sorted.find(
      (candidate) => candidate !== entry && isFree(candidate) && overlaps(entry, candidate)
    );
    if (partner) {
      pairs.push([entry, partner]);
      paired.add(entry.passenger.id);
      paired.add(partner.passenger.id);
    } else {
      unpaired.push(entry);
      paired.add(entry.passenger.id);
    }
  }

  const pairings: Pairing[] = pairs.map((occupants, i) => {
    const [a, b] = occupants;
    const preferenceViolated = Boolean(
      b &&
        ((a.preference === "prefer_same_gender" && a.passenger.gender !== b.passenger.gender) ||
          (b.preference === "prefer_same_gender" && b.passenger.gender !== a.passenger.gender) ||
          (a.preference === "companion" && !isSameBooking(a, b)) ||
          (b.preference === "companion" && !isSameBooking(a, b)))
    );
    const reason = !b
      ? "No partner available under the applicable constraints; travelling unpaired."
      : a.preference === "companion" && b.preference === "companion" && isSameBooking(a, b)
        ? "Paired as companions on the same booking."
        : a.passenger.gender === b.passenger.gender
          ? "Paired with a same-gender passenger."
          : "Paired by queue order; no gender constraint applied.";
    return {
      berthId: berthIds[i] ?? `overflow-${i}`,
      occupants,
      constraintsSatisfied: buildConstraints(occupants, route),
      preferenceViolated,
      explanation: buildExplanation(occupants, reason),
    };
  });

  return { pairings, unpaired };
}

/**
 * "Today's system" — pairs strictly by queue order, two per side-lower berth,
 * gender not considered at all. This is the baseline the queue visualization
 * contrasts against `pairRacQueue`; it is never used for real allocation.
 */
export function pairNaive(
  racQueue: RacEntry[],
  berthIds: BerthId[]
): { pairings: Pairing[]; unpaired: RacEntry[] } {
  const sorted = [...racQueue].sort((a, b) => a.position - b.position);
  const pairings: Pairing[] = [];
  const unpaired: RacEntry[] = [];

  for (let i = 0; i < sorted.length; i += 2) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (!b) {
      unpaired.push(a);
      continue;
    }
    const preferenceViolated =
      ((a.preference === "same_gender_only" || a.preference === "prefer_same_gender") &&
        a.passenger.gender !== b.passenger.gender) ||
      ((b.preference === "same_gender_only" || b.preference === "prefer_same_gender") &&
        b.passenger.gender !== a.passenger.gender);
    pairings.push({
      berthId: berthIds[pairings.length] ?? `overflow-${pairings.length}`,
      occupants: [a, b],
      constraintsSatisfied: [
        { name: "capacity", satisfied: true, detail: "Berth holds at most two occupants." },
      ],
      preferenceViolated,
      explanation: buildExplanation([a, b], "Paired strictly by queue order; gender not considered."),
    });
  }

  return { pairings, unpaired };
}
