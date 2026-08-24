import { NextRequest, NextResponse } from "next/server";
import { SEED_TRAINS, SEED_RAC_QUEUES } from "@/lib/seed";

// GET /trains/search?from=&to=&date= -> Train[] with RAC availability
export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const results = SEED_TRAINS.filter(
    (t) => (!from || t.from === from) && (!to || t.to === to)
  ).map((t) => {
    const queue = SEED_RAC_QUEUES[t.number] ?? [];
    return {
      ...t,
      racAvailability: {
        queueLength: queue.length,
        statusLine: `RAC available — ${queue.length} passengers currently in the RAC queue for this train.`,
      },
    };
  });

  return NextResponse.json(results);
}
