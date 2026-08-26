---
invocation: user
name: elicitation-interview
description: >
  Use after intake-classifier has classified a request as a Bounded Task or Full Feature.
  Orchestrates the structured, batched elicitation interview (BABOK/IREB style),
  delegating the deep questioning mechanics to the `grilling` primitive (`.agents/skills/productivity/grilling`).
  Surfaces business value, personas, and the 6 domain pillars (RBAC, state machine,
  business rules, workflows/edge cases, data/privacy, UX/NFR). Never assume a business rule,
  default value, or edge case silently — ask.
metadata:
  stage: "BA Pipeline — Stage 2 of 8"
  phase: "Phase 1: Business Analysis"
  plane: "control (delegates to productivity/grilling)"
  model_recommendation: "Extended thinking preferred — needs multi-turn interview and nuanced judgment"
  prev_skill: "intake-classifier"
  next_skill: "gap-analysis (Full Feature) or domain-modeling (Bounded Task)"
---

# Elicitation Interview

Phase 1, Stage 2. This is the main information-gathering skill in the
pipeline. It reads `00-intake.md` for the protocol depth, then interviews the
user to fill `01-elicitation.md` — the raw material every later stage builds
on. **AI proactively surfaces blind spots; the user makes the business
decisions.** Never fill a gap with a plausible-sounding default without
asking first.

## 1. Read the protocol depth

Open `00-intake.md`. If `Protocol selected` is:

- **Bounded Task** → run only §2 (Business Value, abbreviated) and a targeted
  2–3 question pass on whichever pillars are actually touched. Skip pillars
  that are clearly irrelevant (e.g. no RBAC questions for a copy change).
- **Full Feature** → run §2 in full, then all 6 pillars in §3.

## 2. Stage 1 — Business value (always, but depth varies)

Batch these into one turn (2–3 questions at a time, never more):

1. **Problem & pain point** — what friction or inefficiency does this solve?
   What happens if we don't build it?
2. **Target personas & users** — End users, paying customers, admins, or internal operators — who is this for?
3. **Success metrics** — a primary metric (e.g. "+15% retention", "P95 latency < 150ms") and operational constraints.

## 3. Stage 3 — The 6-Pillar interview (Full Feature only)

> [!TIP]
> **Delegation to `grilling` Primitive:**
> Follow the recursive questioning mechanics from `.agents/skills/productivity/grilling`.
> Frame the request, branch the decision tree, batch 2–3 questions per turn, and never fill in silent assumptions.

For each pillar, ask targeted questions using the standard question format below:

1. **Personas, Actors & RBAC** — Create/View/Edit/Delete/Share per role; ownership rules; guest/unauthenticated constraints.
2. **State Machine & Lifecycle** — states, transition triggers, terminal and rollback/cancellation states.
3. **Business Rules & Algorithms** — validations, limits, formulas, rate limits per user tier.
4. **Workflows & Edge Cases** — happy path; then explicitly probe: offline mode & sync conflicts, concurrency/race conditions, idempotency (double clicks, duplicate transactions), session expiry mid-flow, cancel/abandon cleanup.
5. **Entities, Data Boundaries & Privacy** — entity/attribute/relation sketch; hard vs soft delete + cascade behavior; PII handling; compliance requirements (GDPR, HIPAA, minors).
6. **UX & Non-Functional Requirements** — empty/loading/error/feedback states; performance targets; security needs; **i18n/l10n** (supported languages, RTL); **accessibility** target (e.g. WCAG AA).

### Standard question format

```markdown
**Question <N>: <Subject>**

- **Context & why it matters**: <business/architectural consequence>
- **Proposed options**:
  - **Option A**: <description> — <pros/cons>
  - **Option B**: <description> — <pros/cons>
- **Recommended**: <your recommendation and justification>
```

## 4. Record answers, assumptions & sync `CONTEXT.md`

After each batch of answers, append to `01-elicitation.md` immediately —
don't wait until the interview is "done." Use this structure:

```markdown
## Stage 1 — Business Value

- Problem: ...
- Personas: ...
- Success metrics: ...

## Pillar 1 — Personas, Actors & RBAC

**Q1: <subject>** → **Decision**: <what the user chose> (Option A/B/custom)

## Assumptions confirmed

- ASM-<SLUG>-001: <assumption, and the answer that confirmed or set it>

## Open questions (not yet answered)

- <question> — blocking for: <which pillar/stage>
```

**Sync Shared Language (`CONTEXT.md`)**:

- Whenever the user defines or clarifies a key project term, concept, or abbreviation during elicitation, immediately update `CONTEXT.md` inline so future stages use this exact ubiquitous language.

## 5. Hand off

When all required pillars for this protocol have answers with no blocking
open questions, tell the user you're proceeding to `gap-analysis` (Full
Feature) or directly to `domain-modeling` (Bounded Task, since Stage 3/gap
analysis is skipped). Append one line to `CHANGELOG.md`.

## Exit checklist

- [ ] Stage 1 business value answered (problem, personas, success metric)
- [ ] For Full Feature: all 6 pillars covered with no silent defaults
- [ ] Every assumption the user confirmed has an `ASM-` entry, not just a note in conversation
- [ ] Any new domain terminology synced to `CONTEXT.md`
- [ ] No open question remains that blocks the next stage
- [ ] `01-elicitation.md` and `CHANGELOG.md` updated
