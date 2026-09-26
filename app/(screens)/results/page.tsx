"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Train } from "@/lib/types";
import Screen from "@/components/Screen";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun, ChevronRight, TrainTrack } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

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
  const { t, lang } = useI18n();
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
    <Screen>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <TrainTrack className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.results.title}</h1>
        </div>
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {lang === "hi" ? `${trains.length} ट्रेनें उपलब्ध` : lang === "mr" ? `${trains.length} गाड्या उपलब्ध` : `${trains.length} trains found`}
          </span>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && trains.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">{t.results.noTrainsFound}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {trains.map((tItem) => (
          <div
            key={tItem.number}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/rac-explainer?trainId=${tItem.number}`)}
            className="cursor-pointer rounded-xl border border-border/80 bg-card p-4 paper-shadow transition-all hover:border-primary/80 hover:shadow-md flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-border/50">
              <span className="font-bold text-sm sm:text-base text-foreground font-heading leading-snug">{tItem.name}</span>
              <span className="shrink-0 font-mono text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{tItem.number}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <span className="font-semibold text-foreground">{tItem.from} → {tItem.to}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-sans">
                {tItem.isOvernight ? <Moon className="size-3.5 text-muted-foreground" /> : <Sun className="size-3.5 text-muted-foreground" />}
                {tItem.isOvernight
                  ? (lang === "hi" ? "रात की यात्रा" : lang === "mr" ? "रात्रीचा प्रवास" : "Overnight")
                  : (lang === "hi" ? "दिन की यात्रा" : lang === "mr" ? "दिवसाचा प्रवास" : "Day journey")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 mt-auto">
              <span className="text-[11px] text-foreground/80 leading-tight">
                {tItem.racAvailability.statusLine}
              </span>
              <ChevronRight className="size-4 shrink-0 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
