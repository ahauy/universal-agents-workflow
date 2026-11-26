# Lean dev-to-production lifecycle

Status: Implemented; verification evidence is recorded in the acceptance report.
Last updated: 2026-11-26

UAW retains 50 skills (9 hot/41 cold). Release work reuses existing planning, review, documentation and verification owners; ordinary Fast/Full tasks keep their own gates.

| Outcome | Meaning |
| --- | --- |
| DEV_COMPLETE | Selected feature AC, required checks/review and lane docs are complete |
| RELEASE_READY | Applicable required checks pass for the selected candidate/target/config |
| PRODUCTION_VERIFIED | Authorized deployment occurred and actual required post-deploy checks passed |

Read only the relevant [production lifecycle](../../../.agents/docs/production-lifecycle.md) section. A push does not deploy, and framework approval does not authorize production writes. Missing/failed/skipped required evidence blocks readiness or verification. N/A requires an applicability reason; reuse evidence only while candidate/environment/config validity remains. Failed deployment/smoke records FAILED; ROLLED_BACK requires confirmed prior serving/data restoration and verification.

## Two document types

Use [operations-template.md](../../../.specify/templates/operations-template.md) to create docs/OPERATIONS.md only when needed and missing. It captures actual procedures, responsibility, configuration/secret references, health checks and applicable recovery. Preserve existing custom sections. Never place secret values in docs.

Use [release-template.md](../../../.specify/templates/release-template.md) for docs/releases/<version>.md per selected release. Record candidate/target, scope/AC, readiness evidence, matching authorization, actual execution/verification and recovery outcomes. Append attempts without rewriting failed history. Do not create release paperwork per task or invent CI/CD commands, hosts or thresholds.

Text user guides stay optional/on request or release need; no screenshot workflow is restored. Existing wizard is used only for an actual authorized manual procedure. No new skill, runtime, dependency, vendor pipeline or live deployment is included.

## Evidence and limits

[Acceptance report](../../../.specify/features/lean-production-lifecycle/acceptance-report.md), [test plan](../../../.specify/features/lean-production-lifecycle/test-plan.md) and [manual scenario matrix](../../../.specify/features/lean-production-lifecycle/implementation/scenario-review.md) separate source/integration tests from real production execution. The protocol is an agent-followed evidence contract, not an executable deployment state machine. CI/CD/UAT/monitoring/restore validation must be completed for the actual target product before claiming production readiness.
