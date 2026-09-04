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
          <Card
            key={tItem.number}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/rac-explainer?trainId=${tItem.number}`)}
            className="cursor-pointer gap-2 py-3.5 shadow-2xs transition-all hover:border-primary hover:shadow-xs hover:bg-accent/40"
          >
            <CardContent className="flex flex-col gap-2 px-4">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm sm:text-base text-foreground leading-snug">{tItem.name}</span>
                <span className="shrink-0 font-mono text-xs font-medium text-muted-foreground">#{tItem.number}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{tItem.from} → {tItem.to}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  {tItem.isOvernight ? <Moon className="size-3.5 text-indigo-500" /> : <Sun className="size-3.5 text-amber-500" />}
                  {tItem.isOvernight
                    ? (lang === "hi" ? "रात की यात्रा" : lang === "mr" ? "रात्रीचा प्रवास" : "Overnight")
                    : (lang === "hi" ? "दिन की यात्रा" : lang === "mr" ? "दिवसाचा प्रवास" : "Day journey")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 mt-1">
                <Badge variant="secondary" className="text-[11px] text-amber-800 bg-amber-50/80 border-amber-200">
                  {tItem.racAvailability.statusLine}
                </Badge>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
