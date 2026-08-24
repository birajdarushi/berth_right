"use client";

// Client-side demo state per SPEC.md §10.2: server routes are pure, state lives here
// and is persisted to sessionStorage so it survives navigation and cold starts.
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Booking, Gender, SharingPreference } from "./types";
import type { ChartOutcome } from "@/app/api/chart/prepare/route";

interface DemoState {
  trainNumber?: string;
  gender?: Gender;
  preference?: SharingPreference;
  passengerName?: string;
  passengerAge?: number;
  booking?: Booking;
  chartOutcome?: ChartOutcome;
}

interface DemoStateContextValue {
  state: DemoState;
  setState: (patch: Partial<DemoState>) => void;
  clear: () => void;
}

const STORAGE_KEY = "berth-right-demo-state";
const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<DemoState>({});

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) setStateRaw(JSON.parse(raw));
  }, []);

  const setState = (patch: Partial<DemoState>) => {
    setStateRaw((prev) => {
      const next = { ...prev, ...patch };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    sessionStorage.removeItem(STORAGE_KEY);
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
