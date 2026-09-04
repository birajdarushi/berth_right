# Berth Right

A hackathon prototype of a **change to RAC berth pairing** — not a ticket-booking app.

Indian Railways already uses gender in some allocation. It does not use gender when two RAC passengers are assigned to share one side-lower berth overnight. A woman travelling alone can be paired with a male stranger and only finds out when she boards. Third-party apps cannot fix this: allocation lives inside CRIS. This prototype shows what the system itself should do.

If the ticket never becomes a full berth, the passenger still pays the full confirmed-class fare. A February 2026 parliamentary committee called that unjustified. Berth Right treats a partial refund as an **entitlement**, not a paid add-on.

**Not affiliated with Indian Railways, IRCTC, or CRIS.** All trains, PNRs, passengers and payments are synthetic.

## 250-word summary

Every year, tens of millions of Indian train tickets never confirm. In FY 2025-26 alone, 3.39 crore passengers had waitlisted tickets auto-cancelled. Those who land on RAC face something the system has never addressed: two strangers share one side-lower berth overnight, and gender is not an input to who gets paired with whom. A woman travelling alone discovers who she is sharing with when she boards, at night, on a moving train.

Berth Right prototypes the fix inside the reservation system rather than around it. Third-party apps cannot solve this — berth allocation lives in CRIS, and no partner API exposes it. So this is a proposed change to allocation logic, shown as a working citizen journey.

You state a sharing preference before you pay, and the interface tells you honestly what that preference costs you in queue position. A deterministic constraint solver — never a language model — does the pairing. Tracking shows your co-passenger's gender and boarding station, and nothing else. When the chart prepares, the outcome is delivered rather than discovered.

If your ticket stays RAC through final charting, you paid a full fare for half a berth. A February 2026 Parliamentary Standing Committee called that unjustified. Berth Right asserts the refund automatically: no claim, no fee, no assurance add-on, direct to your bank.

All data is synthetic and labelled as such in the running interface. Every limitation is disclosed at `/limitations`. Not affiliated with Indian Railways, IRCTC or CRIS.

## Run

```bash
npm install
npm test
npm run dev
```

Open http://localhost:3000. Mobile-first: 375px width.

Mock OTP, if used (`/login`): any 6 digits, documented credential `000000`.

`OPENAI_API_KEY` is optional. With it empty, `/api/explain` returns the static fallback and the journey still completes.

## Deploy

Target: `berthright.birajdar.in`, with the `.vercel.app` URL as fallback.
