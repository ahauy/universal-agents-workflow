---
invocation: model
name: verification-before-completion
description: >
  Verify completion against the selected Fast or Full lane, acceptance criteria,
  relevant automated checks and zero Critical findings. Full additionally checks
  signed requirements, approved plans, traceability and feature documentation.
  Use before marking a story done or reporting ready to merge.
metadata:
  stage: "Verification Gate"
  model_recommendation: "Standard thinking sufficient — gate verification and report"
---

# Verification Before Completion

Read the selected lane and confirmed acceptance expectations from the current
checkpoint or feature context pack. Reuse evidence already established; do not
create Full artifacts for bounded Fast work. Escalate on any AGENTS.md T1–T7
trigger. A failing check blocks completion; it does not prohibit diagnostic tests.

## Fast lane

1. Confirm the **chat checkpoint** states the outcome, scope, existing evidence,
   material unknowns and observable acceptance expectations. Resolve material
   business decisions before implementation; an unresolved one triggers Full.
2. Verify the change against those expectations with the project's relevant
   tests/checks. Use the existing manifest/config and actual runner. Record the
   commands, exit status and meaningful results; report skips and limitations.
3. Perform a **self-check** for security, spec fidelity and reliability. Zero
   unresolved Critical findings; resolve other blocking findings before closing.
4. Fast requires **no feature folder**, signed baseline, traceability matrix,
   feature README or separate reviewer context. Write `test-plan.md` only for
   more than three test cases. No subagents in Fast.
5. Report the outcome and evidence in chat. Mark the requested roadmap story
   complete only after its acceptance criteria and applicable checks pass.

## Full lane

Use the existing `.specify/features/<slug>/` context pack and scoped sections;
never rewrite signed artifacts in place or repeat an answered interview.

### 1. Confirm implementation gates

- `baseline.md` reads `SIGNED-OFF v1.0` (or the signed superseding version).
- `requirements.md` §4 provides the confirmed acceptance criteria.
- `plan.md` and `tasks.md` have user approval.
- `test-plan.md` covers applicable scenarios and `traceability-matrix.md` records
  the requirement → story → test chain as required by the approved plan.

Missing approvals block implementation/delivery. Tests may still be run to
investigate failures; do not claim those tests establish missing sign-off.

### 2. Run applicable automated checks

Derive commands from this project's manifests, runner configuration and approved
plan, rather than assuming a frontend/backend monorepo or Prisma. Run required
unit, integration and end-to-end checks for affected behavior. Record pass/fail
counts and commands; a nonzero exit or required unrun check blocks completion.
Never claim an unexecuted check passed. Run broader checks when changes or failures
justify them.

### 3. Review fidelity and reliability

- Complete Full dual-pass review: standards/security and spec fidelity; the lean
  pass applies to diffs over 300 lines. Include UI review when applicable.
- Zero unresolved Critical findings. Fix High findings or record explicit owner
  acceptance of each risk; do not silently downgrade them.
- Confirm each applicable acceptance scenario maps to an actual test/check;
  explain skips and uncovered cases. Spot-check requirement → story → test links.
- If schema/migrations changed, verify the actual stack's migration on a clean
  database and document rollback/recovery. Do not invent Prisma commands.
- Document rollback/feature flags only where the actual change needs them;
  report non-applicable checks as N/A.

### 4. Complete Full documentation

- `docs/features/<slug>/README.md` exists and is indexed in
  `docs/features/README.md` (Gate 4).
- Update affected architecture/algorithm documents only when those behaviors
  changed; preserve accepted ADRs and signed requirements.
- For UI, reuse existing authorization and confirmed screen evidence. If a guide
  is required by the approved scope, invoke `user-guide-with-screenshots` through
  `.agents/SKILLS.md` with real screenshots. Ask only for a still-missing material
  decision or required authorization; do not repeat an answered confirmation.
- Append completion evidence to the feature `CHANGELOG.md`; update the requested
  roadmap story only after all applicable gates pass.

## Completion report (both lanes)

Report the selected lane, acceptance outcome, executed checks/results, review
findings and material limitations. Full also reports approval, traceability and
documentation gates. Verdict: COMPLETE or INCOMPLETE with the concrete reason.
Do not commit, push or merge without explicit user authorization.
