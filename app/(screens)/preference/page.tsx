"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import type { Gender, SharingPreference } from "@/lib/types";

const PREFERENCES: { value: SharingPreference; label: string; description: string }[] = [
  { value: "same_gender_only", label: "Same gender only", description: "Hard rule: you will only ever share a berth with someone of the same gender, or travel unpaired." },
  { value: "prefer_same_gender", label: "Prefer same gender", description: "Honoured when possible, but never blocks or delays your confirmation." },
  { value: "companion", label: "Travelling with a companion", description: "Paired with a named co-passenger on the same booking." },
  { value: "no_preference", label: "No preference", description: "No constraint on who you're paired with." },
];

// Screen 5 (SPEC.md §9, §6.4): sharing preference with honest disclosure of its cost.
export default function PreferencePage() {
  return (
    <Suspense>
      <PreferencePageInner />
    </Suspense>
  );
}

function PreferencePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setState } = useDemoState();
  const trainId = params.get("trainId") ?? "";

  const [gender, setGender] = useState<Gender>("female");
  const [preference, setPreference] = useState<SharingPreference>("same_gender_only");
  const [cost, setCost] = useState<{ estimatedPositionDelta: number; basis: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkCost = async (g: Gender, p: SharingPreference) => {
    setLoading(true);
    const res = await fetch("/api/rac/preference/cost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainId, gender: g, preference: p }),
    });
    setCost(await res.json());
    setLoading(false);
  };

  const choose = (p: SharingPreference) => {
    setPreference(p);
    checkCost(gender, p);
  };

  const chooseGender = (g: Gender) => {
    setGender(g);
    checkCost(g, preference);
  };

  const continueToPassengers = () => {
    setState({ trainNumber: trainId, gender, preference });
    router.push(`/passengers?trainId=${trainId}`);
  };

  return (
    <main className="flex flex-1 flex-col max-w-md w-full mx-auto px-4 py-6 gap-4">
      <h1 className="text-xl font-semibold">Sharing preference</h1>

      <label className="flex flex-col gap-1 text-sm">
        Your gender
        <select
          className="border rounded-md px-3 py-2"
          value={gender}
          onChange={(e) => chooseGender(e.target.value as Gender)}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="transgender">Transgender</option>
        </select>
      </label>

      <div className="flex flex-col gap-2">
        {PREFERENCES.map((p) => (
          <label
            key={p.value}
            className={`border rounded-lg p-3 cursor-pointer ${preference === p.value ? "border-black bg-zinc-50" : ""}`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="preference"
                checked={preference === p.value}
                onChange={() => choose(p.value)}
              />
              <span className="font-medium">{p.label}</span>
            </div>
            <p className="text-xs text-zinc-600 mt-1">{p.description}</p>
          </label>
        ))}
      </div>

      {preference === "same_gender_only" && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          {loading && "Estimating…"}
          {!loading && cost && cost.estimatedPositionDelta > 0 && (
            <>Same-gender only may move you approximately <strong>{cost.estimatedPositionDelta} places back</strong> in the RAC queue on this train. {cost.basis}</>
          )}
          {!loading && cost && cost.estimatedPositionDelta === 0 && (
            <>No estimated queue-position cost for this train right now. {cost.basis}</>
          )}
        </div>
      )}

      <button
        onClick={continueToPassengers}
        className="rounded-md bg-black text-white py-3 font-medium"
      >
        Continue
      </button>
    </main>
  );
}
