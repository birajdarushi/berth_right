"use client";

import { useEffect, useState } from "react";
import {
  fallbackText,
  type ExplainLocale,
  type ExplainTopic,
} from "@/lib/explain-fallback";

import { useI18n } from "@/lib/i18n/context";

// Always paints static copy first. The model may replace it; a failure never
// shows a spinner or an error. SPEC.md §10.3.
export default function ExplainBlock({
  topic,
  context,
}: {
  topic: ExplainTopic;
  context: string;
}) {
  const { lang, t } = useI18n();
  const [text, setText] = useState(() => fallbackText(topic, lang));

  useEffect(() => {
    setText(fallbackText(topic, lang));
    let cancelled = false;
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, context, locale: lang }),
    })
      .then((r) => r.json())
      .then((data: { text?: string }) => {
        if (!cancelled && data.text) setText(data.text);
      })
      .catch(() => {
        // Keep the fallback. Never surface the failure.
      });
    return () => {
      cancelled = true;
    };
  }, [topic, context, lang]);

  return (
    <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 paper-shadow">
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-border/50">
        <span className="text-[10px] uppercase tracking-wider text-primary font-bold font-mono">
          {t.common.plainLanguageNote}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono uppercase bg-background px-1.5 py-0.5 rounded border border-border/60">
          {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "मराठी"}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">{text}</p>
    </div>
  );
}
