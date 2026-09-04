"use client";

import { Suspense, useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import { SEED_COACHES, SEED_RAC_QUEUES, SEED_TRAINS } from "@/lib/seed";
import Screen from "@/components/Screen";
import QueueVisualization from "@/components/QueueVisualization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Standalone demo view of the queue visualization — same component as /tracking,
// but lets you pick any seed train without needing an active booking first.
export default function QueuePage() {
  return (
    <Suspense>
      <QueuePageInner />
    </Suspense>
  );
}

function QueuePageInner() {
  const { state } = useDemoState();
  const { lang } = useI18n();
  const [trainNumber, setTrainNumber] = useState(state.trainNumber ?? SEED_TRAINS[0].number);
  const train = SEED_TRAINS.find((t) => t.number === trainNumber) ?? SEED_TRAINS[0];
  const queue = SEED_RAC_QUEUES[train.number] ?? [];
  const berths = (SEED_COACHES[train.number] ?? []).flatMap((c) => c.sideLowerBerths);

  // No live booking required here — a female entry past the front of the queue stands
  // in as "you" (falling back to the first entry if none), so storm mode has visible
  // chaos both before and after her booking arrives.
  const self = queue.find((e) => e.passenger.gender === "female" && e.position > 1) ?? queue[0];

  return (
    <Screen>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Users2 className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {lang === "hi"
              ? "आरएसी कतार: वर्तमान बनाम बर्थ राइट"
              : lang === "mr"
              ? "आरएसी रांग: सध्याची विरूद्ध बर्थ राइट"
              : "RAC queue: today vs. Berth Right"}
          </h1>
        </div>
        <div className="w-full sm:w-72">
          <Select value={train.number} onValueChange={(v) => v && setTrainNumber(v)}>
            <SelectTrigger id="train" className="min-h-9 text-xs w-full">
              <SelectValue>
                {() => `${train.name} · #${train.number} (${queue.length} RAC)`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SEED_TRAINS.map((t) => (
                <SelectItem key={t.number} value={t.number} className="text-xs">
                  {t.name} · #{t.number} ({(SEED_RAC_QUEUES[t.number] ?? []).length} RAC)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground">
        {lang === "hi"
          ? "समान सीड कतार, दो आवंटन नियम। यह देखने के लिए टॉगल करें कि लिंग-अंध पेयरिंग आपको किसके साथ बैठाती है और समान-लिंग प्राथमिकता का वास्तविक प्रभाव क्या है।"
          : lang === "mr"
          ? "समान सीड रांग, दोन वाटप नियम. लिंग-निरपेक्ष पेअरिंग आपल्याला कोणाजवळ बसवते आणि समान-लिंग पसंतीचा प्रत्यक्ष परिणाम काय होतो ते पाहण्यासाठी टॉगल करा."
          : "Same seed queue, two allocation rules. Toggle to see who gender-blind pairing puts you next to, and what a same-gender constraint actually costs."}
      </p>

      {self ? (
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs">
          <QueueVisualization queue={queue} berthIds={berths} selfPassengerId={self.passenger.id} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {lang === "hi" ? "इस ट्रेन के लिए कोई आरएसी कतार नहीं है।" : lang === "mr" ? "या गाडीसाठी आरएसी रांग नाही." : "This train has no RAC queue in the seed data."}
        </p>
      )}
    </Screen>
  );
}
