"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import ExplainBlock from "@/components/ExplainBlock";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

type EntitlementResult = { amount: number; ruleId: string; citation: string; isProposal: boolean };

// Screen 13 (SPEC.md §9, §7.3): amount, rule, citation, status through to notional credit.
// The contrast screen: plain, no fee, no upsell.
export default function EntitlementPage() {
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const booking = state.booking;
  const chartOutcome = state.chartOutcome;
  const [result, setResult] = useState<EntitlementResult | null>(null);
  const [credited, setCredited] = useState(false);

  useEffect(() => {
    if (!booking || !chartOutcome) return;
    fetch("/api/fare/entitlement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, chartOutcome }),
    })
      .then((r) => r.json())
      .then(setResult);
  }, [booking, chartOutcome]);

  if (!booking || !chartOutcome) {
    return (
      <Screen>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "पहले चार्ट तैयार करें ताकि परिणाम का मूल्यांकन किया जा सके।"
              : lang === "mr"
              ? "आधी चार्ट तयार करा जेणेकरून निकालाचे मूल्यांकन करता येईल."
              : "Run chart preparation first so an outcome can be assessed."}
          </p>
          <Button
            render={
              <Link href="/chart-outcome">
                {lang === "hi"
                  ? "चार्ट तैयारी पर जाएं"
                  : lang === "mr"
                  ? "चार्ट तयारीवर जा"
                  : "Go to chart preparation"}
                <ArrowRight className="size-3.5" />
              </Link>
            }
            size="sm"
            variant="outline"
          />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.entitlement.title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t.entitlement.subtitle}</p>
      </div>

      {result && result.amount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-start">
          {/* Left Column: Settlement Voucher & Concise Comparison */}
          <div className="flex flex-col gap-3.5">
            <div className="rounded-xl border border-primary/20 bg-muted/20 p-5 paper-shadow flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-primary">
                  [SETTLEMENT ENTITLEMENT VOUCHER]
                </span>
                <span className="text-[10px] font-mono text-muted-foreground bg-card px-2 py-0.5 rounded border border-border/60">
                  CRIS PRS PROPOSAL
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-foreground">₹{result.amount}</span>
                <span className="text-xs font-semibold text-primary">
                  {lang === "hi" ? "स्वतः बैंक क्रेडिट" : lang === "mr" ? "थेट बँक परतावा" : "Direct Bank Entitlement"}
                </span>
              </div>

              <p className="text-xs text-foreground/85 leading-relaxed">
                {lang === "hi"
                  ? `आपकी यात्रा साझा आरएसी बर्थ पर रही। 50% किराए का स्वतः रिफंड बनता है (नियम ${result.ruleId})।`
                  : lang === "mr"
                  ? `आपला प्रवास सामायिक आरएसी बर्थवर झाला. ५०% भाड्याचा परतावा पात्र आहे (नियम ${result.ruleId}).`
                  : `Your journey remained on a shared RAC berth. You are entitled to an automatic 50% fare refund (Rule ${result.ruleId}).`}
              </p>

              <div className="ticket-perforation pt-2 text-[11px] text-muted-foreground font-mono">
                {result.citation}
              </div>
            </div>

            {/* Concise Comparison Box */}
            <div className="rounded-xl border border-border/80 bg-card p-4 paper-shadow">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-border/60 text-xs font-bold text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>{lang === "hi" ? "बाज़ार बनाम जनहित अधिकार" : lang === "mr" ? "खाजगी बाजार विरूद्ध हक्क" : "Market Add-on vs. Statutory Entitlement"}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/40 border border-border/60">
                  <p className="font-semibold text-primary text-[11px] uppercase tracking-wide">Berth Right</p>
                  <p className="text-muted-foreground mt-0.5 leading-snug">₹0 Fee · Direct to bank · Automated</p>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/60">
                  <p className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wide">Private Aggregators</p>
                  <p className="text-muted-foreground mt-0.5 leading-snug">Paid upfront · App wallet · 10–16 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: ExplainBlock & Assert Button */}
          <div className="flex flex-col gap-4">
            <ExplainBlock
              topic="entitlement"
              context={`Amount ₹${result.amount}. Rule ${result.ruleId}. Proposal: ${String(result.isProposal)}. ${result.citation}. No fee, no wallet, notional credit to bank.`}
            />

            <Button
              onClick={() => setCredited(true)}
              disabled={credited}
              size="lg"
              className={`min-h-11 font-semibold transition-all shadow-xs ${
                credited ? "bg-primary/90 text-primary-foreground" : ""
              }`}
            >
              {credited ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  {lang === "hi"
                    ? "सांकेतिक रूप से जमा (डेमो)"
                    : lang === "mr"
                    ? "सांकेतिक जमा केले (डेमो)"
                    : "Notionally credited to bank (demo)"}
                </span>
              ) : (
                lang === "hi"
                  ? "रिफंड का दावा करें"
                  : lang === "mr"
                  ? "परताव्याचा हक्क मागा"
                  : "Assert entitlement credit"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {lang === "hi"
            ? "इस परिणाम पर कोई रिफंड लागू नहीं होता — आपका टिकट पूरी बर्थ में कन्फर्म हो गया था।"
            : lang === "mr"
            ? "या निकालासाठी कोणताही परतावा लागू होत नाही — आपले तिकीट पूर्ण बर्थमध्ये कन्फर्म झाले होते."
            : "No entitlement applies to this outcome — your ticket was confirmed to a full berth."}
        </p>
      )}
    </Screen>
  );
}
