# Limitations

Berth Right is a hackathon prototype of a change to the Passenger Reservation System's RAC allocation logic. It is not a booking product. Honesty is part of the brief.

- Every data source is synthetic. No train, PNR, passenger, payment, queue or TTE record is real. There is no contact with IRCTC, NTES, CRIS, or any government system.
- The same-gender queue-position cost shown before you commit a sharing preference is derived from this repo's seed data, not from a live RAC queue. It is labelled an estimate.
- The refund percentage is a named configuration constant (`RAC_ENTITLEMENT_REFUND_RATIO = 0.5`) with a written rationale: an RAC side-lower berth is shared by two people, so a never-confirmed RAC passenger received half a berth's sleeping space for a full fare. This is a design proposal. It is not Indian Railways policy. Every screen that shows it says so, and cites the February 2026 Parliamentary Standing Committee recommendation that charging full fare of never-confirmed RAC passengers is not justified.
- Chart preparation timing varies. Public sources cite 4 hours, 10 hours, and a 9–18 hour window before departure. This demo uses 4 hours before departure for its time-travel control and states in the UI that timing varies by train and route.
- Clerkage on RAC cancellation is also unsettled (flat ₹60+GST, versus ₹60 non-AC / ₹120–240 AC). The prototype shows the range and marks the rule unverified.
- Ladies quota berth counts conflict in public sources (6 per train vs 4–6 per coach). No logic here depends on that number.
- The pairing engine is deterministic and unit-tested against the five cases in the spec. It is untested against real RAC queue volumes.
- Who shares a berth is decided by the constraint solver in `lib/pairing.ts`. The optional OpenAI call only rephrases already-computed outcomes. If the key is missing or the call times out, pre-written copy is shown. A demo never blocks on the model.
- Co-passenger information exposed in tracking: gender and boarding/alighting station only. Never name, age, photograph, contact details, or PNR of the other person.
- Selection by a hackathon does not imply adoption by any government body.
- No affiliation with, endorsement by, or connection to Indian Railways, IRCTC, or CRIS. No government logos, seals, or emblems appear in the UI.
- Mock login / OTP, if used, accepts any 6-digit code. Documented credential: `000000`. There are no real user accounts.

The same disclosure is on `/limitations` in the running app, and a persistent banner plus per-screen mock markers label synthetic data on every page.
