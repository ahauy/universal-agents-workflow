---
name: task-breakdown
description: Create dependency-ordered UAW tasks.md from technical spec and implementation plan, with verification and scoped parallel boundaries.
metadata:
  origin: universal-agents-workflow
  plane: engineering
---

# Task breakdown

Full-lane Step 3 only. Require a SIGNED-OFF baseline.md plus spec.md and plan.md under .specify/features/<slug>/. Report missing prerequisites and stop rather than generating substitutes. Read the context pack and relevant portions of those artifacts; requirements.md remains the source of approved intent.

Write tasks.md using .specify/templates/tasks-template.md. Give each task a stable T id, relevant REQ-/US- ids, exact files or bounded file families, dependencies, deliverable, and observable verification. Include meaningful failing-test-first implementation tasks followed by verification, review and documentation. For prose-only changes use structural and decision-path checks appropriate to their behavior; do not create tests that merely repeat wording.

Mark [P] only for slices with disjoint file ownership and no unresolved output dependency. Shared-file edits serialize. Define each Full-lane slice's context-pack.md scope (at most 150 lines), output path and integration owner. Fast work remains one context and never delegates.

Check coverage from every applicable REQ-/acceptance criterion to a task and verification. Do not create speculative foundation work or automatic commits. Route to technical-consistency-review only after spec.md, plan.md and tasks.md all exist. Present plan + tasks for Gate 2 approval; no scaffold or implementation before approval, and material business gaps return to BA.
