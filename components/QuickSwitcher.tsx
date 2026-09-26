"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Compass, Search, ArrowRight, CornerDownLeft } from "lucide-react";

interface RouteItem {
  path: string;
  step?: number;
  title: string;
  category: "Booking Journey" | "In-Journey & Settlement" | "Explainer & System";
  description: string;
}

const ALL_ROUTES: RouteItem[] = [
  // 1. Booking Journey
  {
    path: "/",
    step: 1,
    title: "Search & Dilemma",
    category: "Booking Journey",
    description: "Lead with the premise: 3.39 crore waitlisted passengers and RAC dilemma",
  },
  {
    path: "/results",
    step: 2,
    title: "Train Search Results",
    category: "Booking Journey",
    description: "RAC availability & queue lengths across trains",
  },
  {
    path: "/preference",
    step: 3,
    title: "Sharing Preference",
    category: "Booking Journey",
    description: "State co-passenger gender preference and inspect queue cost",
  },
  {
    path: "/passengers",
    step: 4,
    title: "Passenger Details",
    category: "Booking Journey",
    description: "Name, age, gender, and travelling alone status",
  },
  {
    path: "/fare",
    step: 5,
    title: "Fare Breakdown & Entitlement",
    category: "Booking Journey",
    description: "Clear line-item fare with automatic partial refund entitlement",
  },
  {
    path: "/boarding",
    step: 6,
    title: "Boarding Legality",
    category: "Booking Journey",
    description: "Clear disclosure: RAC can board legally, unconfirmed waitlist cannot",
  },
  {
    path: "/payment",
    step: 7,
    title: "Payment Gateway",
    category: "Booking Journey",
    description: "Clearly marked synthetic payment sandbox",
  },
  {
    path: "/confirmation",
    step: 8,
    title: "Booking Confirmed (PNR)",
    category: "Booking Journey",
    description: "10-digit PNR issued with provisional RAC position",
  },

  // 2. In-Journey & Settlement
  {
    path: "/tracking",
    step: 9,
    title: "Live Journey Tracking",
    category: "In-Journey & Settlement",
    description: "Real-time queue position and co-passenger gender transparency",
  },
  {
    path: "/chart-outcome",
    step: 10,
    title: "Chart Preparation Outcome",
    category: "In-Journey & Settlement",
    description: "Chart 1 outcome at T-4 hours: cleared, honoured, or unmet",
  },
  {
    path: "/entitlement",
    step: 11,
    title: "Entitlement Assertion",
    category: "In-Journey & Settlement",
    description: "Automatic ₹350 credit direct to bank account without claims",
  },
  {
    path: "/escalate",
    step: 12,
    title: "In-Journey Escalation",
    category: "In-Journey & Settlement",
    description: "Structured incident record for TTE review on moving train",
  },

  // 3. Explainer & System
  {
    path: "/rac-explainer",
    title: "RAC Berth Explainer",
    category: "Explainer & System",
    description: "Physical scale diagram of the shared side-lower berth",
  },
  {
    path: "/queue",
    title: "Interactive Queue Solver",
    category: "Explainer & System",
    description: "Deterministic pairing solver and coach visualizer",
  },
  {
    path: "/demo",
    title: "Demo Time-Travel Controller",
    category: "Explainer & System",
    description: "Jump clock to chart preparation and simulate outcomes",
  },
  {
    path: "/limitations",
    title: "System Limitations",
    category: "Explainer & System",
    description: "Honest disclosure of synthetic data, assumptions, and scope",
  },
  {
    path: "/login",
    title: "Mock OTP Login",
    category: "Explainer & System",
    description: "Citizen sign-in sandbox (accepts any 6 digits e.g. 000000)",
  },
];

export default function QuickSwitcher({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ROUTES;
    return ALL_ROUTES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(path);
  };

  const categories = ["Booking Journey", "In-Journey & Settlement", "Explainer & System"] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-lg p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl">
        <DialogHeader className="border-b border-border/80 px-4 py-3 bg-muted/30 pr-10">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-primary" />
            <DialogTitle className="text-sm font-semibold tracking-tight">
              Journey Switcher
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Quick jump to any screen in Berth Right
          </DialogDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search screens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 text-xs bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto p-2 divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching screen found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            categories.map((cat) => {
              const items = filtered.filter((i) => i.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="py-2 first:pt-0 last:pb-0">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                    {cat}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {items.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleSelect(item.path)}
                        className="group flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent/60 focus:bg-accent/60 focus:outline-hidden"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block">
                            {item.title}
                          </span>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                        <CornerDownLeft className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogPopup>
    </Dialog>
  );
}
