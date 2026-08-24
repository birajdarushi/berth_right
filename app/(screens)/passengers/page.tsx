"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useDemoState } from "@/lib/demo-state";

// Screen 6 (SPEC.md §9): passenger details, synthetic only.
export default function PassengersPage() {
  return (
    <Suspense>
      <PassengersPageInner />
    </Suspense>
  );
}

function PassengersPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setState } = useDemoState();
  const trainId = params.get("trainId") ?? "";

  const [name, setName] = useState("Demo Traveller");
  const [age, setAge] = useState(28);

  const continueToFare = () => {
    setState({ passengerName: name, passengerAge: age });
    router.push(`/fare?trainId=${trainId}`);
  };

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">Passenger details</h1>
      <p className="text-xs text-zinc-500">
        Use a synthetic name — this is a demo, not a real booking.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          className="border rounded-md px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Age
        <input
          type="number"
          className="border rounded-md px-3 py-2"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </label>

      <button
        onClick={continueToFare}
        className="rounded-md bg-black text-white py-3 font-medium"
      >
        Continue
      </button>
    </main>
  );
}
