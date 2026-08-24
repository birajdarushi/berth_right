import { NextRequest, NextResponse } from "next/server";
import { pairRacQueue } from "@/lib/pairing";
import type { BerthId, RacEntry } from "@/lib/types";

// POST /rac/pair { racQueue, coachConfig: BerthId[] } -> Pairing[] + unpaired list
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { racQueue: RacEntry[]; coachConfig: BerthId[] };
  const result = pairRacQueue(body.racQueue, body.coachConfig);
  return NextResponse.json(result);
}
