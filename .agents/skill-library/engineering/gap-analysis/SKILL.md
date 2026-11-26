---
invocation: model
name: gap-analysis
description: >
  Use for Full-lane work, after elicitation-interview has
  captured business value and the 6 pillars. Documents AS-IS (current system
  or manual workaround), TO-BE (target end-to-end experience), and the
  functional/data/user-impact/transition gaps between them. Trigger this
  whenever a Full-lane baseline is being built, whenever the user
  describes how something works "today" vs how they want it to work, or
  whenever a change could break or migrate existing user data or workflows.
  Skipped when the intake records no meaningful AS-IS delta.
metadata:
  stage: "Full lane — baseline stage 2b-pre (when a delta exists)"
  phase: "Phase 1: Business Analysis"
  model_recommendation: "Extended thinking preferred — requires self-directed code/schema inspection and gap reasoning"
  prev_skill: "elicitation-interview"
  next_skill: "domain-modeling"
---

# Gap Analysis

Reuse confirmed answers, existing requirements and signed-off evidence within the
current scope. Ask only material gaps; no fixed total interview count and no
invented business defaults. Fast uses the checkpoint in AGENTS.md in one context;
these Full-lane artifacts do not exempt any request from understanding behavior.


Full lane, when a real AS-IS/TO-BE delta exists — check
`00-intake.md` before starting; if it records no meaningful delta, skip
straight to `domain-modeling` and don't invoke this skill at all.

The purpose here is narrow but easy to skip past: don't just describe the
new feature — describe the *delta*, including what breaks, what migrates,
and who has to be told.

## 1. AS-IS — current state

Read `01-elicitation.md` for what the user has already said. If there's
existing code, database schema, or documentation to inspect, do that
investigation yourself (document/code analysis) rather than asking the user
to describe their own system from memory — bring findings back, don't just
ask more questions.

- How does the system or user handle this scenario today?
- What are the current limitations, bottlenecks, or manual workarounds?
- If nothing exists today, say so explicitly — "AS-IS: no equivalent
  functionality" is a valid and important answer.

## 2. TO-BE — target state

- What is the ideal end-to-end user experience once this ships?
- What does the system do differently from AS-IS, concretely?

## 3. Gap analysis

Break the gap into four categories — the fourth is easy to forget and
causes the most downstream pain when skipped:

- **Functional gaps** — new domain logic, new user interactions required.
- **Data gaps** — schema changes, new tables/columns, backward-compatibility
  handling for existing records.
- **User impact** — will existing user workflows change? Do users need a
  migration notice, a one-time modal, re-onboarding?
- **Transition requirements** — requirements that exist *only* during the
  changeover, not in the final TO-BE state:
  - Data migration scripts and their rollback plan
  - Whether old and new behavior must run in parallel for a period
    (dual-run), and for how long
  - User communication/training needed before or at launch
  - Any feature flag or staged-rollout plan

## 4. Record

Append an `## AS-IS / TO-BE / GAP` section to `03-domain-model.md`. Gap analysis is
part of domain modeling now — there is no separate `02-gap-analysis.md` file.

```markdown
# Gap Analysis: <Feature Title>

## AS-IS
...

## TO-BE
...

## Functional gaps
- ...

## Data gaps
- ...

## User impact
- ...

## Transition requirements
- ...
```

Append a short pointer to this section's summary under `baseline.md` — don't
duplicate the full content, link to it.

## 5. Hand off

Continue within `domain-modeling`: it reads `01-elicitation.md` and appends the gap
section to `03-domain-model.md`. Append one line to `CHANGELOG.md`.

## Exit checklist

- [ ] AS-IS documented (or explicitly "none")
- [ ] TO-BE documented as the concrete end-to-end experience
- [ ] All four gap categories addressed, including Transition requirements
- [ ] Data gaps specifically checked against existing schema, not assumed
- [ ] `03-domain-model.md` gap section, `baseline.md`, `CHANGELOG.md` updated
