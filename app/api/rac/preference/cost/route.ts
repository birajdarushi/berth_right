import { NextRequest, NextResponse } from "next/server";
import { SEED_RAC_QUEUES } from "@/lib/seed";
import type { Gender, SharingPreference } from "@/lib/types";

// POST /rac/preference/cost { trainId, gender, preference } ->
// { estimatedPositionDelta, basis, isEstimate: true }
// Pure estimate derived from the seed queue's actual gender distribution — SPEC.md §6.4.
// Only same_gender_only (a hard constraint) carries a position cost; the other
// preferences never block confirmation, so their cost is zero.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    trainId: string;
    gender: Gender;
    preference: SharingPreference;
  };
  const queue = SEED_RAC_QUEUES[body.trainId] ?? [];

  if (body.preference !== "same_gender_only" || queue.length === 0) {
    return NextResponse.json({
      estimatedPositionDelta: 0,
      basis: "This preference never blocks confirmation, so it carries no queue-position cost.",
      isEstimate: true,
    });
  }

  const sameGenderCount = queue.filter((e) => e.passenger.gender === body.gender).length;
  // Roughly: only same-gender pairs can share a berth under this constraint, so the
  // effective queue you compete in shrinks to sameGenderCount. The rest of the queue
  // (opposite-gender entries you can no longer be paired with) is the delta.
  const estimatedPositionDelta = Math.max(0, Math.round((queue.length - sameGenderCount) / 2));

  return NextResponse.json({
    estimatedPositionDelta,
    basis: `Estimated from this train's current RAC queue: ${sameGenderCount} of ${queue.length} entries share your gender. This is an estimate from seed demo data, not a real queue.`,
    isEstimate: true,
  });
}
