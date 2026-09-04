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
          {/* Left Column: Refund Banner & Comparison Card */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-5 text-center shadow-xs">
              <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <IndianRupee className="size-6" />
              </span>
              <p className="text-base sm:text-lg font-bold text-emerald-900 leading-tight">
                {lang === "hi"
                  ? `आपका ₹${result.amount} का रिफंड बनता है। कोई शुल्क नहीं। सीधे आपके बैंक में।`
                  : lang === "mr"
                  ? `आपल्याला ₹${result.amount} परतावा मिळणे बाकी आहे. कोणतेही शुल्क नाही. थेट आपल्या बँकेत.`
                  : `You are owed ₹${result.amount}. No fee. Direct to your bank.`}
              </p>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                {lang === "hi"
                  ? `प्रस्ताव, वर्तमान नीति नहीं — नियम "${result.ruleId}". ${result.citation}`
                  : lang === "mr"
                  ? `प्रस्ताव, सध्याचे धोरण नाही — नियम "${result.ruleId}". ${result.citation}`
                  : `PROPOSAL, NOT CURRENT POLICY — rule "${result.ruleId}". ${result.citation}`}
              </p>
            </div>

            <Card className="gap-2 py-3.5 shadow-xs">
              <CardContent className="flex flex-col gap-1.5 px-4 text-xs sm:text-sm">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" />
                  {lang === "hi"
                    ? "निजी ऐप्स से तुलना करें"
                    : lang === "mr"
                    ? "खाजगी अ‍ॅप्सशी तुलना करा"
                    : "Compare with the private market"}
                </p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  {lang === "hi"
                    ? "सशुल्क 'रिफंड एश्योरेंस' सुविधाएं पहले खरीदी जाती हैं, प्रायः ऐप के अपने शुल्क को काटकर इन-ऐप वॉलेट में क्रेडिट की जाती हैं और 10-16 दिन बाद आती हैं। यह अधिकार: कोई शुल्क नहीं, कोई वॉलेट नहीं, सीधे बैंक में जमा।"
                    : lang === "mr"
                    ? "सशुल्क 'रिफंड अ‍ॅश्युरन्स' अ‍ॅड-ऑन्स आधी विकत घेतले जातात, अनेकदा अ‍ॅपचे स्वतःचे शुल्क वजा करून इन-अ‍ॅप वॉलेटमध्ये जमा होतात आणि १०-१६ दिवसांनी मिळतात. हा अधिकार: कोणतेही शुल्क नाही, वॉलेट नाही, थेट बँकेत जमा."
                    : "Paid \"refund assurance\" add-ons are bought upfront, often pay out the standard refund minus the app's own fee, credited to an in-app wallet rather than a bank account, and frequently arrive 10–16 days later. This entitlement: no fee, no wallet, notionally credited straight to your bank."}
                </p>
              </CardContent>
            </Card>
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
              className={`min-h-11 font-medium transition-all ${
                credited ? "bg-emerald-600 text-white" : ""
              }`}
            >
              {credited ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  {lang === "hi"
                    ? "सांकेतिक रूप से जमा (डेमो)"
                    : lang === "mr"
                    ? "सांकेतिक जमा केले (डेमो)"
                    : "Notionally credited (demo)"}
                </span>
              ) : (
                lang === "hi"
                  ? "रिफंड का दावा करें"
                  : lang === "mr"
                  ? "परताव्याचा हक्क मागा"
                  : "Assert entitlement"
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
