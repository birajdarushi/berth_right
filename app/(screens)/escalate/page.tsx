"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import { now } from "@/lib/clock";

// Screen 12 (SPEC.md §9, §4.2): one-tap in-journey escalation, structured record, mocked
// TTE receipt (clearly labelled).
export default function EscalatePage() {
  const { state } = useDemoState();
  const booking = state.booking;
  const [reason, setReason] = useState("Assigned RAC partner does not match my sharing preference.");
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const escalate = async () => {
    if (!booking) return;
    setLoading(true);
    const res = await fetch("/api/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pnr: booking.pnr, reason, timestamp: new Date(now()).toISOString() }),
    });
    setRecord(await res.json());
    setLoading(false);
  };

  if (!booking) {
    return (
      <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6">
        <p className="text-sm text-zinc-500">No booking found. Start a new search.</p>
        <Link href="/" className="text-black underline mt-2">Search trains</Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">Escalate</h1>

      <label className="flex flex-col gap-1 text-sm">
        Reason
        <textarea
          className="border rounded-md px-3 py-2"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>

      <button
        onClick={escalate}
        disabled={loading}
        className="rounded-md bg-black text-white py-3 font-medium disabled:opacity-60"
      >
        {loading ? "Sending…" : "Escalate now"}
      </button>

      {record && (
        <div className="border rounded-lg p-4 space-y-2 text-sm">
          <div>Escalation ID: <span className="font-mono">{String(record.escalationId)}</span></div>
          <div>Status: {String(record.status)}</div>
          <div className="rounded-md bg-zinc-100 border p-3 text-xs">
            {(record.mockedTteReceipt as { note: string }).note}
          </div>
        </div>
      )}
    </main>
  );
}
