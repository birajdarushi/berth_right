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
          <Card className="gap-2 py-4 shadow-xs border-emerald-200/80 bg-emerald-50/30">
            <CardContent className="flex flex-col gap-2.5 px-4 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="block text-[11px] text-muted-foreground">
                    {lang === "hi"
                      ? "सिंथेटिक पीएनआर (काल्पनिक)"
                      : lang === "mr"
                      ? "सिंथेटिक पीएनआर (काल्पनिक)"
                      : "Synthetic PNR (Demo)"}
                  </span>
                  <span className="font-mono text-lg font-bold tracking-wider">{booking.pnr}</span>
                </div>
                <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                  {booking.status}
                  {booking.racPosition ? ` · pos ${booking.racPosition}` : ""}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 font-medium text-foreground text-sm">
                <TrainTrack className="size-4 text-primary" />
                {booking.train.name} · #{booking.train.number}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-muted-foreground" />
                {booking.train.from} → {booking.train.to}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
