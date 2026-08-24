"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Train } from "@/lib/types";

type TrainResult = Train & { racAvailability: { queueLength: number; statusLine: string } };

// Screen 2 (SPEC.md §9): RAC-bearing results, each with a plain-language status line.
export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsPageInner />
    </Suspense>
  );
}

function ResultsPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [trains, setTrains] = useState<TrainResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = params.get("from") ?? "";
    const to = params.get("to") ?? "";
    fetch(`/api/trains/search?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => {
        setTrains(data);
        setLoading(false);
      });
  }, [params]);

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">Trains with RAC availability</h1>

      {loading && <p className="text-sm text-zinc-500">Loading…</p>}
      {!loading && trains.length === 0 && (
        <p className="text-sm text-zinc-500">No trains found for this route.</p>
      )}

      {trains.map((t) => (
        <button
          key={t.number}
          onClick={() => router.push(`/rac-explainer?trainId=${t.number}`)}
          className="text-left border rounded-lg p-4 hover:bg-zinc-50"
        >
          <div className="flex justify-between items-baseline">
            <span className="font-medium">{t.name}</span>
            <span className="text-xs text-zinc-500">#{t.number}</span>
          </div>
          <div className="text-sm text-zinc-600">
            {t.from} → {t.to} · {t.isOvernight ? "Overnight" : "Day journey"}
          </div>
          <div className="text-sm text-amber-700 mt-1">{t.racAvailability.statusLine}</div>
        </button>
      ))}
    </main>
  );
}
