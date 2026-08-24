"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo-state";

type EntitlementResult = { amount: number; ruleId: string; citation: string; isProposal: boolean };

// Screen 13 (SPEC.md §9, §7.3): amount, rule, citation, status through to notional credit.
// The contrast screen: plain, no fee, no upsell.
export default function EntitlementPage() {
  const { state } = useDemoState();
  const booking = state.booking;
  const chartOutcome = state.chartOutcome;
  const [result, setResult] = useState<EntitlementResult | null>(null);
  const [credited, setCredited] = useState(false);

  useEffect(() => {
    if (!booking || !chartOutcome) return;
    fetch("/api/fare/entitlement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, chartOutcome }),
    })
      .then((r) => r.json())
      .then(setResult);
  }, [booking, chartOutcome]);

  if (!booking || !chartOutcome) {
    return (
      <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6">
        <p className="text-sm text-zinc-500">
          Run chart preparation first so an outcome can be assessed.
        </p>
        <Link href="/chart-outcome" className="text-black underline mt-2">Go to chart preparation</Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      {result && result.amount > 0 ? (
        <>
          <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
            <p className="text-lg font-semibold text-emerald-900">
              You are owed ₹{result.amount}. No fee. Direct to your bank.
            </p>
          </div>

          <div className="text-xs text-zinc-500">
            PROPOSAL, NOT CURRENT POLICY — rule &quot;{result.ruleId}&quot;. {result.citation}
          </div>

          <div className="border rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">Compare with the private market</p>
            <p className="text-zinc-600">
              Paid &quot;refund assurance&quot; add-ons are bought upfront, often pay out the
              standard refund minus the app&apos;s own fee, credited to an in-app wallet rather
              than a bank account, and frequently arrive 10–16 days later. This entitlement:
              no fee, no wallet, notionally credited straight to your bank.
            </p>
          </div>

          <button
            onClick={() => setCredited(true)}
            disabled={credited}
            className="rounded-md bg-black text-white py-3 font-medium disabled:opacity-60"
          >
            {credited ? "Notionally credited (demo)" : "Assert entitlement"}
          </button>
        </>
      ) : (
        <p className="text-sm text-zinc-600">
          No entitlement applies to this outcome — your ticket was confirmed to a full berth.
        </p>
      )}
    </main>
  );
}
