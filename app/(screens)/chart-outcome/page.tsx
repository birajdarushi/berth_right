"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import type { ChartOutcome, ChartBranch } from "@/app/api/chart/prepare/route";

const BRANCHES: { value: ChartBranch; label: string }[] = [
  { value: "confirmed", label: "Cleared to full berth" },
  { value: "rac_honoured", label: "RAC — preference honoured" },
  { value: "rac_unmet", label: "RAC — preference unmet + remedy" },
];

// Screen 11 (SPEC.md §9, §4.1 #7-8): all three chart-preparation outcomes, reachable on
// demand — this doubles as the demo time-travel/branch-selection control for this step.
export default function ChartOutcomePage() {
  const { state, setState } = useDemoState();
  const [outcome, setOutcome] = useState<ChartOutcome | null>(null);
  const [loading, setLoading] = useState<ChartBranch | null>(null);
  const booking = state.booking;

  const runBranch = async (seed: ChartBranch) => {
    if (!booking) return;
    setLoading(seed);
    const res = await fetch("/api/chart/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, seed }),
    });
    const data = (await res.json()) as ChartOutcome;
    setOutcome(data);
    setState({ booking: { ...booking, status: data.status }, chartOutcome: data });
    setLoading(null);
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
      <h1 className="text-xl font-semibold">Chart preparation</h1>
      <p className="text-xs text-zinc-500">
        Demo control: pick a branch to time-travel to chart preparation with that outcome.
      </p>

      <div className="flex flex-col gap-2">
        {BRANCHES.map((b) => (
          <button
            key={b.value}
            onClick={() => runBranch(b.value)}
            disabled={loading === b.value}
            className="border rounded-lg p-3 text-left hover:bg-zinc-50 disabled:opacity-60"
          >
            {loading === b.value ? "Preparing chart…" : b.label}
          </button>
        ))}
      </div>

      {outcome && (
        <div className="border rounded-lg p-4 space-y-2">
          <div className="text-sm font-medium">Status: {outcome.status}</div>
          <p className="text-sm text-zinc-700">{outcome.explanation}</p>
          {outcome.remedy && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
              {outcome.remedy}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            {outcome.status === "RAC" && (
              <Link href="/escalate" className="text-sm underline">Escalate in-journey</Link>
            )}
            {outcome.status === "RAC" && (
              <Link href="/entitlement" className="text-sm underline">View entitlement</Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
