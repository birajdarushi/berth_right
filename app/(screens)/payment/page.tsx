"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";

// Screen 8 (SPEC.md §4.2, §9): mock payment — visibly fake, never resembling a real gateway.
export default function PaymentPage() {
  const router = useRouter();
  const { state } = useDemoState();
  const [paying, setPaying] = useState(false);

  const pay = () => {
    setPaying(true);
    setTimeout(() => router.push("/confirmation"), 700);
  };

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <div className="rounded-lg border-2 border-dashed border-fuchsia-400 bg-fuchsia-50 p-6 text-center">
        <p className="text-fuchsia-700 font-bold text-lg mb-2">FAKE PAYMENT SCREEN — DEMO ONLY</p>
        <p className="text-sm text-fuchsia-900 mb-4">
          No real payment gateway. No money moves. Nothing is charged to any card.
        </p>
        <p className="text-2xl font-semibold mb-4">₹{state.booking?.fare.totalFare ?? "—"}</p>
        <button
          disabled={paying}
          onClick={pay}
          className="rounded-md bg-fuchsia-600 text-white py-3 px-6 font-medium disabled:opacity-60"
        >
          {paying ? "Processing (fake)…" : "Pay (fake)"}
        </button>
      </div>
    </main>
  );
}
