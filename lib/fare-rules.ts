// Fare policy as data, not conditionals — per SPEC.md §7. An official could edit this
// table without redeploying code. Conflicting sources are represented honestly, not
// silently resolved.

export interface FareRule {
  id: string;
  condition: string;
  outcome: string;
  sourceCitation: string;
  verified: boolean;
  /** True only for §7.2 — the reform being prototyped, never current policy. */
  isProposal?: boolean;
}

export const FARE_RULES: FareRule[] = [
  {
    id: "rac-full-fare",
    condition: "Passenger holds RAC status for a confirmed travel class.",
    outcome: "Full confirmed-class fare is charged, regardless of RAC status.",
    sourceCitation: "IRCTC / Indian Railways fare rules, as of 2026.",
    verified: true,
  },
  {
    id: "rac-no-refund-on-non-clearance",
    condition: "RAC ticket never clears to a full berth by journey end.",
    outcome: "No refund of any fare difference is issued under current policy.",
    sourceCitation: "IRCTC / Indian Railways fare rules, as of 2026.",
    verified: true,
  },
  {
    id: "cancellation-before-chart-clerkage-only",
    condition: "RAC ticket is cancelled before chart preparation.",
    outcome: "Only clerkage is deducted from the refund; remainder is returned.",
    sourceCitation: "Indian Railways refund rules (Railway servants / passenger refund rules), as of 2026.",
    verified: true,
  },
  {
    id: "chart-preparation-timing-conflict",
    condition: "Determining how many hours before departure the chart is prepared.",
    outcome:
      "Sources disagree: 4 hours before departure, 10 hours before departure, and a 9-18 hour window depending on route have all been cited. This prototype assumes 4 hours before departure for its demo timeline, but timing varies by train and route and is not settled here.",
    sourceCitation: "Conflicting public sources, compiled 2026 — no single authoritative figure found.",
    verified: false,
  },
  {
    id: "clerkage-amount-conflict",
    condition: "Determining the clerkage amount deducted on RAC cancellation.",
    outcome:
      "Sources disagree: a flat ₹60 + GST, versus ₹60 for non-AC classes and ₹120-240 for AC classes. This prototype shows the range rather than picking one.",
    sourceCitation: "Conflicting public sources, compiled 2026 — no single authoritative figure found.",
    verified: false,
  },
  {
    id: "rac-entitlement-proposal",
    condition:
      "Passenger holds RAC status through final chart preparation and is never allotted a full berth.",
    outcome:
      "PROPOSED, NOT CURRENT POLICY: a proportion of the fare corresponding to the unprovided berth share would be refunded automatically, without a claim being filed.",
    sourceCitation:
      "Parliamentary Standing Committee recommendation, February 2026, which called full-fare charging on never-confirmed RAC passengers 'not justified' and recommended review.",
    verified: false,
    isProposal: true,
  },
];

/**
 * §7.2 — the refund proportion for the entitlement proposal. A named constant with a
 * written rationale, not a magic number: an RAC side-lower berth is shared by two
 * passengers, so a never-confirmed RAC passenger received half a berth's worth of
 * sleeping space for the full fare. 50% approximates the unprovided share.
 */
export const RAC_ENTITLEMENT_REFUND_RATIO = 0.5;

/** Synthetic per-passenger base fares by class, for demo fare breakdowns only. */
export const BASE_FARE_BY_CLASS: Record<string, number> = {
  SL: 700,
  "3A": 1400,
};

/** Ladies quota berth count is deliberately excluded from logic — see SPEC.md §7.1: sources disagree (6/train vs 4-6/coach). */
export const LADIES_QUOTA_NOTE =
  "Sources disagree on ladies quota berth counts (6 per train vs 4-6 per coach); no logic in this prototype depends on this number.";
