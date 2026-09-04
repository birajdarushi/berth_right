"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

import { useI18n } from "@/lib/i18n/context";

// Screen 8 (SPEC.md §4.2, §9): mock payment — visibly fake, never resembling a real gateway.
export default function PaymentPage() {
  const router = useRouter();
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const [paying, setPaying] = useState(false);

  const pay = () => {
    setPaying(true);
    setTimeout(() => router.push("/confirmation"), 700);
  };

  return (
    <Screen>
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-fuchsia-400 bg-fuchsia-50 p-6 text-center">
        <CreditCard className="size-8 text-fuchsia-600" />
        <div>
          <p className="mb-1 text-lg font-bold text-fuchsia-700">
            {lang === "hi"
              ? "काल्पनिक भुगतान स्क्रीन — केवल डेमो"
              : lang === "mr"
              ? "काल्पनिक पेमेंट स्क्रीन — फक्त डेमो"
              : "FAKE PAYMENT SCREEN — DEMO ONLY"}
          </p>
          <p className="text-sm text-fuchsia-900">
            {lang === "hi"
              ? "कोई वास्तविक पेमेंट गेटवे नहीं। कोई पैसा नहीं कटता। किसी भी कार्ड से कुछ चार्ज नहीं होगा।"
              : lang === "mr"
              ? "कोणतेही खरे पेमेंट गेटवे नाही. पैसे कट होत नाहीत. कार्डवरून कोणतेही शुल्क आकारले जात नाही."
              : "No real payment gateway. No money moves. Nothing is charged to any card."}
          </p>
        </div>
        <p className="text-3xl font-semibold tabular-nums">₹{state.booking?.fare.totalFare ?? "—"}</p>
        <Button
          disabled={paying}
          onClick={pay}
          size="lg"
          className="min-h-11 w-full bg-fuchsia-600 text-white hover:bg-fuchsia-700"
        >
          {paying
            ? (lang === "hi" ? "भुगतान प्रक्रिया जारी है (मॉक)..." : lang === "mr" ? "पेमेंट प्रक्रिया सुरू आहे (मॉक)..." : "Processing (fake)…")
            : (lang === "hi" ? "भुगतान करें (काल्पनिक)" : lang === "mr" ? "पेमेंट करा (काल्पनिक)" : "Pay (fake)")}
        </Button>
      </div>
    </Screen>
  );
}
