---
invocation: model
name: spec-writer
description: >
  Use for Full-lane work once elicitation, domain modeling, and
  the consistency scan are complete. Compiles the accumulated business analysis
  into ONE consolidated requirements.md with four sections (business context,
  product behaviour, requirements, user stories), assigning REQ-/US- IDs so every
  requirement traces back to a business goal. Optionally renders per-audience
  exports (BRD / PRD / SRS / user stories) from that single source. Trigger this
  whenever the user says "write the spec", "turn this into a spec", "write user
  stories for this", or once the consistency scan's exit checklist is fully green.
  Do not write requirements directly from a raw request — this skill assumes the
  upstream BA stages already ran.
metadata:
  stage: "BA Pipeline — Stage 5 of 6"
  phase: "Phase 2: Specification"
  model_recommendation: "Standard thinking sufficient — structured document assembly from upstream artifacts"
  prev_skill: "risk-contradiction-scanner"
  next_skill: "spec-validator"
---

# Spec Writer

Reuse confirmed answers, existing requirements and signed-off evidence within the
current scope. Ask only material gaps; no fixed total interview count and no
invented business defaults. Fast uses the checkpoint in AGENTS.md in one context;
these Full-lane artifacts do not exempt any request from understanding behavior.


Phase 2, Stage 5. This is the first stage whose output looks like a traditional
deliverable — but it's still assembly, not authorship: every sentence should trace
back to something already decided in `01-elicitation.md`, `03-domain-model.md`, or
`04-risk-register.md`. If you find yourself inventing a requirement here, stop and
send it back to `elicitation-interview` instead.

## 0. Naming: `requirements.md` ≠ `spec.md`

Two different artifacts share the word "spec". Keep them apart:

| Artifact | Answers | Owner | Path |
| --- | --- | --- | --- |
| `requirements.md` | **What** and **why** | This skill (BA, Phase 1) | `.specify/features/<slug>/requirements.md` |
| `spec.md` | **How** — DTOs, contracts, schema | `technical-spec` (Phase 2) | `.specify/features/<slug>/spec.md` |

Never write to `spec.md` from this skill. That file belongs to the technical phase
and is generated downstream from the baseline.

## 1. One file, four sections

Earlier versions of this skill produced up to four separate documents (BRD, PRD,
SRS, user stories) from a single domain model. That was pure duplication: the same
content re-expressed for four imagined audiences, then re-read by every downstream
agent. Author **one** `requirements.md` with four sections instead.

| Section | Answers | Written for |
| --- | --- | --- |
| 1. Business context | Why, for whom, what is out of scope | Leadership / product owner |
| 2. Product behaviour | How it works: flows, states, edge cases, MoSCoW | Product / design |
| 3. Requirements | `REQ-<SLUG>-###`, precise and testable | Dev / QA / architect |
| 4. User stories | `US-<SLUG>-###`, Given-When-Then | Dev / QA |

A narrow Full-lane scope can keep sections 1–2 concise. Never produce more than these four
sections; a fifth section means the scope is too broad — split the feature.

## 2. Section 1 — Business context

Problem statement, target personas, success metrics, MoSCoW summary. No technical
detail. Pull from `01-elicitation.md` (problem & value) and the MoSCoW table in
`04-risk-register.md`.

## 3. Section 2 — Product behaviour

TO-BE experience from `03-domain-model.md` (gap analysis lives inside that file —
there is no separate `02-gap-analysis.md`), UX states from `03-domain-model.md` §6,
and scope boundaries. State the **Won't-Have** list explicitly; a scope without a
stated Won't-Have is not locked.

## 4. Section 3 — Requirements

```markdown
### REQ-<SLUG>-001: <precise, testable statement>
**Category**: <Gamification | Billing | Auth | ...>
**Priority**: Must-Have | Should-Have | Could-Have
**Status**: Draft
**Description**: <one unambiguous statement>
**Derived from**: BR-<SLUG>-004, ASM-<SLUG>-002
**Business Rules**: BR-<SLUG>-004
**Non-Functional Requirements**: <performance / security if applicable>
**Dependencies**: <other REQ IDs, if any>
```

Every `REQ-` must cite the `BR-`/`ASM-` it came from in **Derived from**. That line
is what makes `spec-validator`'s traceability check possible.

## 5. Section 4 — User stories

```markdown
### US-<SLUG>-001: <Title>
**As a** <role>
**I want to** <action>
**So that** <business value>
**Traces to**: REQ-<SLUG>-001

**Acceptance Criteria**:
- **Scenario 1 (happy path)**
  - Given <precondition>
  - When <action>
  - Then <expected result>
- **Scenario 2 (edge case)**
  - Given <precondition>
  - When <abnormal action>
  - Then <graceful handling>
```

Pull edge-case scenarios directly from `03-domain-model.md` §4 (workflows & edge
cases). Every edge case documented there must appear as Scenario 2+ somewhere.

## 6. Render per-audience exports — only when a real audience exists

The four sections map 1:1 onto the four classic documents, so splitting is a
**rendering** step, not a writing step. Default: do not render. Render only when at
least one of these holds:

- an external party reads the document (client, auditor, vendor);
- each artifact needs its **own signature** (PO signs BRD, architect signs SRS);
- the document is imported into a requirements tool (Jira, DOORS, Polarion);
- a contract, regulation, or standard names the document explicitly.

If none holds, stop here — extra files with no distinct reader are maintenance debt.

When rendering, write to `.specify/features/<slug>/exports/`:

| Export | Built from |
| --- | --- |
| `exports/BRD.md` | §1 (+ MoSCoW summary) |
| `exports/PRD.md` | §1 + §2 |
| `exports/SRS.md` | §3 |
| `exports/user-stories.md` | §4 |

Every export starts with this header, verbatim:

```markdown
<!-- GENERATED FROM ../requirements.md — DO NOT EDIT BY HAND.
     Edit requirements.md and re-render. Hand edits here are lost on the next
     render and will silently diverge from the source. -->
```

Rules for exports:

1. **Regenerate wholesale.** Overwrite the file; never patch an export.
2. **Never let an export carry content the source lacks.** If a reader needs
   something not in `requirements.md`, add it to the source first.
3. **Framing may change, facts may not.** You may drop internal detail from BRD or
   reorder for the audience, but any `REQ-`/`US-` id must match the source exactly.
4. **One-way flow.** Export → never import. Feedback from an export goes back into
   `requirements.md`.

## 7. Compile the baseline

Once `requirements.md` is written, compile the **Domain Decision Baseline** into
`baseline.md` (still `Status: DRAFT` — only `handover` marks it signed off):

1. Business summary & problem statement
2. Approved domain model summary — RBAC, states, rules (link to
   `03-domain-model.md`, do not duplicate)
3. MoSCoW table (link to `04-risk-register.md`)
4. Link to `requirements.md` (the single source), plus `exports/` if rendered
5. Open risks accepted rather than mitigated (from `04-risk-register.md`)

## 8. Hand off

Proceed to `spec-validator`. Append one line to `CHANGELOG.md`.

## Exit checklist

- [ ] Exactly one `requirements.md` exists, with no more than four sections
- [ ] `spec.md` was **not** touched — that file belongs to `technical-spec`
- [ ] Every REQ has a **Derived from** line citing an upstream `BR-`/`ASM-` item —
      none invented fresh at this stage
- [ ] Every user story has both a happy-path and an edge-case scenario
- [ ] Every edge case from `03-domain-model.md` §4 appears in at least one story
- [ ] Won't-Have list is explicit
- [ ] Exports rendered **only** if a split condition in §6 was met, each carrying
      the generated-file header
- [ ] `baseline.md` compiled (still DRAFT), `CHANGELOG.md` updated
