import { Check } from "lucide-react";

const STEPS = ["Search", "Preference", "Passengers", "Review & Pay", "Confirmed"] as const;

// Numbered progress indicator for the booking flow (search -> preference ->
// passengers -> fare/review -> confirmation), matching the reference mockups.
export default function Stepper({ current }: { current: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <ol className="flex w-full items-center justify-between gap-1">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-3.5" /> : step}
              </div>
              <span
                className={`hidden text-[10px] sm:block ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <div className={`h-px flex-1 ${done ? "bg-emerald-500" : "bg-border"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
