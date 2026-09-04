# Two-minute video script

Cap: 2:00, end by 1:55. No logo, no title card, no self-introduction. First fifteen seconds decide whether the reviewer stays.

## 0:00–0:12 — cold open, no title card

> "You're a woman travelling alone overnight. Your ticket is RAC, so you're sharing one side-lower berth with a stranger. You find out who — when you board. At night. On a moving train."

## 0:12–0:22 — scale

> "This isn't rare. Last financial year, 3.39 crore tickets never confirmed. Everyone who lands on RAC shares a berth, and gender has never been part of who gets paired with whom."

## 0:22–1:00 — the journey (screen recording, 375px viewport, no narration of clicks)

Narrate the *decisions*, not the interface:

- `/preference` — "You state your preference before you pay. And it tells you the truth about what that costs — same-gender only puts you about five places back on this train. We show the trade-off instead of hiding it."
- `/fare` — "Full fare for half a berth. A Parliamentary committee called that unjustified in February."
- `/tracking` — "Your co-passenger's gender and stations. Not their name, age or photo. That's deliberate."
- `/demo` → chart prepares — "The outcome arrives. You don't go looking for it."
- `/entitlement` — "You're owed ₹350. No fee. Direct to your bank. The market currently sells this back to you as a paid add-on."

## 1:00–1:50 — how and why

Say these four conversationally, not as a read list:

1. **Why nobody has built this.** ConfirmTkt and ixigo can't. Allocation is inside CRIS. This has to be a change to the system, not a wrapper around it.
2. **Solver, not model.** A deterministic constraint solver decides pairings. The language model only rephrases. Nothing that affects someone's safety is a model's guess.
3. **Rules as data.** Fare rules are a table with citations, not code. Policy changes by circular — an official edits a row, nobody redeploys.
4. **What's mocked.** Every data source is synthetic. The refund percentage is a proposal, not policy. Chart timing sources conflict and the interface says so. All of it is at `/limitations`.

## 1:50–1:55 — close

> "Berth Right. One rule the reservation system doesn't have yet."

## Delivery notes

- Record in one take if possible. Two-minute cuts read as over-produced.
- Screen-record on a 375px viewport, not desktop — the brief names mobile users.
- Do not read the architecture list aloud as a list. Say the four things conversationally and move on.
- Say "3.39 crore" out loud. It answers the hardest question about this project: is this rare, or is RAC pairing the sharpest instance of a much bigger problem.
- End at 1:55. Running over the cap is an avoidable own goal.
