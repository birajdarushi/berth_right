"use client";

import { useState } from "react";
import { useDemoState } from "@/lib/demo-state";
import { now } from "@/lib/clock";
import Screen from "@/components/Screen";
import NoBookingState from "@/components/NoBookingState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Megaphone, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// Screen 12 (SPEC.md §9, §4.2): one-tap in-journey escalation, structured record, mocked
// TTE receipt (clearly labelled).
export default function EscalatePage() {
  const { state } = useDemoState();
  const { t, lang } = useI18n();
  const booking = state.booking;
  const [reason, setReason] = useState(
    lang === "hi"
      ? "आवंटित आरएसी साथी मेरी साझा प्राथमिकता से मेल नहीं खाता।"
      : lang === "mr"
      ? "वाटप केलेला आरएसी साथीदार माझ्या शेअरिंग पसंतीशी जुळत नाही."
      : "Assigned RAC partner does not match my sharing preference."
  );
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const escalate = async () => {
    if (!booking) return;
    setLoading(true);
    const res = await fetch("/api/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pnr: booking.pnr, reason, timestamp: new Date(now()).toISOString() }),
    });
    setRecord(await res.json());
    setLoading(false);
  };

  if (!booking) return <NoBookingState />;

  return (
    <Screen>
      <div className="flex flex-col gap-1 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.escalate.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {lang === "hi"
            ? "यात्रा के दौरान टीटीई या रेलमदद सहायता के लिए तत्काल शिकायत दर्ज करें।"
            : lang === "mr"
            ? "प्रवासात टीटीई किंवा रेलमदद मदतीसाठी त्वरित तक्रार नोंदवा."
            : "Direct one-tap grievance logging to onboard TTE and RailMadad."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* Left Column: Input Form & Button */}
        <div className="flex flex-col gap-3.5 md:col-span-6">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 paper-shadow flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reason" className="text-xs font-bold uppercase font-mono tracking-wider text-muted-foreground">
                {t.escalate.descriptionLabel}
              </Label>
              <Textarea
                id="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs sm:text-sm resize-none bg-background border-border/80"
              />
            </div>

            <Button onClick={escalate} disabled={loading} size="lg" className="min-h-11 gap-1.5 font-semibold shadow-xs">
              <Send className="size-4" />
              {loading
                ? (lang === "hi" ? "भेजा जा रहा है..." : lang === "mr" ? "पाठवत आहे..." : "Sending…")
                : (lang === "hi" ? "शिकायत दर्ज करें" : lang === "mr" ? "तक्रार नोंदवा" : "Log Grievance Record")}
            </Button>
          </div>
        </div>

        {/* Right Column: Record receipt / status */}
        <div className="flex flex-col gap-3 md:col-span-6">
          {record ? (
            <div className="rounded-xl border border-primary/20 bg-muted/20 p-5 paper-shadow flex flex-col gap-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider">
                  [INCIDENT ESCALATION RECORD]
                </span>
                <span className="text-[10px] font-mono text-muted-foreground bg-card px-2 py-0.5 rounded border border-border/60">
                  {String(record.status)}
                </span>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">{lang === "hi" ? "शिकायत आईडी" : lang === "mr" ? "तक्रार आयडी" : "Incident Ref"}:</span>
                <span className="font-bold text-primary">{String(record.escalationId)}</span>
              </div>

              <div className="ticket-perforation pt-3 text-xs leading-relaxed text-foreground/80">
                {(record.mockedTteReceipt as { note: string }).note}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 p-5 text-xs text-muted-foreground paper-shadow">
              <div className="flex items-center gap-1.5 font-bold font-heading text-foreground">
                <ShieldAlert className="size-4 text-primary" />
                <span>{lang === "hi" ? "त्वरित सहायता प्रोटोकॉल" : lang === "mr" ? "त्वरित मदत प्रोटोकॉल" : "Immediate Assistance Protocol"}</span>
              </div>
              <p className="leading-relaxed">
                {lang === "hi"
                  ? "शिकायत दर्ज करने पर कोच टीटीई को डिजिटल अलर्ट भेजा जाता है और रेलमदद पर टिकट दर्ज होता है।"
                  : lang === "mr"
                  ? "तक्रार नोंदवल्यावर कोच टीटीईला डिजिटल सूचना पाठवली जाते आणि रेलमददवर नोंद होते."
                  : "Logging this grievance generates a structured record for onboard TTE handheld terminals and logs a reference record."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
