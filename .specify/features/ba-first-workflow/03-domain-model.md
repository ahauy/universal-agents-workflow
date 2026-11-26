# Domain model: BA-first workflow

## AS-IS / TO-BE / GAP

AS-IS: Fast bypasses the domain baseline, roadmap rules contradict escalation,
and copied SpecKit commands disagree with UAW artifacts and lack required scripts.
TO-BE: UAW owns one local-file workflow. Every implementation request first
establishes intent, scope, known business behavior and acceptance evidence.
GAP: align lane selection, native planning skills, roadmap, templates and routers;
retain confirmed decisions and inherited installer/data protection.

## Business rules

- BR-BA-001: Before implementation, understand the requested outcome and affected
  behavior; unresolved implementation-relevant business decisions block code.
- BR-BA-002: Fast uses a concise checkpoint for clear, bounded work without new
  business behavior or risk triggers. Full covers new/unclear business behavior
  and existing escalation triggers. Effort labels alone do not select the lane.
- BR-BA-003: Reuse confirmed requirements/baselines; ask only material unanswered
  questions, in short batches, with no fixed total question count.
- BR-BA-004: Roadmap supplies priority/dependencies and confirmed scope, not an
  exemption from BA or escalation. Stories and AC derive from elicited evidence.
- BR-BA-005: requirements.md owns business intent; UAW spec.md owns technical
  design. Business consistency precedes baseline; technical consistency follows
  spec, plan and tasks. Named workflow skills must exist and have valid inputs.
- BR-BA-006: Core operation is self-contained UAW; no SpecKit runtime/scripts or
  business defaults are silently introduced. Preserve attribution for reused material.
- BR-BA-007: Keep Fast in one context and read skills on demand. Full delegation
  uses scoped context. Avoid duplicate artifacts/interviews and do not claim
  cost savings without actual usage data. Preserve existing lane budget limits.
- BR-BA-008: Preserve part-1/2 safety, accepted history and unrelated work; no
  autonomous Git, publication or additional runtime installation.

## Decision flow

Intake -> inspect existing evidence -> concise business checkpoint -> select lane.
Fast: resolve bounded questions -> minimal plan/TDD -> self-check.
Full: reuse/complete deep BA -> baseline approval -> technical design/plan/tasks
-> technical consistency -> plan/tasks approval -> scoped implementation/review.
Any missing business decision returns to clarification; technical planning does
not invent a decision or repeat already answered interviews.

Roles remain owner and agent. No database, auth system, PII, new service, UI or
data-retention rule is introduced; these pillars are otherwise not applicable.
