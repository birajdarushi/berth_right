import { NextRequest, NextResponse } from "next/server";

// POST /escalate { pnr, reason, timestamp } -> structured escalation record
// The TTE-side view of this is a mocked, clearly-labelled screen (SPEC.md §4.2).
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { pnr: string; reason: string; timestamp: string };

  const escalationId = `ESC-${body.pnr.replace(/\D/g, "")}-${body.reason.length}${body.timestamp.length}`;

  return NextResponse.json({
    escalationId,
    pnr: body.pnr,
    reason: body.reason,
    timestamp: body.timestamp,
    status: "logged",
    mockedTteReceipt: {
      note: "MOCKED — no real TTE received this. Demo-only acknowledgement.",
      acknowledgedBy: "Demo TTE Console",
    },
  });
}
