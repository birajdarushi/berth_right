"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

// Screen 3 (SPEC.md §9): what RAC actually means, with a diagram of a shared
// side-lower berth — most first-time bookers have never seen it explained.
export default function RacExplainerPage() {
  return (
    <Suspense>
      <RacExplainerPageInner />
    </Suspense>
  );
}

function RacExplainerPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const trainId = params.get("trainId") ?? "";

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">What RAC actually means</h1>
      <p className="text-sm text-zinc-700">
        RAC — Reservation Against Cancellation — means you have a confirmed berth number,
        but it&apos;s a <strong>side-lower berth shared with one other passenger</strong> until a
        full berth opens up (or the journey ends).
      </p>

      <svg viewBox="0 0 320 140" className="w-full border rounded-lg bg-zinc-50" role="img" aria-label="Diagram of a shared side-lower berth">
        <rect x="10" y="20" width="300" height="40" rx="6" fill="#e4e4e7" stroke="#a1a1aa" />
        <text x="160" y="15" textAnchor="middle" fontSize="10" fill="#52525b">Side-lower berth (one mattress width)</text>
        <circle cx="90" cy="40" r="16" fill="#f9a8d4" />
        <text x="90" y="44" textAnchor="middle" fontSize="9" fill="#831843">RAC A</text>
        <circle cx="230" cy="40" r="16" fill="#93c5fd" />
        <text x="230" y="44" textAnchor="middle" fontSize="9" fill="#1e3a8a">RAC B</text>
        <line x1="160" y1="20" x2="160" y2="60" stroke="#a1a1aa" strokeDasharray="4" />
        <text x="160" y="80" textAnchor="middle" fontSize="9" fill="#71717a">Two passengers, one berth, split by day/night turns</text>
      </svg>

      <p className="text-sm text-zinc-700">
        Today, the two passengers sharing that berth are paired without regard to gender.
        Berth Right adds a gender-aware pairing step so a woman travelling alone isn&apos;t
        paired with a male stranger overnight.
      </p>

      <button
        onClick={() => router.push(`/preference?trainId=${trainId}`)}
        className="rounded-md bg-black text-white py-3 font-medium"
      >
        Continue
      </button>
    </main>
  );
}
