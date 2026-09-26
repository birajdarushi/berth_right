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
            <div className="rounded-xl border border-primary/20 bg-muted/20 p-4 paper-shadow text-xs leading-relaxed">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-[10px] uppercase tracking-wider mb-2">
                <Info className="size-3" />
                <span>{lang === "hi" ? "संसदीय समिति की सिफारिश (फरवरी 2026)" : lang === "mr" ? "संसदीय समितीची शिफारस (फेब्रुवारी २०२६)" : "Parliamentary Committee Finding (Feb 2026)"}</span>
              </div>

              <div className="flex flex-col gap-2 mt-1 text-foreground/85">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary font-bold">•</span>
                  <p>
                    {lang === "hi"
                      ? `यदि चार्ट बनने तक आपको पूरी बर्थ नहीं मिलती है, तो ₹${booking.fare.refundablePortion} (${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}%) सीधे आपके बैंक खाते में वापस आएगा।`
                      : lang === "mr"
                      ? `चार्ट तयार होईपर्यंत पूर्ण बर्थ न मिळाल्यास, ₹${booking.fare.refundablePortion} (${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}%) थेट बँक खात्यात परत जमा होतील.`
                      : `If your berth never confirms and you share an RAC berth overnight, ₹${booking.fare.refundablePortion} (${Math.round(RAC_ENTITLEMENT_REFUND_RATIO * 100)}%) is refunded directly to your bank.`}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary font-bold">•</span>
                  <p>
                    {lang === "hi"
                      ? "कोई टीडीआर फॉर्म या क्लर्केज शुल्क नहीं — यह आपका अधिकार है, कोई सशुल्क 'रिफंड इंश्योरेंस' नहीं।"
                      : lang === "mr"
                      ? "कोणताही टीडीआर फॉर्म किंवा शुल्क नाही — हा तुमचा हक्क आहे, कोणतेही सशुल्क इन्शुरन्स नाही."
                      : "No TDR claim forms, no clerkage fee — treated as an automatic entitlement, not a paid add-on."}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary font-bold">•</span>
                  <p className="text-[11px] text-muted-foreground">
                    {lang === "hi"
                      ? "स्थिति: नीतिगत प्रस्ताव, वर्तमान में भारतीय रेलवे द्वारा परीक्षण हेतु।"
                      : lang === "mr"
                      ? "स्थिती: धोरणात्मक प्रस्ताव, भारतीय रेल्वेसाठी सुचवलेला बदल."
                      : "Status: Proposed reform to CRIS PRS rules. Labelled as a design proposal."}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push(`/boarding?trainId=${trainId}`)}
              size="lg"
              className="min-h-11 gap-1.5 font-medium shadow-xs"
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
