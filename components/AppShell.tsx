"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";
import { Button } from "@/components/ui/button";
import TrackBackground from "@/components/TrackBackground";
import { useI18n } from "@/lib/i18n/context";
import {
  Sliders,
  ShieldAlert,
  X,
  BookOpen,
  Map,
  Wallet,
  HelpCircle,
  Search,
  Languages,
} from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, setState } = useDemoState();
  const { lang, setLang, t } = useI18n();

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
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="flex min-h-11 items-center gap-2">
            <Image
              src="/brand/logo-mark-tight.png"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-lg"
            />
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">{t.common.appName}</span>
              <span className="hidden text-[10px] text-muted-foreground sm:block">
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
                  className={`min-h-9 text-sm ${active ? "text-primary font-medium" : "text-muted-foreground"}`}
                />
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Unified 3-Language Segmented Switcher */}
            <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5" role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-7 rounded-md px-2 text-xs font-semibold transition-all ${
                  lang === "en"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`min-h-7 rounded-md px-2 text-xs font-semibold transition-all ${
                  lang === "hi"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang("mr")}
                className={`min-h-7 rounded-md px-2 text-xs font-semibold transition-all ${
                  lang === "mr"
                    ? "bg-foreground text-background shadow-xs"
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
              className="min-h-9 gap-1.5 text-xs"
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
              className="min-h-9 gap-1.5 text-xs"
            />
          </div>
        </div>
      </header>

      {state.notification && (
        <div className="flex w-full items-start justify-between gap-2 border-b border-sky-200 bg-sky-50 px-4 py-2 text-xs text-sky-900">
          <p className="mx-auto flex w-full max-w-5xl items-start gap-1.5">
            <span className="font-semibold shrink-0">{t.common.inAppNotice}</span>
            {state.notification}
          </p>
          <button
            type="button"
            aria-label={t.common.dismissNotice}
            className="flex min-h-6 min-w-6 shrink-0 items-center justify-center rounded hover:bg-sky-100"
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
