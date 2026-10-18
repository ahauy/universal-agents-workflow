---
invocation: user
name: intake-classifier
description: >
  MANDATORY first step whenever a new feature, user story, bug-driven
  change, or business request is raised — before any elicitation, design, spec,
  or code. Classifies the request's complexity (Micro-Task / Spike / Bounded Task / Full
  Feature) using measurable criteria, selects the right depth of the
  BA Pipeline, and creates the feature working folder if required. Trigger this whenever
  the user says things like "add a feature", "we need to support...", "can we
  change how X works", "new user story", "fix this bug", or describes a product change of any
  size. Do not skip straight to elicitation-interview, domain-modeling, or code without running
  this classification first.
metadata:
  stage: "BA Pipeline — Stage 1 of 8"
  phase: "Phase 1: Business Analysis"
  model_recommendation: "Extended thinking preferred (Claude Sonnet Thinking / Gemini Flash Thinking)"
  next_skill: "elicitation-interview"
---

# Intake Classifier

Stage 0 of the Universal Business Analysis Pipeline. This skill's only job is to
answer two questions before anyone writes a single requirement or code file: **how big is
this, really**, and **which protocol does that size call for**. Getting this
wrong in either direction wastes effort — over-classifying turns a one-field
tweak into days of ceremony; under-classifying lets a cross-cutting
change sneak through without RBAC, migration, or contradiction review.

---

## 1. Classify

Ask yourself these measurable questions about the request. Don't classify on
vibes — count.

| Signal                                   | Tier 1: Fast-Track / Fix  | Spike          | Tier 2: Lean Task / US (Roadmap) | Tier 3: Full Feature / Epic |
| :--------------------------------------- | :------------------------ | :------------- | :------------------------------- | :-------------------------- |
| **New/changed domain entities**          | 0                         | 0              | 0–1 (additive field/query)       | 2+ (core structural change) |
| **Existing DB schema change**            | No                        | No             | Minor additive (nullable/enum)   | Structural / breaking       |
| **Screens/flows touched**                | 0–1 (minor tweak/fix)     | 0 (research)   | 1 existing flow                  | 2+ new flows                |
| **User roles affected**                  | 0–1                       | N/A            | 1                                | 2+ (cross-cutting RBAC)     |
| **Cross-cutting impact (auth, billing)** | No                        | No             | No                               | Often                       |
| **Estimated code lines changed**         | < 80 lines                | 0 (pure notes) | 80–250 lines                     | 250+ lines                  |
| **Acceptance Criteria status**           | Pre-defined in issue/chat | N/A            | Documented in Roadmap / Backlog  | Undefined / Exploratory     |
| **Reversible without user impact**       | Yes                       | N/A            | Yes                              | Complex migration needed    |

### Definitions:

- **Tier 1: Fast-Track / Micro-Task**: Surgical bug fixes, UI styling adjustments, single config tweaks, or simple utilities under 80 lines with zero domain ambiguity.
- **Spike / Feasibility**: Technical exploration or "is this feasible" research question. No permanent product code.
- **Tier 2: Lean Task / Standard User Story**: Well-scoped User Story from `PRODUCT_BACKLOG_ROADMAP.md` or a standard feature task (80–250 lines) with defined Acceptance Criteria. **Bypasses 8-stage BA ceremony to save 75% tokens.**
- **Tier 3: Full Feature / Epic**: Brand-new system domain, complex multi-entity relationships, cross-cutting auth/billing architecture, or undefined product initiatives (> 250 lines).

---

## 2. Select the Protocol (3-Tier Speed Lanes)

| Classification                      | Required Protocol & Execution Flow                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Token & Speed Target              |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **Tier 1: Fast-Track / Micro-Task** | **Zero-Ceremony Direct TDD**:<br>1. Inspect code & write failing test.<br>2. Implement surgical fix.<br>3. Verify test passes.<br>4. Single Conventional Commit.<br>_(Bypasses `.specify/features/<slug>/` folder entirely)._                                                                                                                                                                                                                                                                              | ⏱️ 2–3 mins<br>💰 ~15k tokens     |
| **Spike**                           | Short technical summary + trade-off note. Pipeline stops here — do not create a feature folder, do not proceed to spec or coding.                                                                                                                                                                                                                                                                                                                                                                          | ⏱️ 3–5 mins<br>💰 ~20k tokens     |
| **Tier 2: Lean Task / Roadmap US**  | **Roadmap-Driven Lean Flow (Zero BA Duplication)**:<br>1. Read existing AC directly from `PRODUCT_BACKLOG_ROADMAP.md`.<br>2. Generate lightweight `test-plan.md` (map AC to test cases) + optional 1-page `implementation-plan.md` if DB/API changes.<br>3. Jump straight to **Phase 5 (TDD Implementation)**.<br>4. Run single-pass `code-reviewer` (governed by 4 stopping rules).<br>5. Mark US as `[x]` in roadmap.<br>_(Bypasses all 8 BA markdown files `00` through `07` and Speckit duplication)._ | ⏱️ 5–8 mins<br>💰 ~50k–70k tokens |
| **Tier 3: Full Feature / Epic**     | **Full Enterprise BA & Architecture Pipeline**:<br>1. 8-Stage BA Pipeline (`00` to `07` files + `baseline.md`).<br>2. Speckit Technical Planning (`spec.md`, `plan.md`, `tasks.md`).<br>3. Full implementation orchestrator with vertical slices.<br>4. Adversarial reviews + technical docs + user guide.                                                                                                                                                                                                 | ⏱️ 20+ mins<br>💰 ~200k+ tokens   |

> **🛑 ROADMAP-DRIVEN EXECUTION BYPASS RULE (MANDATORY):**
> When working on a User Story from `docs/PRODUCT_BACKLOG_ROADMAP.md` that is NOT marked with `[!]` (Blocked):
>
> - If `Effort` is `S` $\rightarrow$ ALWAYS route to **Tier 1: Fast-Track**.
> - If `Effort` is `M` $\rightarrow$ ALWAYS route to **Tier 2: Lean Task**.
> - NEVER force an already-defined roadmap User Story through the 8-stage BA ceremony unless the user explicitly requests an enterprise re-elicitation.

State the classification and protocol out loud to the user before proceeding:

> This looks like a **[Tier 1 Fast-Track | Tier 2 Lean Task | Tier 3 Full Feature]**. Executing the optimized protocol to ensure maximum speed and token efficiency.

If the user disagrees with the classification, defer to them but log the override in `00-intake.md`.

---

## 3. Initialize the Feature Folder (Bounded Task and Full Feature only)

Pick a short kebab-case `<feature-slug>` from the request (e.g. `user-avatar-upload`). Create:

```
.specify/features/<feature-slug>/
├── 00-intake.md
├── baseline.md
└── CHANGELOG.md
```

**`00-intake.md` template:**

```markdown
# Intake: <Feature Title>

- **Date**: <date>
- **Requested by**: <persona/stakeholder if known>
- **Classification**: Micro-Task | Spike | Bounded Task | Full Feature
- **Classification signals**: <counts from the table above>
- **Protocol selected**: <stage list this feature will run>
- **Override**: <none | user overrode classification from X to Y, reason: ...>

## One-line problem statement

<one sentence — expanded properly in elicitation-interview Stage 1>
```

**`baseline.md` template:**

```markdown
# Domain Decision Baseline: <Feature Title>

**Status**: DRAFT
**Version**: 0.1-draft

This document is compiled incrementally by every stage of the Universal BA
Pipeline. Do not hand-edit sections owned by another skill.

## Stage 0 — Intake

See `00-intake.md`.
```

**`CHANGELOG.md` template:**

```markdown
# Changelog: <Feature Title>

- v0.1-draft — <date> — Feature folder created by intake-classifier. Classified as <X>.
```

---

## 4. Hand off

- **Micro-Task / Fast-Fix** → proceed directly to reproduction, test, and surgical fix.
- **Spike** → answer directly in this turn.
- **Bounded Task / Full Feature** → inform the user and proceed to `elicitation-interview`.

---

## Exit Checklist

- [ ] Classification stated out loud with supporting signals
- [ ] Protocol selected and stage list is unambiguous
- [ ] For Micro-Task & Spike: no feature folder created, zero ceremonial overhead
- [ ] For Bounded/Full: feature folder created with `00-intake.md`, `baseline.md`, `CHANGELOG.md`
