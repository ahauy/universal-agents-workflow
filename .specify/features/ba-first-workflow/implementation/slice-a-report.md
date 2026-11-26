# Slice A report — governance, BA and roadmap

Date: 2026-11-26. Source: approved context pack, spec and slice plan.
Requirements: REQ-BA-001..004/007. No Git writes, runtime installs or B-owned
edits. Existing uncommitted changes were edited in place, not reset or replaced.

## Changes

- AGENTS.md defines the six-part BA checkpoint for every implementation request,
  T7 for new/unresolved business behavior, and removes the blanket roadmap bypass.
  Fast remains one context/no feature folder; Full retains approvals, budgets,
  scoped delegation and immutable signed history. Research does not recurse into BA.
- Intake, continuation and backlog commands reuse evidence, keep dependency gates,
  apply T1–T7 regardless of size, and ask only relevant unanswered questions.
  Backlog no longer prescribes six platform questions, a stack, layers or invented
  Won't-Have defaults; stories and AC derive from confirmed business behavior.
- BA persona and eight BA/implementation skills reuse existing decisions, separate
  business consistency from downstream technical consistency, and route planning
  through native skills. Handover requires user sign-off and grants Gate 1 only;
  implementation still requires Gate 2.
- README, six harness pointers, pipeline/walkthrough/reading-map/cheatsheet,
  common rules and token-budget guidance agree with the source contract. Cost
  estimates explicitly differ from actual billing and guaranteed savings.
- Session context hook injects the checkpoint and lane reminder instead of the
  stale Tier 3 gate; its adapter-compatible reminder shape is preserved.

## Executable checks

- `node --check .agents/scripts/hooks/session-context-init.js`: PASS.
- `node .agents/scripts/test/test-hooks.js`: PASS, 21 passed / 0 failed. The first
  run exposed the existing reminder-prefix assertion; preserving `Pipeline: Intake`
  restored compatibility without weakening the new policy. No test was changed.
- `git diff --check` scoped to A-owned paths: PASS.
- Targeted active-source scan: no speckit/SpecKit/consistency-scan, Tier 3,
  Lean Task/Full Feature, fixed six-question or blanket always-Fast wording
  remains in A-owned sources. An empty rg result exits 1 normally.

## Semantic decision-path review (not executable behavioral proof)

These are manual prompt-path reviews against the final instructions, not claims
that a test executed a model or guarantees every future response.

| Case | Representative input and decision path | Evidence / result |
| --- | --- | --- |
| TC-001 | Correct a typo, adjust known config or fix existing behavior; acceptance already clear. Establish outcome/behavior/scope/evidence/unknowns/AC in chat; no trigger means Fast, one context, no Full folder. A resolved minor non-business question adds no Full ceremony. | AGENTS §2; intake §§1–2; continuation Step 2. PASS. |
| TC-002 | A tiny change introduces a cancellation rule, unresolved fee formula or new state behavior. T7 applies regardless of line count; record ASM-, clarify relevant decisions, baseline/Gate 1 then plan/tasks/Gate 2 before code. | AGENTS trigger table; intake §1/T7; BA persona; handover and implementation gates. PASS. |
| TC-003 | Unblocked roadmap S/M story touches auth/PII, breaking schema or a new entity. T3/T2/T4 applies; roadmap label and confirmed AC never bypass the risk gate. | AGENTS roadmap evidence; intake sizing note; continuation Step 2 triggers. PASS. |
| TC-004 | Signed-off evidence answers most domain questions. Read and reuse it; ask only changed/conflicting/material gaps. No compulsory new interview when scope is settled; preserve signed history/version changes. | BA interaction protocol; elicitation evidence preface; AGENTS §2/§5. PASS. |
| TC-005 | User supplies platform/auth/billing preferences but no journeys/rules. Backlog Step 1 elicits goals/actors/journeys/rules/edge behavior/scope and AC before deriving stories. Stack and Won't-Have remain unresolved rather than invented. | generate-backlog §§1–3 and exit checklist. PASS. |
| TC-006 | Story is [!] or a dependency is not [x]. [!] escalates T5 and requires resolving the blocker before implementation; incomplete Depends-on names and retains the dependency gate. Answering a blocker never silently completes its dependency. | continuation Step 1 points 4–5 and Full gate sequence. PASS. |
| TC-007 | Material questions remain after the first short batch. Continue relevant batches with no fixed total count; wait for answers rather than guessing. Existing answers are not requested again. | generate-backlog §1; BA interaction protocol; elicitation evidence preface. PASS. |
| TC-008 | Business evidence exists but technical spec/plan/tasks do not. risk-contradiction-scanner runs business consistency before requirements validation; technical-consistency-review waits for actual spec/plan/tasks. requirements.md remains intent; technical-spec owns how. | AGENTS pipeline/naming; pipeline-detail §§2c/3; scanner final boundary; spec-writer ownership. PASS. |

## Limits and handoff

Coordinator owns generated catalog, integration regressions, installer smoke
checks, final acceptance and independent review. This slice does not claim those
checks passed, monetary savings or absence of every future semantic agent error.
No Critical finding identified in this scoped self-check. Skill-authoring guidance
was read from the system skill-creator SKILL.md; repository layout remains canonical.
