"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";
import { Button } from "@/components/ui/button";
import TrackBackground from "@/components/TrackBackground";
import { useI18n } from "@/lib/i18n/context";
import { useState } from "react";
import QuickSwitcher from "@/components/QuickSwitcher";
import {
  Sliders,
  ShieldAlert,
  X,
  BookOpen,
  Map,
  Wallet,
  HelpCircle,
  Search,
  Compass,
} from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, setState } = useDemoState();
  const { lang, setLang, t } = useI18n();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const primaryNav = [
    { href: "/", label: t.nav.search, icon: Search },
    { href: "/rac-explainer", label: t.nav.racExplained, icon: BookOpen },
    { href: "/tracking", label: t.nav.myTrips, icon: Map },
    { href: "/entitlement", label: t.nav.refunds, icon: Wallet },
    { href: "/limitations", label: t.nav.help, icon: HelpCircle },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TrackBackground />
      <QuickSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />

      <header className="sticky top-0 z-20 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="flex min-h-10 items-center gap-2 group">
            <Image
              src="/brand/logo-mark-tight.png"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-md border border-border/80 shadow-2xs"
            />
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight font-heading text-foreground group-hover:text-primary transition-colors">
                {t.common.appName}
              </span>
              <span className="hidden text-[10px] text-muted-foreground sm:block tracking-wide">
                {t.common.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Button
                  key={item.href}
                  render={<Link href={item.href}>{item.label}</Link>}
                  variant="ghost"
                  size="sm"
                  className={`min-h-9 text-xs font-medium ${
                    active ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                />
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* QuickSwitcher Trigger */}
            <Button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              variant="outline"
              size="sm"
              className="min-h-8 gap-1.5 px-2.5 text-xs border-border/80 bg-card hover:bg-muted font-normal shadow-2xs"
              title="Quick-switch screens (⌘K)"
            >
              <Compass className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Jump</span>
              <kbd className="hidden lg:inline-flex text-[9px] text-muted-foreground font-mono bg-muted px-1 py-0.5 rounded border border-border/60">
                ⌘K
              </kbd>
            </Button>

            {/* Unified 3-Language Segmented Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5" role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-7 rounded-md px-2 text-xs font-medium transition-all ${
                  lang === "en"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`min-h-7 rounded-md px-2 text-xs font-medium transition-all ${
                  lang === "hi"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang("mr")}
                className={`min-h-7 rounded-md px-2 text-xs font-medium transition-all ${
                  lang === "mr"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                मराठी
              </button>
            </div>

            <Button
              render={
                <Link href="/demo">
                  <Sliders className="size-3.5" />
                  <span className="hidden sm:inline">{t.nav.demo}</span>
                </Link>
              }
              variant="ghost"
              size="sm"
              className="min-h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            />
            <Button
              render={
                <Link href="/limitations">
                  <ShieldAlert className="size-3.5" />
                  <span className="hidden sm:inline">{t.nav.limitations}</span>
                </Link>
              }
              variant="ghost"
              size="sm"
              className="min-h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            />
          </div>
        </div>
      </header>

      {state.notification && (
        <div className="flex w-full items-start justify-between gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2 text-xs text-foreground">
          <p className="mx-auto flex w-full max-w-5xl items-start gap-1.5">
            <span className="font-semibold text-primary shrink-0">{t.common.inAppNotice}</span>
            <span>{state.notification}</span>
          </p>
          <button
            type="button"
            aria-label={t.common.dismissNotice}
            className="flex min-h-6 min-w-6 shrink-0 items-center justify-center rounded hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            onClick={() => setState({ notification: "" })}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex w-full flex-1 flex-col pb-14 md:pb-0">{children}</div>

      <footer className="mt-auto w-full border-t border-border bg-muted/40 px-4 py-3 text-center text-[11px] text-muted-foreground">
        <Link href="/limitations" className="underline underline-offset-2 hover:text-foreground">
          {t.common.limitations}
        </Link>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-background/95 backdrop-blur md:hidden">
        {primaryNav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${
                active ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
