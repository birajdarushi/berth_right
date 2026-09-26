"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDemoState } from "@/lib/demo-state";
import { SEED_COACHES, SEED_RAC_QUEUES } from "@/lib/seed";
import type { RacEntry } from "@/lib/types";
import Term from "@/components/Term";
import Screen from "@/components/Screen";
import NoBookingState from "@/components/NoBookingState";
import QueueVisualization from "@/components/QueueVisualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Users, ArrowRight, TrainTrack } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 10 (SPEC.md §9): RAC position + provisional pairing.
// Privacy floor (§9.1): only gender and boarding/alighting station of a co-passenger,
// never name, age, or other identifying detail.
export default function TrackingPage() {
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const booking = state.booking;
  const self = booking?.passengers?.[0];

  const queueWithSelf = useMemo(() => {
    if (!booking || !self) return null;
    const queue = SEED_RAC_QUEUES[booking.train.number] ?? [];
    const berths = (SEED_COACHES[booking.train.number] ?? []).flatMap((c) => c.sideLowerBerths);
    const selfEntry: RacEntry = {
      position: booking.racPosition ?? queue.length + 1,
      passenger: self,
      preference: state.preference ?? "no_preference",
      boardingStation: booking.train.from,
      alightingStation: booking.train.to,
      bookedAt: booking.createdAt,
    };
    return { queue: [...queue, selfEntry], berths };
  }, [booking, self, state.preference]);

  if (!booking || !self || !queueWithSelf) return <NoBookingState />;

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.tracking.title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t.tracking.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
        {/* Left Column: Booking Info, Chart Term, & Action */}
        <div className="flex flex-col gap-3.5 md:col-span-5">
          <div className="rounded-xl border border-border/80 bg-card p-4 paper-shadow flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[10px] uppercase font-bold font-mono text-muted-foreground">{t.common.pnr}</span>
              <span className="font-mono text-base font-bold tracking-wider text-primary">{booking.pnr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t.common.status}</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-[10px] uppercase">
                  {booking.status}
                </span>
                {booking.racPosition && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {lang === "hi" ? `स्थान ${booking.racPosition}` : lang === "mr" ? `स्थान ${booking.racPosition}` : `pos ${booking.racPosition}`}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground/90 font-bold font-heading pt-1">
              <TrainTrack className="size-3.5 text-primary" />
              <span>{booking.train.name}</span> · {booking.train.number}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {booking.train.from} → {booking.train.to}
            </div>
          </div>

          <Term id="chart" />

          <Button
            render={
              <Link href="/chart-outcome" className="flex items-center justify-center gap-2 w-full text-center">
                <span>
                  {lang === "hi"
                    ? "चार्ट परिणाम पर जाएं (डेमो)"
                    : lang === "mr"
                    ? "चार्ट निकालावर जा (डेमो)"
                    : "Jump to chart preparation (demo)"}
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            }
            size="lg"
            className="h-auto min-h-11 py-2.5 px-4 text-xs sm:text-sm font-semibold shadow-xs mt-1 w-full whitespace-normal leading-snug justify-center"
          />
        </div>

        {/* Right Column: Provisional Pairing & Queue */}
        <div className="flex flex-col gap-3 md:col-span-7">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 paper-shadow flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <p className="flex items-center gap-1.5 text-sm font-bold font-heading text-foreground">
                <Users className="size-4 text-primary" />
                {t.confirmation.provisionalPartnerTitle}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded border border-border/60">
                {lang === "hi" ? "लाइव सिमुलेशन" : lang === "mr" ? "थेट सिम्युलेशन" : "Live Simulation"}
              </span>
            </div>

            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
              <EyeOff className="size-3.5 shrink-0 translate-y-0.5 text-primary" />
              <span>
                {lang === "hi"
                  ? "गोपनीयता मानक: केवल सह-यात्री का लिंग और स्टेशन। कभी भी नाम, उम्र, फोटो या संपर्क नहीं।"
                  : lang === "mr"
                  ? "गोपनीयता नियम: फक्त सह-प्रवाशाचे लिंग आणि स्थानके. नाव, वय, फोटो किंवा संपर्क कधीही नाही."
                  : "Privacy floor: co-passenger gender and stations only. Never name, age, photo, or contact."}
              </span>
            </p>

            <QueueVisualization
              queue={queueWithSelf.queue}
              berthIds={queueWithSelf.berths}
              selfPassengerId={self.id}
            />

            <p className="text-[11px] text-muted-foreground text-center font-mono">
              {lang === "hi"
                ? "अंतिम पेयरिंग चार्ट बनने पर तय होती है। तब तक आरएसी कतार में बदलाव के अनुसार यह बदल सकता है।"
                : lang === "mr"
                ? "अंतिम पेअरिंग चार्ट तयार होताना ठरते. तोपर्यंत आरएसी रांग हलल्यास यात बदल होऊ शकतो."
                : "Final pairing is decided at chart preparation. Until then this may change as the RAC queue moves."}
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
