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
  is required by the approved scope, invoke the text-only `user-guide` through
  `.agents/SKILLS.md`; guide production requires no browser capture or app startup. Ask only for a still-missing material
  decision or required authorization; do not repeat an answered confirmation.
- Append completion evidence to the feature `CHANGELOG.md`; update the requested
  roadmap story only after all applicable gates pass.

## Release verification (selected releases only)

Feature checks above establish **DEV_COMPLETE** for the selected scope, not a
production claim. A commit or successful push does not establish release readiness
or deployment. Ordinary Fast/Full task completion needs no release record.

When a release is explicitly selected, read only the needed section of the
[production lifecycle](../../../docs/production-lifecycle.md#readiness):

- **RELEASE_READY**: verify the candidate revision/artifact, target environment
  and configuration against applicable build/test/CI, staging or evidenced
  alternative, UAT/AC, config/secrets references, owner and operational checks.
  Required failed, missing or skipped evidence blocks readiness. N/A needs a
  concrete applicability reason. Zero unresolved Critical; fix High findings or
  obtain explicit owner acceptance. Reuse evidence only for the same candidate,
  environment and config with no invalidating changes.
- Before any real deployment, follow [deployment](../../../docs/production-lifecycle.md#deployment).
  Check matching explicit operational authorization; reuse it when already given.
  Approval of this framework or a plan does not authorize production writes.
  Unknown commands, hosting or material choices remain ASM-/BLOCKED.
- **PRODUCTION_VERIFIED** requires an actual authorized deployment and passing
  [post-deploy verification](../../../docs/production-lifecycle.md#verification)
  for that candidate/target: applicable smoke, health, logs and alert checks.
  Record real evidence; an unexecuted check is not a pass. Failed required
  post-deploy checks mean FAILED, never a verified candidate.
- Use [recovery](../../../docs/production-lifecycle.md#recovery) when needed.
  Account for actual schema/data compatibility and backup/restore evidence;
  never assume code rollback reverses data changes. Only verified recovery earns
  ROLLED_BACK; it does not verify the failed candidate.

Record selected release evidence in `docs/releases/<version>.md`, based on the
[release template](../../../../.specify/templates/release-template.md). Reuse
`docs/OPERATIONS.md` for stable procedures. Preserve existing custom content and
assets; store secret names/references only, never values. Report BLOCKED rather
than inventing commands or evidence. Keep release checks outside ordinary tasks.

## Completion report (both lanes)

Report the selected lane, acceptance outcome, executed checks/results, review
findings and material limitations. Full also reports approval, traceability and
documentation gates. Feature verdict: COMPLETE or INCOMPLETE with the concrete reason; when a release
was selected, also state its separate lifecycle status and candidate/target evidence.
Do not commit, push or merge without explicit user authorization.
