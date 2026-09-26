"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import type { Gender, SharingPreference } from "@/lib/types";
import ExplainBlock from "@/components/ExplainBlock";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 5 (SPEC.md §9, §6.4): sharing preference with honest disclosure of its cost.
export default function PreferencePage() {
  return (
    <Suspense>
      <PreferencePageInner />
    </Suspense>
  );
}

function PreferencePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setState } = useDemoState();
  const { t, lang } = useI18n();
  const trainId = params.get("trainId") ?? "";

  const [gender, setGender] = useState<Gender>("female");
  const [preference, setPreference] = useState<SharingPreference>("same_gender_only");
  const [cost, setCost] = useState<{ estimatedPositionDelta: number; basis: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const preferences: { value: SharingPreference; label: string; description: string }[] = [
    {
      value: "same_gender_only",
      label: t.preference.sameGenderOnly,
      description: t.preference.sameGenderOnlyDesc,
    },
    {
      value: "prefer_same_gender",
      label: t.preference.preferSameGender,
      description: t.preference.preferSameGenderDesc,
    },
    {
      value: "companion",
      label: t.preference.companion,
      description: t.preference.companionDesc,
    },
    {
      value: "no_preference",
      label: t.preference.noPreference,
      description: t.preference.noPreferenceDesc,
    },
  ];

  const checkCost = async (g: Gender, p: SharingPreference) => {
    setLoading(true);
    const res = await fetch("/api/rac/preference/cost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainId, gender: g, preference: p }),
    });
    setCost(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    checkCost(gender, preference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainId]);

  const choose = (p: SharingPreference) => {
    setPreference(p);
    checkCost(gender, p);
  };

  const chooseGender = (g: Gender) => {
    setGender(g);
    checkCost(g, preference);
  };

  const continueToPassengers = () => {
    setState({ trainNumber: trainId, gender, preference });
    router.push(`/passengers?trainId=${trainId}`);
  };

  const genderLabelMap: Record<Gender, string> = {
    female: t.common.female,
    male: t.common.male,
    transgender: t.common.other,
  };

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.preference.title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{t.preference.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* Left Column: Gender & Preferences Ballot */}
        <div className="flex flex-col gap-4 md:col-span-7">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 paper-shadow flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 pb-3 border-b border-border/60">
              <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                {t.preference.yourGender}
              </Label>
              <Select value={gender} onValueChange={(v) => v && chooseGender(v as Gender)}>
                <SelectTrigger id="gender" className="min-h-10 w-full text-sm bg-background border-border/80">
                  <SelectValue>
                    {(value: string | null) =>
                      value ? genderLabelMap[value as Gender] || value : t.preference.selectGender
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">{t.common.female}</SelectItem>
                  <SelectItem value="male">{t.common.male}</SelectItem>
                  <SelectItem value="transgender">{t.common.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                {t.preference.sharingPreferenceTitle}
              </Label>
              <RadioGroup
                value={preference}
                onValueChange={(v) => choose(v as SharingPreference)}
                className="flex flex-col gap-2"
              >
                {preferences.map((p) => (
                  <Label
                    key={p.value}
                    htmlFor={p.value}
                    className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border/80 bg-background p-3 has-data-[checked]:border-primary has-data-[checked]:bg-primary/5 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <RadioGroupItem value={p.value} id={p.value} />
                      <span className="font-semibold text-xs sm:text-sm text-foreground">{p.label}</span>
                    </div>
                    <p className="pl-6 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Right Column: Queue Impact, Context & CTA */}
        <div className="flex flex-col gap-3.5 md:col-span-5">
          {preference === "same_gender_only" && (
            <div className="rounded-xl border border-primary/20 bg-muted/20 p-4 paper-shadow text-xs leading-relaxed">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-[10px] uppercase tracking-wider mb-1.5">
                <AlertTriangle className="size-3 text-primary" />
                <span>Queue Position Trade-Off</span>
              </div>
              <p className="text-foreground/85">
                {loading && (lang === "hi" ? "अनुमान लगाया जा रहा है..." : lang === "mr" ? "अंदाज घेत आहे..." : "Calculating queue impact…")}
                {!loading && cost && cost.estimatedPositionDelta > 0 && (
                  <>
                    {lang === "hi" ? (
                      <>केवल समान लिंग चुनने से इस ट्रेन की आरएसी कतार में आप लगभग <strong>{cost.estimatedPositionDelta} स्थान पीछे</strong> जा सकते हैं। {cost.basis}</>
                    ) : lang === "mr" ? (
                      <>फक्त समान लिंग निवडल्याने या गाडीच्या आरएसी रांगेत तुमचे स्थान साधारणपणे <strong>{cost.estimatedPositionDelta} स्थाने मागे</strong> जाऊ शकते. {cost.basis}</>
                    ) : (
                      <>Choosing strict same-gender sharing may shift you approximately <strong className="font-mono text-primary font-bold">{cost.estimatedPositionDelta} places back</strong> in the RAC queue for this train. {cost.basis}</>
                    )}
                  </>
                )}
                {!loading && cost && cost.estimatedPositionDelta === 0 && (
                  <>
                    {lang === "hi"
                      ? `इस समय इस ट्रेन के लिए कोई अनुमानित कतार प्रभाव नहीं है। ${cost.basis}`
                      : lang === "mr"
                      ? `या गाडीसाठी सध्या कोणताही अंदाजित रांग दंड नाही. ${cost.basis}`
                      : `No queue-position penalty estimated for this train. ${cost.basis}`}
                  </>
                )}
              </p>
            </div>
          )}

          <ExplainBlock
            topic="preference"
            context={
              cost
                ? `Preference ${preference}, gender ${gender}. Estimated RAC queue position delta: ${cost.estimatedPositionDelta}. ${cost.basis} Estimate from seed data, not a live queue.`
                : `Preference ${preference}, gender ${gender}.`
            }
          />

          <Button onClick={continueToPassengers} size="lg" className="min-h-11 gap-1.5 font-semibold shadow-xs mt-1">
            {t.common.continue}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Screen>
  );
}
