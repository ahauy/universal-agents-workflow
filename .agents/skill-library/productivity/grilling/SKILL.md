---
name: grilling
invocation: model
description: >
  The reusable interview primitive. Ask the user detailed, branch-following questions
  about a plan, design, decision, or domain until every branch of the design tree is
  resolved or explicitly accepted as an assumption. Zero-silent-assumption policy:
  if something is unknown or ambiguous, keep asking — never fill it in. This is the
  engine behind `grill-with-docs`, `triage`, `wayfinder`, and `improve-codebase-architecture`.
  Model-invoked when a session needs to reach alignment before writing code, spec, or
  decision, or when the user has just given a vague brief and every downstream step
  depends on getting it right.
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Grilling — Reusable Interview Primitive

## Purpose

The most common failure mode in AI-assisted engineering is **misalignment**: the user
and the agent are not actually talking about the same thing. `grilling` is the shared
interview loop that solves it. It is *not* a user-facing command — it is the engine
that user-invoked wrappers call into.

## Protocol

1. **Frame.** Restate the request in one sentence so the user can correct you early.
2. **Branch.** Map the decision space: what are the sub-questions that MUST be answered
   before any artifact (code, spec, ADR) can be produced without hallucination?
3. **Ask in batches of 2–3.** Each batch should cover one pillar at a time:
   - Business value & pain
   - Roles / RBAC (who can do what)
   - States & transitions (lifecycle, what can go wrong)
   - Rules / formulas (explicit, with edge cases)
   - Workflows & edge cases (happy + unhappy)
   - Data / privacy / observability
   - UX / NFRs
4. **Never assume.** If a branch has no answer, either (a) keep asking, or (b) record it
   as an explicit `ASM-` assumption in `01-elicitation.md` (or the target artifact) with
   a note that it is NOT user-confirmed.
5. **Close the loop.** When every branch has an answer or a labeled assumption, produce
   a compact "decision summary" the user can sign off.

## Output shape

- Interview transcript (question → answer) appended to the feature's elicitation doc.
- Labeled assumptions: `ASM-<feature>-NN: <text>` — never silent.
- A "decision summary" block that downstream skills (`spec-writer`, `domain-modeling`)
  can import.

## Boundaries

- **Do not** invent business rules, defaults, or edge cases.
- **Do not** skip to code, spec, or ADR before the user has signed off on the decision summary.
- **Do** update `CONTEXT.md` inline if new domain terms surfaced during the interview
  (see ADR / shared-language policy in `CONTEXT.md`).
- **Do** record architecture-level decisions as ADRs when they are hard to explain in one line.

## When to use

- Any user-invoked skill that needs an interview: `grill-with-docs`, `triage`, `wayfinder`,
  `improve-codebase-architecture`, `intake-classifier` (Stage 2 of your BA pipeline).
- Any point where a session is about to produce an artifact and the brief is vague.
