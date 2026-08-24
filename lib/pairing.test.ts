import { describe, it, expect } from "vitest";
import { pairRacQueue } from "./pairing";
import type { Passenger, RacEntry } from "./types";

function entry(overrides: {
  position: number;
  passenger?: Partial<Passenger>;
  preference?: RacEntry["preference"];
}): RacEntry {
  const { position, passenger, preference } = overrides;
  return {
    position,
    preference: preference ?? "no_preference",
    boardingStation: "NDLS",
    alightingStation: "BCT",
    bookedAt: "2026-08-01T00:00:00.000Z",
    passenger: {
      id: `p${position}`,
      displayName: `Demo Traveller ${position}`,
      gender: "female",
      age: 30,
      isMinor: false,
      travellingAlone: true,
      ...passenger,
    },
  };
}

const BERTHS = ["B1", "B2", "B3", "B4", "B5"];

describe("pairRacQueue", () => {
  it("never violates a hard same_gender_only constraint", () => {
    const queue = [
      entry({ position: 1, passenger: { gender: "female" }, preference: "same_gender_only" }),
      entry({ position: 2, passenger: { gender: "male" } }),
      entry({ position: 3, passenger: { gender: "male" } }),
    ];
    const { pairings, unpaired } = pairRacQueue(queue, BERTHS);
    for (const p of pairings) {
      const [a, b] = p.occupants;
      if (b && (a.preference === "same_gender_only" || b.preference === "same_gender_only")) {
        expect(a.passenger.gender).toBe(b.passenger.gender);
      }
    }
    // the lone female with a hard constraint has no same-gender candidate: stays unpaired
    expect(unpaired.map((e) => e.passenger.id)).toContain("p1");
  });

  it("never pairs an unaccompanied minor with an unrelated adult", () => {
    const queue = [
      entry({ position: 1, passenger: { age: 10, isMinor: true, travellingAlone: true } }),
      entry({ position: 2, passenger: { gender: "female", age: 30 } }),
    ];
    const { pairings, unpaired } = pairRacQueue(queue, BERTHS);
    expect(pairings.every((p) => !p.occupants.some((o) => o?.passenger.id === "p1"))).toBe(true);
    expect(unpaired.map((e) => e.passenger.id)).toContain("p1");
  });

  it("is deterministic: identical input yields identical output", () => {
    const queue = [
      entry({ position: 1, passenger: { gender: "female" }, preference: "same_gender_only" }),
      entry({ position: 2, passenger: { gender: "female" } }),
      entry({ position: 3, passenger: { gender: "male" } }),
      entry({ position: 4, passenger: { gender: "male" } }),
    ];
    const first = pairRacQueue(queue, BERTHS);
    const second = pairRacQueue(queue, BERTHS);
    expect(first).toEqual(second);
  });

  it("leaves a passenger unpaired rather than silently mismatching when no valid partner exists", () => {
    const queue = [
      entry({ position: 1, passenger: { gender: "female" }, preference: "same_gender_only" }),
      entry({ position: 2, passenger: { gender: "male" } }),
    ];
    const { pairings, unpaired } = pairRacQueue(queue, BERTHS);
    expect(pairings.length).toBe(0);
    expect(unpaired.map((e) => e.passenger.id)).toEqual(["p1", "p2"]);
  });

  it("preserves queue order where constraints allow", () => {
    const queue = [
      entry({ position: 1, passenger: { gender: "male" } }),
      entry({ position: 2, passenger: { gender: "male" } }),
      entry({ position: 3, passenger: { gender: "male" } }),
      entry({ position: 4, passenger: { gender: "male" } }),
    ];
    const { pairings } = pairRacQueue(queue, BERTHS);
    expect(pairings[0].occupants.map((o) => o?.passenger.id)).toEqual(["p1", "p2"]);
    expect(pairings[1].occupants.map((o) => o?.passenger.id)).toEqual(["p3", "p4"]);
  });
});
