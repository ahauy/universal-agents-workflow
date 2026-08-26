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

| Signal                                   | Micro-Task / Fast-Fix | Spike          | Bounded Task     | Full Feature        |
| :--------------------------------------- | :-------------------- | :------------- | :--------------- | :------------------ |
| **New/changed domain entities**          | 0                     | 0              | 0–1              | 2+                  |
| **Existing DB schema change**            | No                    | No             | Maybe (additive) | Likely (structural) |
| **Screens/flows touched**                | 0–1 (minor tweak/fix) | 0 (research)   | 1                | 2+                  |
| **User roles affected**                  | 0–1                   | N/A            | 1                | 2+                  |
| **Cross-cutting impact (auth, billing)** | No                    | No             | No               | Often               |
| **Estimated code lines changed**         | < 30 lines            | 0 (pure notes) | 30–200 lines     | 200+ lines          |
| **Reversible without user impact**       | Yes                   | N/A            | Yes              | Not always          |

### Definitions:

- **Micro-Task / Fast-Fix**: A surgically isolated bug fix, typo, single config value adjustment, or minor cosmetic tweak under 30 lines with zero domain ambiguity.
- **Spike / Feasibility**: A technical exploration or "is this feasible" research question. No permanent product commitment.
- **Bounded Task**: A well-scoped change to an existing flow (add a field, adjust validation threshold).
- **Full Feature / Epic**: A brand-new user flow, new domain entity, cross-cutting change, or multi-role feature.

---

## 2. Select the Protocol

| Classification            | Required Protocol & Execution Flow                                                                                                                                                                                                                                                                     |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Micro-Task / Fast-Fix** | **Fast-Track Bypass (Zero Overhead)**:<br>1. Reproduce / inspect defect.<br>2. Write failing test or verification assertion.<br>3. Surgical fix.<br>4. Run verification command.<br>5. Single-line Conventional Commit.<br>_(Pipeline stops here — do NOT create `.specify/features/<slug>/` folder)._ |
| **Spike**                 | Short technical summary + trade-off note. **Pipeline stops here** — do not create a feature folder, do not proceed to `elicitation-interview`.                                                                                                                                                         |
| **Bounded Task**          | Rapid interview (2–3 targeted questions via `grilling`), then stages 4, 5 (light), 6 (User Story only), 7, 8. Stage 3 (`gap-analysis`) is skipped.                                                                                                                                                     |
| **Full Feature**          | Full pipeline, stages 1–8, all at full depth.                                                                                                                                                                                                                                                          |

State the classification and protocol out loud to the user before proceeding:

> This looks like a **Bounded Task** (1 entity touched, 1 flow affected). I'll run the lightweight BA pipeline with a 2-question interview.

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
