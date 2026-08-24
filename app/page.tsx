"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SEED_STATIONS } from "@/lib/seed";

// Screen 1 (SPEC.md §9): search, three taps max. Leads with the premise per §15.3
// rather than burying it under a bare form.
export default function SearchPage() {
  const router = useRouter();
  const [routeIdx, setRouteIdx] = useState(0);
  const route = SEED_STATIONS[routeIdx];

  const submit = () => {
    router.push(`/results?from=${route.from}&to=${route.to}`);
  };

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-6">
      <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900">
        <p className="font-semibold mb-1">A gender-blind gap in the railway&apos;s RAC system</p>
        <p>
          Two RAC passengers share one side-lower berth overnight. Gender is not part of
          how they&apos;re paired today. Berth Right prototypes a fix — and an honest refund for
          passengers who never get a full berth.
        </p>
      </div>

      <h1 className="text-xl font-semibold">Search trains</h1>

      <label className="flex flex-col gap-1 text-sm">
        Route
        <select
          className="border rounded-md px-3 py-2"
          value={routeIdx}
          onChange={(e) => setRouteIdx(Number(e.target.value))}
        >
          {SEED_STATIONS.map((s, i) => (
            <option key={s.from + s.to} value={i}>
              {s.fromName} ({s.from}) → {s.toName} ({s.to})
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={submit}
        className="rounded-md bg-black text-white py-3 font-medium"
      >
        Search
      </button>
    </main>
  );
}
