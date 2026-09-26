"use client";

import { useDemoState } from "@/lib/demo-state";
import Link from "next/link";
import Screen from "@/components/Screen";
import NoBookingState from "@/components/NoBookingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, ArrowRight, TrainTrack } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 9 (SPEC.md §9): booking confirmation, synthetic PNR clearly formatted as non-real.
export default function ConfirmationPage() {
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const booking = state.booking;

  if (!booking) return <NoBookingState />;

  return (
    <Screen>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center py-2">
        {/* Left Column: Success icon, Title, & CTAs */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:col-span-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t.confirmation.title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {lang === "hi"
                ? "आपकी आरएसी बुकिंग सफलतापूर्वक दर्ज हो गई है।"
                : lang === "mr"
                ? "आपली आरएसी बुकिंग यशस्वीरित्या नोंदवली गेली आहे."
                : "Your RAC provisional ticket has been created."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
            <Button
              render={
                <Link href="/tracking" className="flex items-center justify-center gap-1.5 w-full">
                  {lang === "hi"
                    ? "इस बुकिंग को ट्रैक करें"
                    : lang === "mr"
                    ? "ही बुकिंग ट्रॅक करा"
                    : "Track this booking"}
                  <ArrowRight className="size-4" />
                </Link>
              }
              size="lg"
              className="min-h-11 w-full sm:w-auto font-medium"
            />
            <Button
              render={
                <Link href="/">
                  {lang === "hi"
                    ? "दूसरी ट्रेन खोजें"
                    : lang === "mr"
                    ? "दुसरी गाडी शोधा"
                    : "Search another train"}
                </Link>
              }
              variant="outline"
              size="lg"
              className="min-h-11 w-full sm:w-auto text-xs"
            />
          </div>
        </div>

        {/* Right Column: Ticket Card */}
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 paper-shadow flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  {lang === "hi"
                    ? "सिंथेटिक पीएनआर (काल्पनिक)"
                    : lang === "mr"
                    ? "सिंथेटिक पीएनआर (काल्पनिक)"
                    : "Synthetic PNR (Demo)"}
                </span>
                <span className="font-mono text-xl font-bold tracking-widest text-primary">{booking.pnr}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-[10px] uppercase">
                {booking.status}
                {booking.racPosition ? ` · pos ${booking.racPosition}` : ""}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold font-heading text-foreground text-sm">
              <TrainTrack className="size-4 text-primary" />
              {booking.train.name} · {booking.train.number}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <MapPin className="size-3.5 text-muted-foreground" />
              {booking.train.from} → {booking.train.to}
            </div>

            <div className="ticket-perforation pt-3 text-[11px] text-muted-foreground leading-relaxed">
              Ticket issued under RAC allocation rules. Side-lower berth shared with paired passenger.
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
