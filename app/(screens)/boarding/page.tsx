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

        {/* Right Column: Ticket Classification Guide & Plain Language Note */}
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 paper-shadow">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                {lang === "hi" ? "टिकट प्रकार और यात्रा नियम" : lang === "mr" ? "तिकीट प्रकार आणि प्रवासाचे नियम" : "Ticket Status Comparison"}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono bg-card px-1.5 py-0.5 rounded border border-border/60">
                Indian Railways Rules
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-lg bg-card border border-border/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-primary">RAC (Reservation Against Cancellation)</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {lang === "hi" ? "यात्रा मान्य" : lang === "mr" ? "प्रवास वैध" : "Boarding Allowed"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "hi"
                    ? "सीट आरक्षित है (साझा साइड-लोअर बर्थ)। आप वैध रूप से ट्रेन में यात्रा कर सकते हैं।"
                    : lang === "mr"
                    ? "जागा आरक्षित आहे (सामायिक साइड-लोअर बर्थ). आपण गाडीत चढू शकता."
                    : "Guaranteed travel on a shared side-lower berth. Legally permitted to board."}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-muted-foreground">GNWL / RLWL / PQWL (Waitlists)</span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {lang === "hi" ? "चढ़ना वर्जित" : lang === "mr" ? "चढण्यास बंदी" : "Cannot Board"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "hi"
                    ? "ई-टिकट वेटलिस्ट कन्फर्म न होने पर स्वतः रद्द हो जाता है। ट्रेन में चढ़ने पर बिना टिकट माना जाएगा और जुर्माना लगेगा।"
                    : lang === "mr"
                    ? "कन्फर्म न झालेले वेटलिस्ट ई-तिकीट आपोआप रद्द होते. गाडीत चढल्यास विनातिकीट मानून दंड आकारला जातो."
                    : "Unconfirmed e-tickets auto-cancel after charting. Boarding is treated as ticketless travel with a penalty."}
                </p>
              </div>

              <details className="text-xs text-muted-foreground pt-1">
                <summary className="cursor-pointer font-medium hover:text-foreground">
                  {lang === "hi" ? "+ पूर्ण विवरण (अंग्रेजी, हिन्दी, मराठी)" : lang === "mr" ? "+ तपशीलवार स्पष्टीकरण" : "+ Detailed Acronym Glossary (GNWL, RLWL, PQWL)"}
                </summary>
                <div className="mt-2 flex flex-col gap-1">
                  <Term id="RAC" />
                  <Term id="GNWL" />
                  <Term id="RLWL" />
                  <Term id="PQWL" />
                </div>
              </details>
            </div>
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
