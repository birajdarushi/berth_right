import { JARGON_EN, type JargonId } from "@/lib/i18n/en";
import { JARGON_MR } from "@/lib/i18n/mr";
import { JARGON_HI } from "@/lib/i18n/hi";

// Inline jargon gloss — English + Hindi + Marathi at the point of use.
export default function Term({ id }: { id: JargonId }) {
  const en = JARGON_EN[id];
  const hi = JARGON_HI[id];
  const mr = JARGON_MR[id];
  return (
    <details className="group my-2 rounded-lg border border-border/80 bg-muted/30 p-3 paper-shadow transition-colors">
      <summary className="cursor-pointer text-xs sm:text-sm font-semibold list-none flex items-center justify-between gap-2 min-h-8">
        <span className="flex items-center gap-1.5">
          <span className="font-mono text-primary font-bold">{en.abbr}</span>
          <span className="font-normal text-muted-foreground">— {en.title}</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-mono uppercase bg-background px-1.5 py-0.5 rounded border border-border/60 group-open:hidden">
          EN + हिन्दी + मराठी
        </span>
      </summary>
      <div className="mt-2.5 pt-2 border-t border-border/60 flex flex-col gap-1.5 text-xs text-foreground/85 leading-relaxed">
        <p><strong className="font-mono text-[11px] text-foreground">EN:</strong> {en.plain}</p>
        {hi && (
          <p>
            <strong className="font-mono text-[11px] text-primary">{hi.abbr}:</strong> {hi.plain}
          </p>
        )}
        <p>
          <strong className="font-mono text-[11px] text-foreground">{mr.abbr}:</strong> {mr.plain}
        </p>
      </div>
    </details>
  );
}
