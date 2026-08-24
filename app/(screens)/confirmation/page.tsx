"use client";

import { useDemoState } from "@/lib/demo-state";
import Link from "next/link";

// Screen 9 (SPEC.md §9): booking confirmation, synthetic PNR clearly formatted as non-real.
export default function ConfirmationPage() {
  const { state } = useDemoState();
  const booking = state.booking;

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
      <h1 className="text-xl font-semibold">Booking confirmed</h1>

      <div className="border rounded-lg p-4 space-y-2">
        <div>
          <span className="text-xs text-zinc-500 block">Synthetic PNR (not a real PNR)</span>
          <span className="font-mono text-lg">{booking.pnr}</span>
        </div>
        <div className="text-sm">{booking.train.name} · #{booking.train.number}</div>
        <div className="text-sm">{booking.train.from} → {booking.train.to}</div>
        <div className="text-sm">
          Status: <strong>RAC</strong>{booking.racPosition ? `, position ${booking.racPosition}` : ""}
        </div>
      </div>

      <Link
        href="/tracking"
        className="rounded-md bg-black text-white py-3 font-medium text-center"
      >
        Track this booking
      </Link>
      <Link href="/" className="text-sm text-center text-zinc-600 underline">
        Search another train
      </Link>
    </main>
  );
}
