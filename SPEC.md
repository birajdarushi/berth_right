# Berth Right — Build Specification

**Deploy target:** `berthright.birajdar.in` (Vercel custom domain), with the `.vercel.app` URL retained as a verified fallback. Submit whichever has been stable for 24 hours.


**Status:** Hackathon prototype. Not affiliated with, endorsed by, or connected to Indian Railways, IRCTC, or CRIS.
**Submission deadline:** 28 August 2026, 20:00 IST. Feature freeze 26 August, end of day.
**Builder:** solo.

This document is the standing context for the coding agent. Read it fully before writing code. If any instruction here conflicts with a later chat instruction, ask before proceeding.

---

## 1. What this is

A prototype of a **change to the Passenger Reservation System's RAC allocation logic**, demonstrated through a working citizen-facing booking journey.

Berth Right is **not** another ticket-booking app. Positioning matters and must be visible in the UI and the code:

- No service fee, convenience fee, or paid "assurance" tier anywhere — not even mocked.
- No upsells, ads, cross-sells, or wallet.
- The refund is framed as an **entitlement**, never as a product feature.

Rationale: third-party operators (ConfirmTkt, ixigo, Trainman, RailYatri) cannot build this. Berth allocation happens inside CRIS; no partner API exposes it. The gap is structural, not commercial. The prototype's job is to show what the system itself should do.

---

## 2. Problem statement

Three documented gaps, addressed in priority order.

### 2.1 Gender-blind RAC pairing (the spine)

Two RAC passengers share one side-lower berth. Gender is not an input to the pairing. A woman travelling alone can be assigned to share a berth overnight with a male stranger, and discovers this only when she boards.

Her only recourse is to locate the TTE on a moving train at night and negotiate. Outcome depends on that individual and on whether a berth happens to be vacant.

Notable: the PRS already applies gender logic elsewhere in allocation. It is absent specifically from RAC pairing, where the physical proximity is greatest.

**Status:** unsolved by IRCTC and by every third-party app. Recurring complaint across Reddit, Quora and X through 2024–2026.

### 2.2 RAC fare without entitlement (the payoff)

An RAC passenger pays the **full confirmed-class fare**. If the ticket never clears to a full berth, they travel the entire journey on half a shared berth and receive nothing back.

A Parliamentary Standing Committee in February 2026 called charging full fare from never-confirmed RAC passengers **not justified** and recommended review. No change has been implemented as of August 2026.

Meanwhile the private market sells 2x/3x "refund assurance" add-ons — paid upfront, frequently paying out only the standard IRCTC refund minus the app's own fee, credited to an app wallet rather than a bank account, often 10–16 days later. The anxiety created by the system has been monetised instead of removed.

### 2.3 Comprehension barriers (how we build, not a fourth feature)

- First-time bookers purchase waitlisted e-tickets without being told that boarding an unconfirmed e-ticket is not permitted and carries a penalty. They pay money for a ticket that will strand them.
- GNWL / RLWL / PQWL / RAC are presented as bare acronyms.
- Apps offer language toggles but leave the jargon untranslated.

---

## 3. Non-negotiables

These are graded criteria. Treat them as hard requirements, not polish.

1. **Every mocked element is labelled in the running UI**, not only in the README. A persistent, non-dismissible banner plus inline markers on mocked data.
2. **No live contact with any government system.** No IRCTC endpoints, no NTES, no scraping, no undocumented APIs. All data synthetic.
3. **No real personal data.** No real Aadhaar, PAN, phone numbers, or payment details. Synthetic names must be obviously synthetic.
4. **No government logos, seals, or emblems.** No visual styling that implies official status. A disclaimer in the footer of every screen.
5. **Uncertainty is disclosed, not hidden.** Where sources conflict (see §7), the UI says so.
6. **Allocation decisions are deterministic and auditable.** No LLM decides who shares a berth with whom.

---

## 4. Scope

### 4.1 Build — must work end to end

| # | Capability |
|---|---|
| 1 | Search → RAC-bearing results → book → PNR issued |
| 2 | RAC explainer with a diagram of an actual shared side-lower berth |
| 3 | Sharing-preference control with honest disclosure of its cost |
| 4 | Boarding-legality disclosure before payment |
| 5 | Deterministic gender-aware pairing engine |
| 6 | Tracking view: RAC position + provisional pairing |
| 7 | Demo time-travel to chart preparation |
| 8 | Three chart outcomes: cleared to full berth / RAC with preference honoured / RAC with preference unmet + remedy |
| 9 | In-journey escalation producing a structured record |
| 10 | Fare breakdown with refundable portion identified |
| 11 | Entitlement assertion → status through to notional credit |
| 12 | Jargon translated into plain English + Marathi at the point of use (RAC, GNWL, RLWL, PQWL, clerkage, chart preparation). **Not** a full bilingual UI — that is too expensive for the time available. Translate the words that actually confuse people, inline, where they appear. |
| 13 | OpenAI-powered plain-language explanation layer |

### 4.2 Mock — build, but label

- Trains, coaches, RAC queues, synthetic passengers with gender attributes
- Payment (a clearly fake gateway screen — never resembling a real one)
- Login / OTP
- The TTE-side view of an escalation (one screen, marked mocked)
- Notification delivery (render in-app; do not send SMS or push)
- The estimated position cost of the same-gender constraint (see §6.4)

### 4.3 Out of scope — do not build

- Seat/berth map selection. IRCTC shipped preferred seat selection on 15 July 2026. Building it is redundant and will read as unaware.
- Tatkal. Crowded field, and the new platform targets that congestion directly.
- Waitlist confirmation prediction. ConfirmTkt and others already do this; it is not our differentiator.
- User accounts, booking history, profiles
- Groups larger than a travelling pair
- Admin dashboards (reviewers test the citizen experience)
- Native app (reviewers will not download one)
- Dark mode, animation systems, marketing landing page

---

## 5. Data model

TypeScript types in `/lib/types.ts`. All seed data in `/lib/seed/`.

```ts
type Gender = 'female' | 'male' | 'transgender';

type SharingPreference =
  | 'same_gender_only'      // hard constraint
  | 'no_preference'         // no constraint
  | 'companion'             // pair with a named co-passenger on the same booking
  | 'prefer_same_gender';   // soft: honoured when possible, never blocks confirmation

interface Passenger {
  id: string;
  displayName: string;       // obviously synthetic
  gender: Gender;
  age: number;
  isMinor: boolean;          // age < 18
  travellingAlone: boolean;
}

interface Train {
  number: string;            // synthetic, must not collide with a real train number
  name: string;
  from: StationCode;
  to: StationCode;
  departure: ISODateTime;
  arrival: ISODateTime;
  isOvernight: boolean;      // drives the safety framing
  classes: TravelClass[];
}

interface Coach {
  id: string;
  class: TravelClass;
  sideLowerBerths: BerthId[];   // the RAC-shareable berths
  fullBerths: BerthId[];
}

interface RacEntry {
  position: number;             // queue order at booking
  passenger: Passenger;
  preference: SharingPreference;
  boardingStation: StationCode;
  alightingStation: StationCode;
  bookedAt: ISODateTime;
}

interface Pairing {
  berthId: BerthId;
  occupants: [RacEntry, RacEntry?];   // second slot may be empty
  constraintsSatisfied: ConstraintResult[];
  preferenceViolated: boolean;
  explanation: string;                // generated by the solver, not the LLM
}

interface Booking {
  pnr: string;                  // synthetic format, visibly not a real PNR
  train: Train;
  passengers: Passenger[];
  status: 'RAC' | 'CNF' | 'WL';
  racPosition?: number;
  fare: FareBreakdown;
  createdAt: ISODateTime;
}
```

**Seed volume:** 8 trains (at least 5 overnight), 3 coaches each, RAC queues of 12–30 entries with a realistic gender mix (roughly 30–35% female — deliberately skewed, because a minority female population is precisely what makes naive pairing fail).

---

## 6. Pairing engine

`/lib/pairing.ts`. **Pure functions. Deterministic. No network calls. No LLM.** Must be unit-tested.

### 6.1 Hard constraints (never violated)

1. A passenger with `same_gender_only` is paired only with a matching gender, or left unpaired.
2. An unaccompanied minor is never paired with an unrelated adult.
3. Occupancy per side-lower berth never exceeds two.
4. Journey segments must overlap — no pairing two passengers whose travel windows do not intersect.

### 6.2 Soft constraints (optimised, ranked)

1. Companions on the same booking are paired together.
2. `prefer_same_gender` honoured where it does not displace anyone holding a hard constraint.
3. Minimise partner churn — prefer pairs whose boarding and alighting stations align.
4. Preserve RAC queue order as closely as the above allow.

### 6.3 Transgender passengers

Never force-assigned into a binary bucket. The preference control offers an explicit choice, and the solver treats the stated preference as the constraint. If the passenger selects `same_gender_only`, match on self-declared gender. Document this decision in the code and in the video — a judge will ask.

### 6.4 Honest cost disclosure

A hard same-gender constraint can push a passenger down the effective queue when few same-gender candidates exist. **Compute this and show it before the passenger commits:**

> Same-gender only may move you approximately N places back in the RAC queue on this train.

Derive N from the seed queue's actual gender distribution. Label it an estimate. Never conceal the trade-off to make the feature look free — the disclosure *is* the product.

### 6.5 Explainability

Every `Pairing` carries a machine-generated `explanation` listing which constraints applied. The OpenAI layer may rephrase it. It may never author it.

---

## 7. Fare rules

`/lib/fare-rules.ts`. **Rules stored as data rows, not conditionals.** Each row carries: condition, outcome, source citation, and a `verified: boolean` flag.

This structure is the answer to "how would this work safely at scale" — policy changes by circular, so rules live in a table an official can edit rather than in code requiring redeployment.

### 7.1 Current rules (represent as-is; flag conflicts)

- RAC passengers pay full confirmed-class fare for their travel class.
- No refund of any difference if the ticket never clears to a full berth.
- Cancellation before chart preparation: clerkage only.

**Known source conflicts — surface these in the UI rather than picking silently:**

| Fact | Conflicting values found | Action |
|---|---|---|
| Chart preparation timing | 4h / 10h / 9–18h before departure | Pick one, cite it, state in-UI that timing varies by train and route |
| Clerkage on RAC cancellation | flat ₹60+GST / ₹60 non-AC and ₹120–240 AC | Show the range, mark `verified: false` |
| Ladies quota berth count | 6 per train / 4–6 per coach | Do not depend on this number in any logic |

### 7.2 Proposed rule (the reform being prototyped)

> Where a passenger holds RAC status through final chart preparation and is never allotted a full berth, a proportion of the fare corresponding to the unprovided berth share is refunded automatically, without a claim being filed.

- Percentage is a **named configuration constant** with a written rationale, not a magic number.
- Every screen showing it labels it a **proposal**, citing the February 2026 Parliamentary Standing Committee recommendation.
- Do not present this as existing policy. Ever.

### 7.3 The contrast screen

One screen, deliberately plain:

> **You are owed ₹X. No fee. Direct to your bank.**

Beneath it, a factual comparison with what the market currently sells: paid assurance add-ons, payouts net of the operator's own fee, credited to app wallets, 10–16 day delays. Cite sources. State no company name in an accusatory frame — describe the practice, not the brand.

---

## 8. API contracts

Route handlers under `/app/api`. All handlers **pure** — state in, result out (see §10.2).

| Route | Method | In | Out |
|---|---|---|---|
| `/trains/search` | GET | from, to, date | Train[] with RAC availability |
| `/rac/preference/cost` | POST | trainId, gender, preference | `{ estimatedPositionDelta, basis, isEstimate: true }` |
| `/book` | POST | train, passengers, preference | Booking with synthetic PNR |
| `/rac/pair` | POST | racQueue, coachConfig | `Pairing[]` + unpaired list |
| `/chart/prepare` | POST | booking, racQueue, seed | Chart outcome, all branches |
| `/escalate` | POST | pnr, reason, timestamp | Structured escalation record |
| `/fare/entitlement` | POST | booking, chartOutcome | `{ amount, ruleId, citation, isProposal }` |
| `/explain` | POST | topic, context, locale | Plain-language text |

---

## 9. Screens

Mobile-first. Design target 375px width. Desktop is a secondary concern.

1. **Search** — from, to, date. Three taps maximum.
2. **Results** — RAC-bearing options surfaced, each with a plain-language status line.
3. **What RAC actually means** — with a diagram of a shared side-lower berth. Most first-time bookers have never seen one explained.
4. **Boarding-legality disclosure** — unmissable, before payment, if status is WL.
5. **Sharing preference** — four options, each showing its honest cost.
6. **Passenger details** — synthetic only.
7. **Fare breakdown** — refundable portion identified, proposal labelled.
8. **Mock payment** — visibly fake.
9. **Booking confirmation** — synthetic PNR, clearly formatted as non-real.
10. **Tracking** — RAC position, movement history, provisional pairing.
11. **Chart outcome** — three branches, all reachable in the demo.
12. **In-journey escalation** — one tap, structured record, mocked TTE receipt.
13. **Entitlement** — amount, rule, citation, status through to notional credit.
14. **Demo control panel** — time travel, seed reset, branch selection. Deliberate and labelled, reachable from every screen.

### 9.1 Privacy floor

Co-passenger information exposed: **gender and boarding/alighting station only.**

Never: name, age, photograph, contact details, PNR, or seat history.

State this explicitly in the video. Restraint about what *not* to show reads as maturity and is rarely demonstrated.

---

## 10. Architecture

```
Next.js (App Router) + TypeScript + Tailwind → Vercel

/app
  /api/*                      # pure route handlers
  /(screens)/*
/lib
  types.ts
  clock.ts                    # single source of "now"
  pairing.ts                  # constraint solver — unit tested
  fare-rules.ts               # rules as data + citations
  i18n/{en,mr}.ts             # jargon translated, not transliterated
  seed/*.json
/components
  MockDataBanner.tsx          # persistent, non-dismissible
  DemoControls.tsx
```

### 10.1 Clock abstraction

Every time-dependent behaviour reads from `clock.ts`. Never call `Date.now()` directly outside it. This is what makes time-travel a clean architectural affordance rather than a demo hack — and it is worth explaining on camera.

### 10.2 State handling on serverless

Vercel route handlers do not retain module-level state between invocations. **Do not attempt an in-memory server store.**

Approach: demo state lives client-side in a React context, persisted to `sessionStorage`. Server routes are pure — they receive state and return a computed result. Benefits: deterministic, replayable, survives cold starts, and every reviewer session is independent.

### 10.3 OpenAI layer

- Server-side only. Key in an environment variable. Never exposed to the client.
- **Translation, never decision.** It phrases outcomes. It does not compute pairings, fares, entitlements, or positions.
- **Mandatory static fallback.** If the API call fails or times out, render pre-written copy. A live demo must never show a spinner or an error because an external call failed. This is not optional.
- Cap tokens and add a timeout. Cache responses by topic + locale.

### 10.4 Performance budget

State a target and meet it: usable on a 3G connection, initial payload under 200KB gzipped. Server-render where possible. No heavy client libraries. The brief names slow connections; almost nobody will measure it, so measure it and say the number.

---

## 11. Testing

Deliberately minimal. The organiser has stated that ideas are weighted above implementation; do not spend demo-building hours on coverage nobody will read. Five focused unit tests on `pairing.ts`:

1. Hard same-gender constraint never violated
2. Unaccompanied minor never paired with an unrelated adult
3. Determinism: identical input yields identical output
4. No valid partner available → left unpaired, never silently mismatched
5. Queue order preserved where constraints allow

Stop there. Hours saved go to §15.

---

## 12. Disclosure requirements

A `LIMITATIONS.md` in the repo root, and a corresponding in-app screen, stating plainly:

- Every data source is synthetic
- The position-cost estimate is derived from seed data, not real queues
- The refund percentage is a design proposal, not policy
- Chart preparation timing varies and sources conflict
- The pairing engine is untested against real RAC queue volumes
- Selection by the hackathon does not imply adoption by any government body
- No affiliation with Indian Railways, IRCTC, or CRIS

Honesty is an explicitly scored criterion. Over-disclose.

---

## 15. Judging reality — design for it

Source: organiser's rules video.

- 5,000+ entries, 250 shortlisted (~5%), reviewed 28 Aug – 1 Sep by the organiser's content team together with OpenAI's India team.
- Judged **as a citizen using it**, at volume, at speed. Admin-side quality is assumed, not inspected.
- Stated priority: *"focus on ideas over code"* — novelty of idea, weighted above implementation depth.
- Two-minute video cap: minute one is the citizen demo, minute two is how and why you built it.
- IRCTC will be the most-picked platform. Most submissions will address Tatkal or general UI. Differentiation is the constraint that matters.

### 15.1 Demo narrative

Open cold on the problem. No logo, no title card, no self-introduction. First frame: a woman boards an overnight train and finds a male stranger on her berth. State it in under ten seconds, then show the fix.

The reviewer is on their fortieth video. The first fifteen seconds decide whether they engage.

### 15.2 Minute-two content, in priority order

1. Why no third-party app can build this — allocation lives inside CRIS
2. The deterministic/model boundary — a constraint solver allocates, the model only phrases
3. Rules as data, so policy changes without redeployment
4. What is mocked and what is uncertain

Twenty seconds on architecture is enough. Do not lecture.

### 15.3 First-screen test

A reviewer who opens the live link and looks at one screen should understand the problem and the fix without scrolling. If the first screen is a search form, the idea is buried. Lead with the premise.

---

## 13. Build order

| Day | Deliverable |
|---|---|
| 24 Aug | Repo scaffold, types, seed data, fare-rules table with citations |
| 25 Aug | Search → preference → book → PNR. Clock + time travel. Styling can wait. |
| 26 Aug | Pairing engine + tests, tracking, chart prep, all three branches, entitlement. **Freeze.** |
| 27 Aug | OpenAI layer + fallbacks, jargon translation, mobile polish, mock labels, deploy, incognito test on mobile data, LIMITATIONS.md, 250-word summary. **Script and rehearse the video today** — do not meet it cold tomorrow. |
| 28 Aug AM | Record video, submit by afternoon. Not 19:50. |

---

## 14. Definition of done

- [ ] Live public URL, opens with zero access requests, verified in incognito on mobile data
- [ ] Full journey completable on a 375px screen without a keyboard shortcut or desktop hover
- [ ] All three chart-outcome branches reachable via demo controls
- [ ] Mock-data banner visible on every screen
- [ ] Pairing tests passing
- [ ] OpenAI fallback verified by disabling the key and completing the journey
- [ ] LIMITATIONS.md complete and linked in-app
- [ ] No fee, upsell, or wallet anywhere in the UI
- [ ] No government logo, emblem, or official-looking styling
- [ ] Mock login credentials documented in the submission