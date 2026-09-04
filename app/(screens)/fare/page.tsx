"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useDemoState } from "@/lib/demo-state";
import { RAC_ENTITLEMENT_REFUND_RATIO } from "@/lib/fare-rules";
import Term from "@/components/Term";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, ArrowRight, ReceiptText, TicketX } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 7 (SPEC.md §9, §7): fare breakdown, refundable portion identified, proposal labelled.
export default function FarePage() {
  return (
    <Suspense>
      <FarePageInner />
    </Suspense>
  );
}

function FarePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, setState } = useDemoState();
  const { t, lang } = useI18n();
  const trainId = params.get("trainId") ?? "";
  const [bookingFailed, setBookingFailed] = useState(false);

  useEffect(() => {
    if (state.booking || !state.passengerName) return;
    fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId,
        preference: state.preference ?? "no_preference",
        passengers: [
          {
            id: "P1",
            displayName: state.passengerName,
            gender: state.gender ?? "female",
            age: state.passengerAge ?? 28,
            isMinor: (state.passengerAge ?? 28) < 18,
            travellingAlone: true,
          },
        ],
      }),
    })
      .then((r) => r.json())
      .then((booking) => {
        if (booking?.pnr) {
          setState({ booking });
        } else {
          setBookingFailed(true);
        }
      })
      .catch(() => setBookingFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.booking, state.passengerName]);

  const booking = state.booking;

  return (
    <Screen>
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <ReceiptText className="size-5 text-primary" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.fare.title}</h1>
      </div>

      {!booking && !bookingFailed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}

      {!booking && bookingFailed && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <TicketX className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "बुकिंग नहीं बन सकी — कृपया फिर से खोजें।"
              : lang === "mr"
              ? "बुकिंग करता आले नाही — कृपया पुन्हा शोधा."
              : "Couldn't create a booking — please search again."}
          </p>
          <Button render={<Link href="/">{lang === "hi" ? "फिर से खोजें" : lang === "mr" ? "पुन्हा शोधा" : "Search again"}</Link>} size="sm" />
        </div>
      )}

      {booking && booking.fare && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
          {/* Left Column: Fare breakdown & terms */}
          <div className="flex flex-col gap-3">
            <Card className="gap-2 py-3.5 shadow-2xs">
              <CardContent className="flex flex-col gap-2 px-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t.fare.totalAmount}</span>
                  <span className="font-semibold text-base">₹{booking.fare.totalFare}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="text-xs sm:text-sm">
                    {lang === "hi"
                      ? "पूर्ण कन्फर्म न होने पर 50% रिफंडेबल (प्रस्तावित)"
                      : lang === "mr"
                      ? "कधीही कन्फर्म न झाल्यास ५०% परतावा पात्र (प्रस्ताव)"
                      : "Refundable if never confirmed (proposal)"}
                  </span>
                  <span className="text-base font-bold">₹{booking.fare.refundablePortion}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-1">
              <Term id="clerkage" />
              <Term id="chart" />
            </div>
          </div>

          {/* Right Column: Policy notice & CTA */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-950 leading-relaxed shadow-2xs">
              <Info className="size-4 shrink-0 translate-y-0.5 text-emerald-700" />
              <p>
                {lang === "hi"
                  ? `नीतिगत प्रस्ताव, वर्तमान नियम नहीं: यदि आप चार्ट बनने तक आरएसी स्थिति में रहते हैं और पूरी बर्थ नहीं मिलती है, तो आपके किराए का ${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}% स्वचालित रूप से वापस कर दिया जाएगा। फरवरी 2026 की संसदीय स्थायी समिति की सिफारिश पर आधारित — वर्तमान में भारतीय रेलवे द्वारा लागू नहीं।`
                  : lang === "mr"
                  ? `धोरणात्मक प्रस्ताव, सध्याचा नियम नाही: जर तुम्ही चार्ट तयार होईपर्यंत आरएसी स्थितीत राहिलात आणि पूर्ण बर्थ मिळाली नाही, तर तुमच्या भाड्याचा ${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}% भाग आपोआप परत केला जाईल. फेब्रुवारी २०२६ च्या संसदीय स्थायी समितीच्या शिफारशीवर आधारित — सध्या भारतीय रेल्वेने लागू केलेले नाही.`
                  : `PROPOSAL, NOT CURRENT POLICY: if you hold RAC status through chart preparation and never get a full berth, ${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}% of your fare would be refunded automatically. Based on a February 2026 Parliamentary Standing Committee recommendation — not implemented by Indian Railways today.`}
              </p>
            </div>

            <Button
              onClick={() => router.push(`/boarding?trainId=${trainId}`)}
              size="lg"
              className="min-h-11 gap-1.5 font-medium"
            >
              {t.common.continue}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </Screen>
  );
}
