"use client";

import Link from "next/link";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const ITEMS_EN = [
  "Every data source on this site is synthetic. No train, PNR, passenger, payment or queue is real.",
  "The same-gender queue-position cost is derived from seed data, not a live RAC queue.",
  "The refund percentage (50%) is a design proposal, not Indian Railways policy. It is labelled a proposal wherever it appears.",
  "Chart preparation timing varies. Public sources cite 4 hours, 10 hours, and a 9–18 hour window. This demo uses 4 hours before departure and says so.",
  "The pairing engine is untested against real RAC queue volumes.",
  "Selection by a hackathon does not imply adoption by any government body.",
  "Berth Right is not affiliated with, endorsed by, or connected to Indian Railways, IRCTC, or CRIS.",
  "Mock OTP accepts any 6-digit code (try 000000). There are no real user accounts.",
];

const ITEMS_HI = [
  "इस साइट पर प्रत्येक डेटा स्रोत सिंथेटिक (काल्पनिक) है। कोई भी ट्रेन, पीएनआर, यात्री, भुगतान या कतार वास्तविक नहीं है।",
  "समान-लिंग कतार स्थिति प्रभाव सीड डेटा से लिया गया है, वास्तविक आरएसी कतार से नहीं।",
  "रिफंड प्रतिशत (50%) एक नीतिगत प्रस्ताव है, भारतीय रेलवे की आधिकारिक नीति नहीं। जहां भी यह आता है, इसे प्रस्ताव के रूप में चिह्नित किया गया है।",
  "चार्ट तैयार होने का समय भिन्न होता है। यह डेमो प्रस्थान से 4 घंटे पहले का समय मानता है।",
  "पेयरिंग एल्गोरिदम का वास्तविक भारी आरएसी डेटा पर परीक्षण नहीं हुआ है।",
  "हैकाथॉन द्वारा चयन किसी भी सरकारी निकाय द्वारा अपनाए जाने का संकेत नहीं देता।",
  "बर्थ राइट भारतीय रेलवे, आईआरसीटीसी या क्रिस से संबद्ध या समर्थित नहीं है।",
  "मॉक ओटीपी किसी भी 6 अंकों के कोड को स्वीकार करता है (000000 आज़माएं)। कोई वास्तविक खाता नहीं है।",
];

const ITEMS_MR = [
  "या साइटवरील प्रत्येक डेटा स्रोत सिंथेटिक (काल्पनिक) आहे. कोणतीही गाडी, पीएनआर, प्रवासी, पेमेंट किंवा रांग खरी नाही.",
  "समान-लिंग रांग स्थिती प्रभाव सीड डेटावरून काढला आहे, जिवंत आरएसी रांगेवरून नाही.",
  "परतावा टक्केवारी (५०%) हा एक डिझाइन प्रस्ताव आहे, भारतीय रेल्वेचे धोरण नाही. जिथे जिथे तो दिसतो तिथे प्रस्ताव म्हणून नमूद केला आहे.",
  "चार्ट तयार होण्याची वेळ बदलते. हा डेमो प्रस्थानाच्या ४ तास आधीची वेळ मानतो.",
  "पेअरिंग इंजिनची प्रत्यक्ष आरएसी डेटावर चाचणी झालेली नाही.",
  "हॅकाथॉनद्वारे निवड म्हणजे कोणत्याही सरकारी संस्थेने स्वीकारल्याचे दर्शवत नाही.",
  "बर्थ राइट भारतीय रेल्वे, आयआरसीटीसी किंवा क्रिसशी संलग्न किंवा समर्थित नाही.",
  "मॉक ओटीपी कोणताही ६-अंकी कोड स्वीकारतो (०००००० वापरून पहा). कोणतीही खरी खाती नाहीत.",
];

// In-app counterpart of LIMITATIONS.md — SPEC.md §12. Honesty is scored.
export default function LimitationsPage() {
  const { t, lang } = useI18n();
  const items = lang === "hi" ? ITEMS_HI : lang === "mr" ? ITEMS_MR : ITEMS_EN;

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.common.limitations}</h1>
          </div>
          <Button
            render={
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                {lang === "hi" ? "खोज पर वापस जाएं" : lang === "mr" ? "शोधावर परत जा" : "Back to search"}
              </Link>
            }
            variant="outline"
            size="sm"
            className="text-xs"
          />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {lang === "hi"
            ? "यह आरएसी आवंटन में सुधार का एक हैकाथॉन प्रोटोटाइप है। यह कोई आधिकारिक बुकिंग उत्पाद नहीं है।"
            : lang === "mr"
            ? "हा आरएसी वाटपातील बदलाचा हॅकाथॉन प्रोटोटाइप आहे. हे कोणतेही अधिकृत बुकिंग उत्पादन नाही."
            : "This is a hackathon prototype of a change to RAC allocation. It is not a booking product and it is not official."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-card/60 p-3 shadow-2xs hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              <Info className="size-3" />
              <span>#{idx + 1}</span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/85">{item}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}
