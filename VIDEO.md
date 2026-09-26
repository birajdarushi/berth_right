# Two-Minute Pitch & Demo Script (Phase 2)

**Hard Cap:** 2:00 (Target Finish: 1:50–1:55).  
**Tone & Delivery:** Conversational, steady, and rhythmic. Emphasize breathing pauses (`...`) to avoid rushing. No self-intro, no logos—hook the reviewer immediately.

---

## ⏱️ Minute 1: The Problem & The Build in Action (0:00 – 1:00)

### 0:00 – 0:12 — The Hook (The Cold Reality)
*(Visual: Landing page or simple background — no title slide)*

> "You're a woman travelling alone overnight.  
> Your ticket is RAC... so you're sharing one side-lower berth with a stranger.  
> And you find out who... in the middle of the night... on a moving train."

---

### 0:12 – 0:22 — The Scale & The Root Issue
*(Visual: Transitioning into the app flow)*

> "This isn't rare.  
> Last financial year, 3.39 crore tickets never confirmed.  
> Everyone landing on RAC shares a berth, but gender was never part of that pairing system.  
> What troubles passengers most isn't just sharing—it's the complete lack of transparency, and the sudden surprise in the dark."

---

### 0:22 – 1:00 — Project in Action (Screen Recording, 375px Mobile Viewport)
*Show the flow smoothly; narrate what each step means for the passenger, not the UI buttons.*

* **0:22 – 0:32 | `/preference` — Upfront Trade-offs**
  > "Here's Berth Right.  
  > Before you pay, you state your preference.  
  > We don't make empty promises—the system honestly shows the trade-off. Choosing same-gender might put you five spots back on this train. You get the truth upfront so you decide what matters more: privacy, or travel certainty."

* **0:32 – 0:42 | `/tracking` & `/fare` — The Privacy Floor & Fair Cost**
  > "When your chart prepares, you see your co-passenger's gender and journey stations.  
  > No names, no photos—just enough to remove the fear of the unknown.  
  > You know what to expect before you ever step onto that platform. And if your ticket stays RAC, you're entitled to half your base fare back—not monetized as a paid add-on."

* **0:42 – 1:00 | `/chart-outcome` — The Outcome Arrives**
  > "The final outcome arrives directly on your phone.  
  > No hunting down the TTE at midnight. No uncomfortable surprises. You're in control."

---

## ⏱️ Minute 2: The Core Feature & Story of the Build (1:00 – 2:00)

> **Evaluator Focus:** One specific feature built, why it matters, and what makes your approach unique.

### 1:00 – 1:30 — The Feature: A Deterministic Allocation Solver (Not an LLM)
*(Visual: Show the allocation architecture / solver logic on `/demo` or clean diagram on `/limitations`)*

> "The core feature I built is the **Deterministic Constraint Allocation Solver**.  
> In hackathons today, the default instinct is to wrap a chatbot around the problem. But when someone's safety and comfort on a night train are at stake, you cannot rely on an AI's hallucination or probabilistic guess.  
> We built a deterministic bipartite constraint solver. It balances gender preference, journey overlaps, and senior citizen quotas mathematically. The language model only exists to explain the outcome in plain, human language."

---

### 1:30 – 1:50 — Why It Matters & What Makes Our Approach Unique
*(Visual: Show the rules table / gazette citation)*

> "Why hasn't this been built by apps like ixigo or ConfirmTkt?  
> Because they can't. Berth allocation sits deep inside CRIS. You can't solve this with a third-party wrapper; it has to be designed as a native system rule.  
> Second, we decoupled the policy: **Rules as Data**. Fare rules and pairing logic are dynamic tables citing official Railway Board circulars. When policy evolves, an official updates a row—nobody redeploys the codebase."

---

### 1:50 – 1:55 — The Close
*(Visual: Clean close on the Berth Right interface with tagline)*

> "Berth Right isn't about making rigid guarantees. It's about dignity, predictability, and no sudden surprises in the dark.  
> One rule the reservation system doesn't have yet."

---

## 🎙️ Spoken Word Cadence & Meter Check
* **Total Word Count:** ~245 words
* **Pacing:** ~125 words per minute (relaxed, conversational pace with room for deliberate pauses)
* **Target Runtime:** 1:52 (comfortably within the 2:00 cutoff)
* **Key Vocal Inflections:**
  * At **0:04**: Drop voice slightly on *"in the middle of the night... on a moving train."* Let the weight land.
  * At **0:18**: Stress *"transparency"* and *"sudden surprise"*.
  * At **1:05**: Emphasize *"Solver, not a model"*—judges love hearing why AI wasn't used where it shouldn't be.
  * At **1:52**: Warm, firm finish on *"dignity, predictability, and no sudden surprises."*

