// Jargon translated into plain English at the point of use — SPEC.md §12 / §4.1 #12.
// Not a full bilingual UI. Only the words that actually confuse first-time bookers.

export const JARGON_EN = {
  RAC: {
    abbr: "RAC",
    title: "Reservation Against Cancellation",
    plain: "You have a berth number, but you share a side-lower berth with one other passenger until a full berth opens, or the journey ends.",
  },
  GNWL: {
    abbr: "GNWL",
    title: "General Waiting List",
    plain: "The common waitlist. You cannot board until this becomes RAC or a confirmed berth.",
  },
  RLWL: {
    abbr: "RLWL",
    title: "Remote Location Waiting List",
    plain: "A waitlist tied to an intermediate station. You cannot board until it becomes RAC or confirmed.",
  },
  PQWL: {
    abbr: "PQWL",
    title: "Pooled Quota Waiting List",
    plain: "A waitlist against a shared quota of seats. You cannot board until it becomes RAC or confirmed.",
  },
  clerkage: {
    abbr: "Clerkage",
    title: "Cancellation processing charge",
    plain: "A small fee kept when a ticket is cancelled. Sources disagree on the amount (₹60 + GST, or ₹60 non-AC / ₹120–240 AC).",
  },
  chart: {
    abbr: "Chart preparation",
    title: "Final seat list",
    plain: "The moment the railway locks who sits where. Timing varies by train (sources cite 4h, 10h, or 9–18h before departure).",
  },
} as const;

export type JargonId = keyof typeof JARGON_EN;
