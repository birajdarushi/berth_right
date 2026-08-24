import { NextRequest, NextResponse } from "next/server";
import type { Booking } from "@/lib/types";

export type ChartBranch = "confirmed" | "rac_honoured" | "rac_unmet";

export interface ChartOutcome {
  branch: ChartBranch;
  status: "CNF" | "RAC";
  berthId?: string;
  preferenceHonoured: boolean | null;
  explanation: string;
  remedy?: string;
}

// POST /chart/prepare { booking, racQueue, seed } -> Chart outcome, all branches.
// `seed` selects the demo branch explicitly (SPEC.md §4.1 #8, §9 screen 14: all three
// outcomes must be reachable on demand). Deterministic — no Date.now, no Math.random.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { booking: Booking; seed: ChartBranch };

  const outcome: ChartOutcome = (() => {
    switch (body.seed) {
      case "confirmed":
        return {
          branch: "confirmed",
          status: "CNF",
          berthId: `${body.booking.train.number}-S1-B12`,
          preferenceHonoured: null,
          explanation: "A full berth was vacated ahead of chart preparation — you have been upgraded from RAC to a confirmed berth.",
        };
      case "rac_honoured":
        return {
          branch: "rac_honoured",
          status: "RAC",
          berthId: `${body.booking.train.number}-S1-SL4`,
          preferenceHonoured: true,
          explanation: "You remain on RAC, paired with a same-gender passenger — your sharing preference was honoured.",
        };
      case "rac_unmet":
      default:
        return {
          branch: "rac_unmet",
          status: "RAC",
          berthId: `${body.booking.train.number}-S1-SL7`,
          preferenceHonoured: false,
          explanation: "You remain on RAC. No same-gender partner was available in the queue at chart preparation, so you were paired by queue order instead.",
          remedy: "You can raise this with the conductor now (in-journey escalation), and if you're never allotted a full berth you're entitled to a partial refund — see the entitlement screen.",
        };
    }
  })();

  return NextResponse.json(outcome satisfies ChartOutcome);
}
