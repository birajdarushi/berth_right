import { JARGON_EN, type JargonId } from "@/lib/i18n/en";
import { JARGON_MR } from "@/lib/i18n/mr";
import { JARGON_HI } from "@/lib/i18n/hi";

// Inline jargon gloss — English + Hindi + Marathi at the point of use.
export default function Term({ id }: { id: JargonId }) {
  const en = JARGON_EN[id];
  const hi = JARGON_HI[id];
  const mr = JARGON_MR[id];
  return (
    <details className="group my-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
      <summary className="cursor-pointer text-sm font-medium list-none flex items-center justify-between gap-2 min-h-11">
        <span>
          {en.abbr}
          <span className="font-normal text-zinc-600"> — {en.title}</span>
        </span>
        <span className="text-xs text-zinc-500 group-open:hidden">EN + हिन्दी + मराठी</span>
      </summary>
      <p className="text-xs text-zinc-700 mt-1">{en.plain}</p>
      {hi && (
        <p className="text-xs text-zinc-700 mt-1">
          <span className="font-medium text-primary">{hi.abbr}</span> — {hi.plain}
        </p>
      )}
      <p className="text-xs text-zinc-700 mt-1">
        <span className="font-medium">{mr.abbr}</span> — {mr.plain}
      </p>
    </details>
  );
}
