"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import type { ChartOutcome, ChartBranch } from "@/app/api/chart/prepare/route";
import ExplainBlock from "@/components/ExplainBlock";
import Term from "@/components/Term";
import Screen from "@/components/Screen";
import NoBookingState from "@/components/NoBookingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, TriangleAlert, Loader2, GitBranch } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 11 (SPEC.md §9, §4.1 #7-8): all three chart-preparation outcomes, reachable on
// demand — this doubles as the demo time-travel/branch-selection control for this step.
export default function ChartOutcomePage() {
  const { state, setState } = useDemoState();
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState<ChartBranch | null>(null);
  const booking = state.booking;
  const outcome = state.chartOutcome ?? null;

  const branches: { value: ChartBranch; label: string; icon: typeof CheckCircle2 }[] = [
    {
      value: "confirmed",
      label: lang === "hi" ? "पूर्ण कन्फर्म बर्थ में अपग्रेड" : lang === "mr" ? "पूर्ण कन्फर्म बर्थमध्ये अपग्रेड" : "Cleared to full berth",
      icon: CheckCircle2,
    },
    {
      value: "rac_honoured",
      label: lang === "hi" ? "आरएसी — प्राथमिकता पूरी हुई" : lang === "mr" ? "आरएसी — पसंती पाळली गेली" : "RAC — preference honoured",
      icon: Users,
    },
    {
      value: "rac_unmet",
      label: lang === "hi" ? "आरएसी — प्राथमिकता पूरी नहीं + समाधान" : lang === "mr" ? "आरएसी — पसंती पूर्ण झाली नाही + तोडगा" : "RAC — preference unmet + remedy",
      icon: TriangleAlert,
    },
  ];

  const runBranch = async (seed: ChartBranch) => {
    if (!booking) return;
    setLoading(seed);
    const res = await fetch("/api/chart/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, seed }),
    });
    const data = (await res.json()) as ChartOutcome;
    setState({
      booking: { ...booking, status: data.status },
      chartOutcome: data,
      notification:
        lang === "hi"
          ? `चार्ट तैयार — ${data.status}। यह सूचना केवल ऐप में है; कोई एसएमएस नहीं भेजा गया।`
          : lang === "mr"
          ? `चार्ट तयार झाला — ${data.status}. ही सूचना फक्त अ‍ॅपमध्ये आहे; कोणताही एसएमएस पाठवला नाही.`
          : `Chart prepared — ${data.status}. This notice is in-app only; no SMS was sent.`,
    });
    setLoading(null);
  };

  if (!booking) return <NoBookingState />;

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {lang === "hi" ? "चार्ट तैयार होना" : lang === "mr" ? "चार्ट तयार करणे" : "Chart preparation"}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {lang === "hi"
            ? "डेमो नियंत्रण: उस परिणाम के साथ चार्ट तैयारी के समय पर जाने के लिए एक शाखा चुनें।"
            : lang === "mr"
            ? "डेमो नियंत्रण: त्या निकालासह चार्ट तयारीवर जाण्यासाठी एक पर्याय निवडा."
            : "Demo control: pick a branch to time-travel to chart preparation with that outcome."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* Left Column: Branch selector & Term */}
        <div className="flex flex-col gap-3 md:col-span-5">
          <div className="flex flex-col gap-2">
            {branches.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.value}
                  onClick={() => runBranch(b.value)}
                  disabled={loading === b.value}
                  className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border/80 bg-card p-3 text-left text-xs sm:text-sm font-semibold transition-all hover:border-primary hover:bg-primary/5 paper-shadow disabled:opacity-60"
                >
                  {loading === b.value ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                  ) : (
                    <Icon className="size-4 shrink-0 text-primary" />
                  )}
                  <span className="text-foreground">
                    {loading === b.value
                      ? (lang === "hi" ? "चार्ट तैयार किया जा रहा है…" : lang === "mr" ? "चार्ट तयार होत आहे…" : "Preparing chart…")
                      : b.label}
                  </span>
                </button>
              );
            })}
          </div>

          <Term id="chart" />
        </div>

        {/* Right Column: Outcome & ExplainBlock */}
        <div className="flex flex-col gap-4 md:col-span-7">
          {outcome ? (
            <div className="rounded-xl border border-border/80 bg-card p-5 paper-shadow flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60 text-sm">
                <span className="text-xs uppercase font-mono font-bold text-muted-foreground">{t.common.status}</span>
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-xs uppercase">
                  {outcome.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">{outcome.explanation}</p>
              {outcome.remedy && (
                <div className="flex gap-2 rounded-lg border border-primary/20 bg-muted/30 p-3 text-xs leading-relaxed text-foreground/90">
                  <TriangleAlert className="size-4 shrink-0 translate-y-0.5 text-primary" />
                  <span>{outcome.remedy}</span>
                </div>
              )}
              <ExplainBlock
                topic="chart"
                context={`Branch ${outcome.branch}. Status ${outcome.status}. Preference honoured: ${String(outcome.preferenceHonoured)}. Solver/text: ${outcome.explanation}${outcome.remedy ? ` Remedy: ${outcome.remedy}` : ""}`}
              />
              {outcome.status === "RAC" && (
                <div className="flex flex-wrap gap-4 pt-2 border-t border-border/60">
                  <Link
                    href="/escalate"
                    className="text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {lang === "hi"
                      ? "यात्रा के दौरान शिकायत दर्ज करें →"
                      : lang === "mr"
                      ? "प्रवासात तक्रार नोंदवा →"
                      : "Escalate in-journey →"}
                  </Link>
                  <Link
                    href="/entitlement"
                    className="text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {lang === "hi"
                      ? "रिफंड अधिकार देखें →"
                      : lang === "mr"
                      ? "परतावा अधिकार पहा →"
                      : "View entitlement →"}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-xs text-muted-foreground paper-shadow">
              {lang === "hi"
                ? "परिणाम देखने के लिए बाईं ओर से एक शाखा चुनें।"
                : lang === "mr"
                ? "निकाल पाहण्यासाठी डावीकडील एक पर्याय निवडा."
                : "Select a branch on the left to simulate the chart outcome."}
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
