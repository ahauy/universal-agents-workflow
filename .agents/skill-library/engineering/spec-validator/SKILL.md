---
invocation: model
name: spec-validator
description: >
  Use for Full-lane work immediately after
  spec-writer produces its documents. Checks every requirement and user story
  against the ISO/IEC/IEEE 29148 quality criteria (necessary, unambiguous,
  complete, singular, feasible, verifiable, consistent, traceable) and builds
  the requirement traceability matrix (business goal → requirement → user
  story → acceptance criteria). Trigger this whenever a spec document set
  exists but hasn't been validated yet, or whenever the user asks to "review
  the spec" or "check these requirements." On failure this sends the spec
  back to spec-writer for revision — never silently accept a spec with
  structural blockers. Proceed to handover only on a clean pass or explicitly
  accepted non-blocking qualitative gaps, logged separately from PASS.
metadata:
  stage: "BA Pipeline — Stage 6 of 6"
  phase: "Phase 2: Specification — Quality Gate"
  model_recommendation: "Extended thinking preferred — adversarial semantic quality review; must find gaps not just confirm"
  prev_skill: "spec-writer"
  next_skill: "handover (on pass) or spec-writer (on fail)"
---

# Spec Validator

Reuse confirmed answers, existing requirements and signed-off evidence within the
current scope. Ask only material gaps; no fixed total interview count and no
invented business defaults. Fast uses the checkpoint in AGENTS.md in one context;
these Full-lane artifacts do not exempt any request from understanding behavior.


Phase 2, Stage 7 — the pipeline's second and final quality gate, and the
only stage with a loop-back. Its job is adversarial: assume the spec has a
problem and try to find it, rather than skimming for confirmation.

## 0. Resolve scope and prerequisites

Resolve the feature directory supplied by the caller. If no feature is identified
or several directories match, ask which one; do not select an unrelated feature.
Read these required evidence files from that directory:

- `requirements.md` (goals, requirements and user stories)
- `01-elicitation.md` (answers and assumption confirmations)
- `03-domain-model.md` (business rules, constraints and edge cases)
- `04-risk-register.md` (risks, open questions and assumption status)

This is the pre-baseline BA gate: do not require technical `spec.md`, `plan.md`
or `tasks.md`. Missing, unreadable, empty or placeholder-only required evidence
is a **structural blocker**. Record the file, condition and affected checks as
BLOCKED; never substitute an empty string, infer its contents or return PASS.
A heading, template example or TODO without substantive feature evidence does
not satisfy the prerequisite. Continue only the checks supported by available
evidence, and record the blocked checks without claiming full validation.

Inspect assumption records (`ASM-` entries and their status/confirmation context)
in the required evidence. Every assumption must have explicit user confirmation
or a recorded user decision resolving it; pending, unknown or conflicting status
is a structural blocker. Identify the ASM ID and missing or contradictory
evidence. A checked box alone does not prove confirmation, and an unrelated
unchecked task box is not an assumption. Do not invent confirmations or scope
rules; ask the user to resolve unknowns and record them as ASM IDs.

Never patch source evidence inside this validator. Signed-off inputs are
immutable; report failures and return them for the versioned revision process.

## 1. Run the eight-criterion semantic review

For **every** `REQ-` and `US-` item in `requirements.md` §3 (requirements) and §4
(user stories), check:

| Criterion | Fails if... |
|---|---|
| Necessary | Its business purpose is unsupported by a goal and the applicable confirmed `BR-`/`ASM-` evidence |
| Unambiguous | It can reasonably be read two different ways |
| Complete | Implementing it exactly as written still requires guessing something |
| Singular (atomic) | It bundles more than one distinct requirement in one ID |
| Feasible | It conflicts with a known technical or timeline constraint |
| Verifiable | Its linked scenarios cannot demonstrate a testable outcome, including applicable happy paths and edge cases |
| Consistent | It contradicts another `REQ-`/`US-` or a `BR-` from the domain model |
| Traceable | Its ID is missing/duplicated, a REQ **Derived from** link or US **Traces to** link is missing/broken, or linked coverage is inapplicable |

Log every failure with the specific ID and criterion — "REQ-STREAK-003
fails Unambiguous: 'promptly' has no defined time bound" — not a general
impression. Read the meaning of each item against the evidence; the presence
of an ID, heading, keyword or Given/When/Then label is not proof of quality.
This agent review uses ISO/IEC/IEEE 29148 quality criteria as guidance; it is
not an executable certification service or a claim of IEEE certification.

## 2. Build the traceability matrix

```markdown
| Business Goal | REQ/BR | User Story | Acceptance Criteria | Test Case |
|---|---|---|---|---|
| +15% 7-day retention | REQ-STREAK-001 | US-STREAK-001 | Scenario 1, 2 | (assigned at test-design time) |
```

Inventory actual goal, `BR-`, `ASM-`, `REQ-` and `US-` definitions in the
required evidence; references to an ID are not definitions. Require unique IDs
within each item type, and report duplicate definitions with their locations.
Cross-file references to a definition are allowed.

For every REQ, check **Derived from** cites existing upstream BR/ASM definitions
and supports the requirement's meaning. For every US, check **Traces to** cites
existing REQ definitions. Check every referenced BR/REQ/US exists in its expected
role; a dangling or wrong-type link is a structural blocker. Report source and
missing/duplicate target IDs explicitly.

Every row must have an unbroken chain from goal through applicable upstream
evidence and REQ to US and acceptance scenarios. Every REQ needs applicable
story coverage; a US merely listing its ID is insufficient. Every US needs
substantive, testable acceptance scenarios with conditions, action and observable
expected outcome. Cover applicable happy paths and domain edge cases from the
elicitation/domain evidence, recording why any path is inapplicable. Missing
scenarios, uncovered requirements and broken chains are structural blockers;
list the affected REQ/US IDs and missing coverage. Do not invent scenarios or
expected outcomes to fill gaps.

Write `traceability-matrix.md` even on failure: show known links, mark unknown
or blocked cells explicitly and record the evidence file/section for each chain.
A test case may remain assigned at test-design time at this BA stage; acceptance
criteria and their semantic coverage may not.

## 3. Decide: pass or send back

- **All evidence and criteria pass, matrix has no gaps** → record PASS in §4.
- **Any structural blocker** → record FAIL regardless of any requested override.
  Missing/invalid evidence, unresolved assumptions, duplicate/missing IDs,
  broken links, absent acceptance scenarios and uncovered requirements cannot
  become PASS or PASS WITH ACCEPTED GAPS through user acceptance.
- **Other qualitative failure** → record FAIL unless the user explicitly accepts
  that specific non-blocking gap. Record the affected ID, criterion, actual
  acceptance and user's reasoning; then use PASS WITH ACCEPTED GAPS, never PASS.
  Silence or a general approval is not acceptance of a specific finding.

Always write §4, including failures and checks blocked by missing evidence.
For FAIL, return the exact files, IDs and criteria to `spec-writer` for revision;
do not proceed to handover. Re-run the complete review after revision.

## 4. Record

```markdown
# Validation Report: <Feature Title>

**Result**: PASS | FAIL | PASS WITH ACCEPTED GAPS
**Date**: ...
**Iteration**: <n>th pass

## Evidence and structural blockers
| File / ID | Evidence location and condition | Blocker / supported check |
|---|---|---|

## Checklist results
| ID | Criterion | PASS / FAIL / BLOCKED | Evidence and reasoning |
|---|---|---|---|

## Traceability gaps
- ...

## Accepted gaps (if any)
- <ID> — <criterion failed> — accepted because: <user's reasoning>
```

## 5. Hand off

On PASS or PASS WITH ACCEPTED GAPS only, proceed to `handover`, carrying the
recorded result and accepted gaps explicitly. Append one line to `CHANGELOG.md`
without editing signed-off content. On FAIL, retain both output artifacts and
return the findings for revision.

## Exit checklist

- [ ] Required evidence and ASM confirmation status inspected; blockers recorded
- [ ] Every REQ/US semantically checked against all eight criteria, or marked BLOCKED
- [ ] Unique IDs, valid upstream links and applicable scenario coverage checked
- [ ] Structural blockers force FAIL; accepted qualitative gaps remain distinct
- [ ] `validation-report.md` and `traceability-matrix.md` written with evidence
- [ ] FAIL returned for revision; successful handoff and changelog update recorded
