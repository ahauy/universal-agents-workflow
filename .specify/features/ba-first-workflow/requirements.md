# Requirements: BA-first UAW

## 1. Business context

The owner prioritizes correct business understanding while matching analysis
effort to task uncertainty/risk. UAW becomes the core, independent of SpecKit
execution. Success is coherent routing and artifact flow, preservation of safety,
and explicit verification; financial savings remain unproven until measured.

## 2. Product behaviour

Every implementation request first establishes intent, affected behavior and
testable acceptance expectations. Fast remains concise and single-context for
clear technical work; Full covers new/unclear business behavior and risk triggers.
Roadmap and approved baseline evidence are reused rather than treated as bypasses.
Confirmed business intent feeds self-contained UAW technical planning.
Scope exclusions and risks are recorded in 04-risk-register.md.

## 3. Requirements

| ID | Requirement | Derived from |
| --- | --- | --- |
| REQ-BA-001 | All implementation requests require a business-understanding checkpoint; no code with unresolved material business decisions. | BR-BA-001, ASM-BA-002 |
| REQ-BA-002 | Fast/Full selection must agree across governance, intake, roadmap, personas, hooks and adapters, following BR-BA-002 without blanket roadmap bypass. | BR-BA-002, ASM-BA-002 |
| REQ-BA-003 | BA must reuse confirmed evidence, ask material unanswered questions and avoid total question-count caps or invented business defaults. | BR-BA-003, ASM-BA-002 |
| REQ-BA-004 | Backlog stories/AC derive from confirmed domain flows/rules; continuation respects dependencies, blockers and risk escalation. | BR-BA-004, ASM-BA-003 |
| REQ-BA-005 | Native planning separates business intent, technical design, ordered tasks and stage-appropriate consistency checks, using existing local artifacts. | BR-BA-005, ASM-BA-001 |
| REQ-BA-006 | Core skills and referenced names/paths resolve without requiring upstream SpecKit scripts, runtime or contradictory defaults; retained reused material keeps attribution. | BR-BA-006, ASM-BA-001 |
| REQ-BA-007 | Fast incurs no Full artifacts/subagents; Full uses scoped context/on-demand skills and preserves current budgets. Report actual usage limits; do not claim unmeasured savings. | BR-BA-007, ASM-BA-002 |
| REQ-BA-008 | Preserve prior data-protection work, signed-off artifacts/history, unrelated user edits and Git restrictions; document and independently review the change. | BR-BA-008 |

All requirements are Must-Have. Status: owner-approved scope, baseline v1.0.

## 4. User stories

| ID / traces to | User outcome | Happy-path acceptance | Edge-case acceptance |
| --- | --- | --- | --- |
| US-BA-001 / REQ-BA-001 | As owner, have intent understood before implementation. | Given clear intent, when intake runs, then scope/behavior/AC are established before code. | Given an unresolved formula, when code is requested, then ask/record it before implementation. |
| US-BA-002 / REQ-BA-002 | As owner, receive consistent lane decisions. | Given bounded technical work with known behavior and no risk, when selecting a lane, then use Fast. | Given new business behavior or auth/schema risk, when selecting a lane, then use Full even for a small roadmap story. |
| US-BA-003 / REQ-BA-003 | As owner, answer relevant questions once. | Given confirmed evidence, when continuing, then reuse it and ask only material gaps. | Given more unknowns than fit one batch, when interviewing, then continue batches without guessing to satisfy a cap. |
| US-BA-004 / REQ-BA-004 | As owner, get a business-grounded roadmap. | Given confirmed journeys/rules, when generating stories, then AC traces to those decisions. | Given only platform/auth choices or a blocked dependency, when generating/continuing, then resolve gaps instead of inventing stories or bypassing blockers. |
| US-BA-005 / REQ-BA-005 | As owner, see intent carried into technical work. | Given an approved baseline, when planning, then design/contracts, plan and tasks reference it. | Given no plan/tasks yet or conflicting business evidence, when checking consistency, then defer technical analysis or return to BA appropriately. |
| US-BA-006 / REQ-BA-006 | As owner, use self-contained workflow skills. | Given a downloaded UAW tree, when selecting native skills, then named paths exist without SpecKit runtime. | Given an old skill name, when following migration guidance, then reach a UAW path or explicit retirement notice without executing absent scripts. |
| US-BA-007 / REQ-BA-007 | As owner, control avoidable analysis overhead. | Given clear small work, when executing Fast, then use one context and concise evidence, no Full folder. | Given unavailable token/cost measurements, when reporting efficiency, then state the limitation without inferring savings from time or file count. |
| US-BA-008 / REQ-BA-008 | As owner, keep earlier work intact. | Given existing customized data, when installing/reinstalling updated workflow, then safety regressions pass and history remains unchanged. | Given unavailable pwsh or a concrete review failure, when reporting completion, then report skips honestly and resolve Critical before delivery. |
