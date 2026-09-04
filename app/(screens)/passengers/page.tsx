"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, UserCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

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
  const { t, lang } = useI18n();
  const trainId = params.get("trainId") ?? "";

  const [name, setName] = useState("Demo Traveller");
  const [age, setAge] = useState(28);

  const continueToFare = () => {
    setState({ passengerName: name, passengerAge: age });
    router.push(`/fare?trainId=${trainId}`);
  };

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.passengers.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {lang === "hi"
            ? "काल्पनिक नाम का उपयोग करें — यह एक डेमो है, वास्तविक बुकिंग नहीं।"
            : lang === "mr"
            ? "काल्पनिक नाव वापरा — हा एक डेमो आहे, खरी बुकिंग नाही."
            : "Use a synthetic name — this is a demo, not a real booking."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2">
        <div className="flex flex-col gap-1.5 sm:col-span-8">
          <Label htmlFor="name" className="text-xs font-semibold">{t.passengers.fullName}</Label>
          <Input id="name" className="min-h-11" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-4">
          <Label htmlFor="age" className="text-xs font-semibold">{t.passengers.ageLabel}</Label>
          <Input
            id="age"
            type="number"
            className="min-h-11"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
      </div>

      <Button onClick={continueToFare} size="lg" className="min-h-11 gap-1.5 font-medium mt-3">
        {t.common.continue}
        <ArrowRight className="size-4" />
      </Button>
    </Screen>
  );
}
