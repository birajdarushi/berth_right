"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SEED_STATIONS } from "@/lib/seed";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { ArrowRight, Users2, ShieldCheck, IndianRupee } from "lucide-react";
import Image from "next/image";

// Screen 1 (SPEC.md §9): search, three taps max. Leads with the premise per §15.3
// rather than burying it under a bare form.
export default function SearchPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [routeIdx, setRouteIdx] = useState("0");
  const [date, setDate] = useState("2026-08-30");
  const route = SEED_STATIONS[Number(routeIdx)];

  const submit = () => {
    router.push(`/results?from=${route.from}&to=${route.to}`);
  };

  const features = [
    {
      icon: Users2,
      title: t.home.feature1Title,
      body: t.home.feature1Desc,
    },
    {
      icon: ShieldCheck,
      title: t.home.feature2Title,
      body: t.home.feature2Desc,
    },
    {
      icon: IndianRupee,
      title: t.home.feature3Title,
      body: t.home.feature3Desc,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-4 md:py-6 gap-6">
      <div className="grid w-full gap-6 md:grid-cols-2 md:items-center md:gap-10">
        <div className="flex flex-col gap-3.5">
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            {t.home.heroTitlePrefix}{" "}
            <span className="text-primary">{t.home.heroTitleHighlight}</span>
          </h1>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t.home.heroDescription}
          </p>

          <div className="overflow-hidden rounded-lg border border-border max-w-md">
            <Image
              src="/brand/rac-explainer.png"
              alt="Scale diagram of a side-lower berth: 1.8 metres long, 0.6 metres wide, shared by two adults"
              width={1672}
              height={941}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="-mt-2 text-[11px] text-muted-foreground">{t.home.diagramCaption}</p>
        </div>

        <Card className="relative gap-4 overflow-hidden py-5 shadow-sm">
          <CardContent className="flex flex-col gap-3.5 px-5">
            <h2 className="text-base font-semibold">{t.home.searchCardTitle}</h2>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="route" className="text-xs">{t.home.routeLabel}</Label>
              <Select value={routeIdx} onValueChange={(v) => v && setRouteIdx(v)}>
                <SelectTrigger id="route" className="min-h-10 w-full text-sm">
                  <SelectValue>
                    {(value: string | null) => {
                      const s = SEED_STATIONS[Number(value)];
                      return s ? `${s.fromName} (${s.from}) → ${s.toName} (${s.to})` : t.home.selectRoutePlaceholder;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SEED_STATIONS.map((s, i) => (
                    <SelectItem key={s.from + s.to} value={String(i)}>
                      {s.fromName} ({s.from}) → {s.toName} ({s.to})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date" className="text-xs">{t.home.dateLabel}</Label>
              <Input
                id="date"
                type="date"
                className="min-h-10 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                {t.home.dateHelperText}
              </p>
            </div>

            <Button onClick={submit} size="lg" className="min-h-10 gap-1.5 text-sm font-medium">
              {t.home.searchButton}
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              {t.common.mockNotice}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3 rounded-lg border border-border/40 bg-card p-2 sm:p-3 shadow-xs"
            >
              <span className="flex size-6 sm:size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-3.5 sm:size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-sm font-semibold leading-tight">{f.title}</p>
                <p className="text-[9px] sm:text-xs text-muted-foreground leading-snug mt-0.5">{f.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
