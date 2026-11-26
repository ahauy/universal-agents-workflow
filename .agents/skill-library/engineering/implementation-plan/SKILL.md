---
name: implementation-plan
description: Plan scoped UAW implementation from signed-off baseline and technical spec; define files, dependencies, risks and verification.
metadata:
  origin: universal-agents-workflow
  plane: engineering
---

# Implementation plan

Full-lane Step 3 only. Require a SIGNED-OFF baseline.md and an existing spec.md in .specify/features/<slug>/. If either is absent, stop and route to the corresponding BA or technical-spec step. Use context-pack.md to limit reads, then inspect only relevant source and requirement sections. Reuse confirmed decisions; unresolved business behavior returns to BA as ASM- ids.

Write plan.md using .specify/templates/plan-template.md. Map REQ- ids to exact file families and component changes, identify dependency order and independently deliverable slices, and state validation commands and observable outcomes. Plan risk, migration/rollback and compatibility only where applicable. Prefer existing code, native facilities and installed dependencies; do not add a new runtime or mandatory research/data-model/contracts artifacts without a concrete need.

If release or operational work is selected, use [production preparation](../../../docs/production-lifecycle.md#preparation) and the relevant readiness/recovery sections to plan actual checks, deployment prerequisites and recovery ownership. Separate development delivery from release readiness and production verification; include staging or an evidenced alternative, applicable UAT/config/secrets and migration/backup checks. Name the candidate/target evidence to collect and reuse. Missing commands or hosting remain unresolved, not invented defaults. Do not require release artifacts on unrelated tasks or treat plan approval as production permission.

Record consequential architecture choices as proposed ADRs where needed; preserve accepted ADRs and signed-off business artifacts. Describe limitations and the evidence required to resolve them instead of inventing defaults. Plan does not authorize Git writes, deployment, or external mutations.

Hand off to task-breakdown with scoped files and verification boundaries. Gate 2 requires user approval of both plan.md and tasks.md before scaffold or implementation; drafting a plan alone never grants that approval.
