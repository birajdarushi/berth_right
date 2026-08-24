"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDemoState } from "@/lib/demo-state";
import { RAC_ENTITLEMENT_REFUND_RATIO } from "@/lib/fare-rules";

// Screen 7 (SPEC.md §9, §7): fare breakdown, refundable portion identified, proposal labelled.
export default function FarePage() {
  return (
    <Suspense>
      <FarePageInner />
    </Suspense>
  );
}

function FarePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, setState } = useDemoState();
  const trainId = params.get("trainId") ?? "";

  useEffect(() => {
    if (state.booking || !state.passengerName) return;
    fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId,
        preference: state.preference ?? "no_preference",
        passengers: [
          {
            id: "P1",
            displayName: state.passengerName,
            gender: state.gender ?? "female",
            age: state.passengerAge ?? 28,
            isMinor: (state.passengerAge ?? 28) < 18,
            travellingAlone: true,
          },
        ],
      }),
    })
      .then((r) => r.json())
      .then((booking) => setState({ booking }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.booking, state.passengerName]);

  const booking = state.booking;

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">Fare breakdown</h1>

      {!booking && <p className="text-sm text-zinc-500">Calculating…</p>}

      {booking && (
        <>
          <div className="border rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Total fare</span>
              <span>₹{booking.fare.totalFare}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Refundable if never confirmed (proposal)</span>
              <span>₹{booking.fare.refundablePortion}</span>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
            PROPOSAL, NOT CURRENT POLICY: if you hold RAC status through chart preparation and
            never get a full berth, {Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}% of your fare
            would be refunded automatically. Based on a February 2026 Parliamentary Standing
            Committee recommendation — not implemented by Indian Railways today.
          </div>

          <button
            onClick={() => router.push(`/payment?trainId=${trainId}`)}
            className="rounded-md bg-black text-white py-3 font-medium"
          >
            Continue
          </button>
        </>
      )}
    </main>
  );
}
