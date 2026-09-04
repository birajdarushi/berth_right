"use client";

// Client-side demo state per SPEC.md §10.2: server routes are pure, state lives here
// and is persisted to sessionStorage so it survives navigation and cold starts.
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Booking, Gender, SharingPreference } from "./types";
import type { ChartOutcome } from "@/app/api/chart/prepare/route";
import { setOffset } from "./clock";

interface DemoState {
  trainNumber?: string;
  gender?: Gender;
  preference?: SharingPreference;
  passengerName?: string;
  passengerAge?: number;
  booking?: Booking;
  chartOutcome?: ChartOutcome;
  clockOffsetMs?: number;
  notification?: string;
}

interface DemoStateContextValue {
  state: DemoState;
  setState: (patch: Partial<DemoState>) => void;
  clear: () => void;
}

function isValidBooking(b: unknown): b is Booking {
  const booking = b as Partial<Booking> | null | undefined;
  return Boolean(booking?.pnr && booking.fare && Array.isArray(booking.passengers));
}

const STORAGE_KEY = "berth-right-demo-state";
const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<DemoState>({});

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as DemoState;
    // A booking that failed to create (e.g. the /api/book error shape) could have been
    // written to storage by an earlier bug. Every screen trusts state.booking to have
    // pnr/fare/passengers, so drop anything malformed here — the single point all of
    // them read through — rather than defending each consumer separately.
    if (parsed.booking && !isValidBooking(parsed.booking)) {
      delete parsed.booking;
    }
    if (typeof parsed.clockOffsetMs === "number") setOffset(parsed.clockOffsetMs);
    setStateRaw(parsed);
  }, []);

  const setState = (patch: Partial<DemoState>) => {
    if (patch.booking && !isValidBooking(patch.booking)) {
      delete patch.booking;
    }
    setStateRaw((prev) => {
      const next = { ...prev, ...patch };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setOffset(0);
    setStateRaw({});
  };

  return (
    <DemoStateContext.Provider value={{ state, setState, clear }}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
