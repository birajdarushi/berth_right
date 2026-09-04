import Link from "next/link";
import Screen from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { TicketX } from "lucide-react";

import { useI18n } from "@/lib/i18n/context";

// Shared empty state for screens that need a booking already in demo state
// (tracking, chart outcome, escalate, entitlement) but none exists yet.
export default function NoBookingState({
  message,
}: {
  message?: string;
}) {
  const { t } = useI18n();
  const displayMessage = message ?? t.tracking.noBookingFound;

  return (
    <Screen>
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <TicketX className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{displayMessage}</p>
        <Button
          render={<Link href="/">{t.tracking.searchTrainsBtn}</Link>}
          size="sm"
        />
      </div>
    </Screen>
  );
}
