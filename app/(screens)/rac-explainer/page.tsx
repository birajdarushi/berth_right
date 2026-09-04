"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Term from "@/components/Term";
import ExplainBlock from "@/components/ExplainBlock";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 3 (SPEC.md §9): what RAC actually means, with a diagram of a shared
// side-lower berth — most first-time bookers have never seen it explained.
export default function RacExplainerPage() {
  return (
    <Suspense>
      <RacExplainerPageInner />
    </Suspense>
  );
}

function RacExplainerPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { t, lang } = useI18n();
  const trainId = params.get("trainId") ?? "";

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.racExplainer.title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t.racExplainer.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
        {/* Left Column: Diagram & RAC definition */}
        <div className="flex flex-col gap-3">
          <Term id="RAC" />
          <p className="text-xs sm:text-sm leading-relaxed text-foreground/85">
            {lang === "hi" ? (
              <>
                आपको एक बर्थ नंबर मिला है, लेकिन यह एक <strong className="text-foreground">साइड-लोअर बर्थ है जिसे किसी अन्य यात्री के साथ साझा किया जाता है</strong> जब तक कि पूरी बर्थ खाली न हो जाए। यह वेटलिस्ट नहीं है: आप ट्रेन में चढ़ सकते हैं।
              </>
            ) : lang === "mr" ? (
              <>
                आपल्याला बर्थ क्रमांक मिळाला आहे, पण ती <strong className="text-foreground">दुसऱ्या प्रवाशासोबत शेअर केलेली साइड-लोअर बर्थ</strong> आहे जोपर्यंत पूर्ण बर्थ मोकळी होत नाही. ही वेटलिस्ट नाही: आपण गाडीत चढू शकता.
              </>
            ) : (
              <>
                You have a berth number, but it&apos;s a <strong className="text-foreground">side-lower
                berth shared with one other passenger</strong> until a full berth opens up (or the
                journey ends). That is not a waitlist: you may board.
              </>
            )}
          </p>

          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
            <Image
              src="/brand/rac-shared-berth.jpg"
              alt="Two passengers sharing a single narrow side-lower RAC sleeper berth overnight on an Indian Railways train"
              width={1024}
              height={768}
              priority
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <p className="-mt-1.5 text-[11px] text-muted-foreground">{t.home.diagramCaption}</p>
        </div>

        {/* Right Column: Gender Solution, ExplainBlock, & CTA */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border/80 bg-accent/30 p-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
            <p className="font-semibold text-foreground mb-1">
              {lang === "hi" ? "जेंडर-अवेयर पेयरिंग क्यों?" : lang === "mr" ? "जेंडर-अवेअर पेअरिंग का?" : "Why Gender-Aware Pairing?"}
            </p>
            <p>
              {lang === "hi"
                ? "वर्तमान में, उस बर्थ को साझा करने वाले दो यात्रियों को लिंग का विचार किए बिना जोड़ा जाता है। बर्थ राइट एक जेंडर-अवेयर पेयरिंग चरण जोड़ता है ताकि अकेले यात्रा करने वाली महिला को रातभर किसी अज्ञात पुरुष यात्री के साथ न रहना पड़े।"
                : lang === "mr"
                ? "सध्या, ती बर्थ शेअर करणाऱ्या दोन प्रवाशांची जोडी लिंगाचा विचार न करता केली जाते. बर्थ राइट जेंडर-अवेअर पेअरिंग टप्पा जोडते जेणेकरून एकट्या प्रवास करणाऱ्या महिलेला अनोळखी पुरुषासोबत रात्र काढावी लागणार नाही."
                : "Today, the two passengers sharing that berth are paired without regard to gender. Berth Right adds a gender-aware pairing step so a woman travelling alone isn't paired with a male stranger overnight."}
            </p>
          </div>

          <ExplainBlock
            topic="rac"
            context="RAC is Reservation Against Cancellation: a shared side-lower berth, not a waitlist. You may board. Gender is not currently an input to who shares that berth. This prototype adds a deterministic gender-aware pairing step."
          />

          <Button
            onClick={() => router.push(`/preference?trainId=${trainId}`)}
            size="lg"
            className="min-h-11 gap-1.5 font-medium"
          >
            {t.common.continue}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Screen>
  );
}
