"use client";

import { useRouter } from "next/navigation";
import Term from "@/components/Term";
import ExplainBlock from "@/components/ExplainBlock";
import { useDemoState } from "@/lib/demo-state";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 4 (SPEC.md §9, §2.3): boarding-legality disclosure, unmissable, before payment.
export default function BoardingPage() {
  const router = useRouter();
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const status = state.booking?.status ?? "RAC";
  const canBoard = status === "RAC" || status === "CNF";

  return (
    <Screen>
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <ShieldCheck className="size-5 text-primary" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {lang === "hi"
            ? "क्या आप ट्रेन में चढ़ सकते हैं?"
            : lang === "mr"
            ? "आपण गाडीत चढू शकता का?"
            : "Can you board?"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* Left Column: Status Box & CTA */}
        <div className="flex flex-col gap-4 md:col-span-6">
          <div
            className={`flex gap-3.5 rounded-xl border-2 p-5 shadow-2xs ${
              canBoard ? "border-emerald-400 bg-emerald-50/90 text-emerald-950" : "border-rose-400 bg-rose-50/90 text-rose-950"
            }`}
          >
            {canBoard ? (
              <CheckCircle2 className="size-6 shrink-0 text-emerald-600 translate-y-0.5" />
            ) : (
              <XCircle className="size-6 shrink-0 text-rose-600 translate-y-0.5" />
            )}
            <div className="flex flex-col gap-1.5">
              <p className="text-base sm:text-lg font-bold leading-snug">
                {canBoard
                  ? (lang === "hi"
                      ? "हाँ। यह टिकट आरएसी है — आप ट्रेन में यात्रा कर सकते हैं।"
                      : lang === "mr"
                      ? "होय. हे तिकीट आरएसी आहे — आपण गाडीत प्रवास करू शकता."
                      : "Yes. This ticket is RAC — you may board.")
                  : (lang === "hi"
                      ? "नहीं। वेटलिस्टेड ई-टिकट पर यात्रा की अनुमति नहीं है।"
                      : lang === "mr"
                      ? "नाही. वेटलिस्टेड ई-तिकिटाने गाडीत चढता येत नाही."
                      : "No. A waitlisted e-ticket cannot board.")}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/80">
                {lang === "hi"
                  ? "बिना कन्फर्म वेटलिस्ट ई-टिकट पर यात्रा की अनुमति नहीं है और जुर्माना लग सकता है। आरएसी वेटलिस्ट नहीं है: आपको पहले से ही एक बर्थ नंबर मिलता है, जो एक अन्य यात्री के साथ साझा होता है।"
                  : lang === "mr"
                  ? "न कन्फर्म झालेल्या वेटलिस्ट ई-तिकिटाने प्रवास करण्यास परवानगी नाही आणि दंड होऊ शकतो. आरएसी ही वेटलिस्ट नाही: आपल्याला आधीच बर्थ क्रमांक मिळाला आहे, जो दुसऱ्या प्रवाशासोबत सामायिक आहे."
                  : "Boarding an unconfirmed waitlisted e-ticket is not permitted and can carry a penalty. RAC is not a waitlist: you already have a berth number, shared with one other passenger."}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/payment")}
            size="lg"
            className="min-h-11 font-medium gap-1.5"
          >
            {lang === "hi"
              ? "मैं समझ गया — मॉक भुगतान पर आगे बढ़ें"
              : lang === "mr"
              ? "मला समजले — मॉक पेमेंटकडे पुढे जा"
              : "I understand — continue to fake payment"}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Right Column: Terms & ExplainBlock */}
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="flex flex-col gap-1">
            <Term id="RAC" />
            <Term id="GNWL" />
            <Term id="RLWL" />
            <Term id="PQWL" />
          </div>

          <ExplainBlock
            topic="boarding"
            context={`Booking status is ${status}. RAC and confirmed tickets may board. GNWL, RLWL and PQWL waitlisted e-tickets may not board until they become RAC or confirmed. Penalty applies if you board on an unconfirmed waitlist.`}
          />
        </div>
      </div>
    </Screen>
  );
}
