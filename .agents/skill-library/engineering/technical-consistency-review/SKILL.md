---
name: technical-consistency-review
description: Review existing UAW requirements, spec, plan and tasks for traceability and contradictions before Gate 2; read-only.
metadata:
  origin: universal-agents-workflow
  plane: engineering
---

# Technical consistency review

Run read-only after requirements.md, spec.md, plan.md and tasks.md all exist in .specify/features/<slug>/ and the baseline is SIGNED-OFF. If a downstream artifact is missing, report it and route to its authoring step; do not fabricate it or run this review during BA. Pre-baseline business consistency belongs to risk-contradiction-scanner.

Read the context pack then targeted sections. Check BR-/REQ-/US- traceability through design, scoped files, ordered tasks and observable acceptance verification. Identify conflicting contracts/defaults, unsupported architecture, missing boundary validation or failure paths, dependency cycles, overlapping parallel ownership, unaddressed migration risk and hidden business decisions. Compare with project rules and accepted ADRs, not an upstream constitution runtime.

For selected release/operations scope, check the [production lifecycle](../../../docs/production-lifecycle.md#readiness) on demand: separate feature completion, release readiness and actual production evidence; trace applicable CI/UAT/config/migration/recovery checks and authorization boundaries through the plan/tasks. Flag missing candidate/target identity, required skipped or stale evidence, assumed rollback of data and production writes inferred from plan approval. Ordinary feature review does not require release artifacts.

Return findings in chat (or a review artifact only if requested) with severity, evidence path/section, affected ids, consequence and smallest corrective action. Distinguish missing evidence from a demonstrated contradiction. No finding is a substitute for user approval. Critical findings block implementation/delivery; unresolved material business decisions return to BA with ASM- ids. Do not edit artifacts or reinterpret approved intent during this pass.

Report coverage, gaps, remaining questions and recommendation for Gate 2. Gate 2 still requires explicit approval of plan.md + tasks.md; zero findings does not sign them off. This is evidence-based agent review, not executable certification.
