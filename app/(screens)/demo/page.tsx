"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { now, offsetTo, resetOffset, getOffset } from "@/lib/clock";
import { useDemoState } from "@/lib/demo-state";
import type { ChartBranch, ChartOutcome } from "@/app/api/chart/prepare/route";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sliders, Clock, FastForward, RotateCcw, GitBranch, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const SCREENS = [
  ["/queue", "Queue visualization"],
  ["/", "1. Search"],
  ["/results", "2. Results"],
  ["/rac-explainer", "3. What RAC means"],
  ["/boarding", "4. Boarding legality"],
  ["/preference", "5. Sharing preference"],
  ["/passengers", "6. Passengers"],
  ["/fare", "7. Fare"],
  ["/payment", "8. Fake payment"],
  ["/confirmation", "9. Confirmation"],
  ["/tracking", "10. Tracking"],
  ["/chart-outcome", "11. Chart outcome"],
  ["/escalate", "12. Escalate"],
  ["/entitlement", "13. Entitlement"],
  ["/limitations", "Limitations"],
];

// Screen 14 (SPEC.md §9): demo control panel — time travel, seed reset, branch
// selection. Deliberate and labelled, reachable from every screen.
export default function DemoPage() {
  const router = useRouter();
  const { state, setState, clear } = useDemoState();
  const { t, lang } = useI18n();
  const booking = state.booking;
  const [clockLabel, setClockLabel] = useState("");

  const branches: { value: ChartBranch; label: string }[] = [
    {
      value: "confirmed",
      label: lang === "hi" ? "पूर्ण कन्फर्म बर्थ में अपग्रेड" : lang === "mr" ? "पूर्ण कन्फर्म बर्थमध्ये अपग्रेड" : "Cleared to full berth",
    },
    {
      value: "rac_honoured",
      label: lang === "hi" ? "आरएसी — प्राथमिकता पूरी हुई" : lang === "mr" ? "आरएसी — पसंती पाळली गेली" : "RAC — preference honoured",
    },
    {
      value: "rac_unmet",
      label: lang === "hi" ? "आरएसी — प्राथमिकता पूरी नहीं + समाधान" : lang === "mr" ? "आरएसी — पसंती पूर्ण झाली नाही + तोडगा" : "RAC — preference unmet + remedy",
    },
  ];

  useEffect(() => {
    setClockLabel(new Date(now()).toISOString());
  }, [state.clockOffsetMs]);

  const jumpToChartPrep = () => {
    if (!booking) return;
    const target = new Date(booking.train.departure).getTime() - 4 * 60 * 60 * 1000;
    offsetTo(target);
    setState({ clockOffsetMs: getOffset() });
    setClockLabel(new Date(now()).toISOString());
    router.push("/chart-outcome");
  };

  const resetClock = () => {
    resetOffset();
    setState({ clockOffsetMs: 0 });
    setClockLabel(new Date(now()).toISOString());
  };

  const runBranch = async (seed: ChartBranch) => {
    if (!booking) return;
    const res = await fetch("/api/chart/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, seed }),
    });
    const data = (await res.json()) as ChartOutcome;
    setState({
      booking: { ...booking, status: data.status },
      chartOutcome: data,
      notification: `Chart prepared (${branches.find((b) => b.value === seed)?.label}). This notice is in-app only — no SMS was sent.`,
    });
    router.push("/chart-outcome");
  };

  return (
    <Screen>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.demo.title}</h1>
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground w-fit font-mono">
          <Clock className="size-3 mr-1" />
          {clockLabel ? clockLabel.replace("T", " ").slice(0, 19) : "—"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Box 1: Time Travel */}
        <Card className="shadow-2xs">
          <CardContent className="flex flex-col gap-2.5 p-4 text-xs">
            <p className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
              <FastForward className="size-4 text-primary" />
              {lang === "hi" ? "समय यात्रा" : lang === "mr" ? "वेळ प्रवास" : "Time travel"}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {booking
                ? (lang === "hi" ? `पीएनआर ${booking.pnr} सक्रिय है` : lang === "mr" ? `पीएनआर ${booking.pnr} सक्रिय आहे` : `PNR ${booking.pnr} active`)
                : (lang === "hi" ? "कोई सक्रिय बुकिंग नहीं" : lang === "mr" ? "सक्रिय बुकिंग नाही" : "No active booking")}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={jumpToChartPrep}
              disabled={!booking}
              className="text-xs min-h-9 justify-start"
            >
              {lang === "hi"
                ? "चार्ट तैयारी पर जाएं (-4h)"
                : lang === "mr"
                ? "चार्ट तयारीवर जा (-4h)"
                : "Jump to chart prep (-4h)"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetClock}
              className="text-xs min-h-8 text-muted-foreground justify-start"
            >
              <RotateCcw className="size-3 mr-1" />
              {lang === "hi" ? "घड़ी रीसेट करें" : lang === "mr" ? "घड्याळ रीसेट करा" : "Reset clock"}
            </Button>
          </CardContent>
        </Card>

        {/* Box 2: Chart Branches */}
        <Card className="shadow-2xs">
          <CardContent className="flex flex-col gap-2.5 p-4 text-xs">
            <p className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
              <GitBranch className="size-4 text-primary" />
              {lang === "hi" ? "चार्ट परिणाम" : lang === "mr" ? "चार्ट निकाल" : "Chart branches"}
            </p>
            <div className="flex flex-col gap-1.5">
              {branches.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => runBranch(b.value)}
                  disabled={!booking}
                  className="rounded-md border border-border/80 p-2 text-left text-xs transition-colors hover:border-primary hover:bg-accent/40 disabled:opacity-50 min-h-8"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Box 3: Reset & Quick Jump */}
        <Card className="shadow-2xs">
          <CardContent className="flex flex-col gap-2.5 p-4 text-xs">
            <p className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
              <Compass className="size-4 text-primary" />
              {lang === "hi" ? "त्वरित नेविगेशन" : lang === "mr" ? "जलद नेव्हिगेशन" : "Quick jump"}
            </p>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
              {SCREENS.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[11px] text-muted-foreground hover:text-primary hover:underline p-1 rounded hover:bg-muted/50 truncate"
                  title={label}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                resetClock();
                clear();
                router.push("/");
              }}
              className="text-xs min-h-8 mt-1"
            >
              {t.demo.resetDemo}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}
