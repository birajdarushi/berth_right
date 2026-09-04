import { NextRequest, NextResponse } from "next/server";
import {
  fallbackText,
  isExplainLocale,
  isExplainTopic,
  type ExplainLocale,
  type ExplainTopic,
} from "@/lib/explain-fallback";

const TIMEOUT_MS = 2500;
const MAX_TOKENS = 180;
const cache = new Map<string, string>();

function cacheKey(topic: ExplainTopic, locale: ExplainLocale, context: string) {
  return `${topic}|${locale}|${context}`;
}

// POST /explain { topic, context, locale } -> { text, source }
// Translation, never decision. SPEC.md §10.3: if the call fails or times out,
// return pre-written copy. A live demo must never surface an LLM error.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    topic?: string;
    context?: string;
    locale?: string;
  };

  const rawTopic = body.topic ?? "";
  const rawLocale = body.locale ?? "";
  const topic: ExplainTopic = isExplainTopic(rawTopic) ? rawTopic : "rac";
  const locale: ExplainLocale = isExplainLocale(rawLocale) ? rawLocale : "en";
  const context = (body.context ?? "").slice(0, 800);
  const fallback = fallbackText(topic, locale);
  const key = cacheKey(topic, locale, context);

  const cached = cache.get(key);
  if (cached) {
    return NextResponse.json({ text: cached, source: "cache" as const, fallback });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: fallback, source: "fallback" as const, fallback });
  }

  try {
    const text = await phraseWithOpenAI({ apiKey, topic, locale, context, fallback });
    cache.set(key, text);
    return NextResponse.json({ text, source: "openai" as const, fallback });
  } catch {
    return NextResponse.json({ text: fallback, source: "fallback" as const, fallback });
  }
}

async function phraseWithOpenAI(args: {
  apiKey: string;
  topic: ExplainTopic;
  locale: ExplainLocale;
  context: string;
  fallback: string;
}): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const language = args.locale === "hi" ? "Hindi" : args.locale === "mr" ? "Marathi" : "English";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "system",
          content:
            "You rephrase provided facts in plain language for a first-time train passenger. You must not invent numbers, change outcomes, decide pairings, fares, entitlements, or queue positions, or add facts that are not in the context. Two or three short sentences. No markdown.",
        },
        {
          role: "user",
          content: `Write in ${language}. Topic: ${args.topic}. Facts:\n${args.context || args.fallback}`,
        },
      ],
    }),
  }).finally(() => clearTimeout(timer));

  if (!res.ok) throw new Error("openai-http");
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("openai-empty");
  return text;
}
