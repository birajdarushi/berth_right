import { NextRequest, NextResponse } from "next/server";
import { RAC_ENTITLEMENT_REFUND_RATIO } from "@/lib/fare-rules";
import type { Booking } from "@/lib/types";
import type { ChartOutcome } from "@/app/api/chart/prepare/route";

// POST /fare/entitlement { booking, chartOutcome } -> { amount, ruleId, citation, isProposal }
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { booking: Booking; chartOutcome: ChartOutcome };

  const neverConfirmed = body.chartOutcome.status === "RAC";
  const amount = neverConfirmed
    ? Math.round(body.booking.fare.totalFare * RAC_ENTITLEMENT_REFUND_RATIO)
    : 0;

  return NextResponse.json({
    amount,
    ruleId: "rac-entitlement-proposal",
    citation:
      "Parliamentary Standing Committee recommendation, February 2026 — full fare on never-confirmed RAC called 'not justified'.",
    isProposal: true,
  });
}
