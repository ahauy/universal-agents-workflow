# 0004. BA-first UAW with native technical planning

- **Date:** 2026-11-26
- **Status:** ACCEPTED
- **Approval:** Owner approved ba-first-workflow baseline v1.0 and Gate 2 plan/tasks.
- **Related:** [0003: Download-only distribution](0003-download-only-distribution.md).

## Context

The owner approved UAW as the core workflow and BA checkpoints for implementation
requests. Parallel upstream planning/runtime instructions caused artifact ownership
and gate conflicts. Approved intent is in
[requirements.md](../.specify/features/ba-first-workflow/requirements.md).

## Decision

Every implementation request establishes intent, evidence, material unknowns and
observable acceptance expectations. Fast stays concise in one context for confirmed
bounded behavior; Full handles existing risk triggers and new/unresolved business
behavior (T7). Reuse confirmed evidence. Roadmap stories receive the same checks.

requirements.md owns business intent. After a signed-off Full baseline,
technical-spec, implementation-plan and task-breakdown own spec.md, plan.md and
tasks.md under .specify/features/<slug>/. Business consistency is checked before
baseline sign-off; technical-consistency-review runs only after its artifacts exist.
Gate 2 still requires plan + tasks approval before implementation.

Keep the four native skills cold and the hot entry set stable. Retire upstream
executable workflow registration and runtime instructions. Preserve ten legacy
speckit-* entry paths as migration stubs, third-party provenance, modified customer
files and signed-off history. This is not authorization for destructive cleanup,
policy rewriting, issue export, Git writes or a new runtime.

## Consequences

One file-based planning flow replaces competing command systems. Existing projects
can migrate on demand through retained paths; updates still protect local changes.
Fast avoids Full artifacts and delegation, while Full retains scoped context packs,
review and approval gates. Structural and semantic checks supply evidence, not a
guarantee of future agent behavior or monetary savings. Accepted historical ADRs
remain immutable; this decision complements download-only distribution.
