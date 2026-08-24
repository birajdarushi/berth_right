"use client";

import Link from "next/link";
import { useDemoState } from "@/lib/demo-state";

// Screen 10 (SPEC.md §9): RAC position + provisional pairing.
// Privacy floor (§9.1): only gender and boarding/alighting station of a co-passenger,
// never name, age, or other identifying detail.
export default function TrackingPage() {
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
      <h1 className="text-xl font-semibold">Tracking</h1>

      <div className="border rounded-lg p-4 space-y-1">
        <div className="text-sm">PNR <span className="font-mono">{booking.pnr}</span></div>
        <div className="text-sm">Status: <strong>{booking.status}</strong>{booking.racPosition ? `, position ${booking.racPosition}` : ""}</div>
        <div className="text-sm">{booking.train.name} · {booking.train.from} → {booking.train.to}</div>
      </div>

      <div className="rounded-lg bg-zinc-50 border p-4 text-sm">
        <p className="font-medium mb-1">Provisional pairing</p>
        <p className="text-zinc-600">
          Final pairing is decided at chart preparation. Until then, this is provisional and
          may change as the RAC queue moves.
        </p>
      </div>

      <Link
        href="/chart-outcome"
        className="rounded-md bg-black text-white py-3 font-medium text-center"
      >
        Jump to chart preparation (demo time travel)
      </Link>
    </main>
  );
}
