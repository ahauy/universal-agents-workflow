# Technical specification: BA-first UAW

Status: APPROVED at Gate 2 on 2026-11-26. Source of intent: signed-off baseline v1.0 and requirements.md.

## Lane/BA contract — REQ-BA-001..004/007

All implementation requests first establish outcome, affected behavior, scope,
known evidence, material unknowns and observable acceptance expectations.
Fast remains the default for bounded work with confirmed existing behavior and
no escalation trigger; its checkpoint/plan stays in chat, one context, no Full folder.
Retain T1..T6 and add a named trigger for new or unresolved business behavior
(T7) to express the approved policy consistently. Resolved minor non-business
questions do not automatically create a Full process. Risk triggers still apply
even to small stories with pre-existing acceptance criteria.

Full reuses existing signed-off evidence and fills only material gaps. Questions
are batched, with no fixed total count; missing business decisions cannot become
defaults. No lane weakens Git/data/approval safeguards. Read-only research does
not require a recursive BA implementation ceremony.

Roadmap generation elicits goals, actors, journeys/rules, edge cases and scope
before writing stories/AC. Platform/auth/stack questions apply only when relevant.
Continuation checks dependencies and evidence, then the same lane rules; no
blanket roadmap bypass or automatic approval of a story's business assumptions.

## Native skill and artifact contract — REQ-BA-005/006

| Native skill | Inputs | Outputs / stopping condition |
| --- | --- | --- |
| technical-spec | Signed-off baseline, requirements, domain/risk evidence, relevant existing code | UAW spec.md with technical design and applicable contracts; return business gaps to BA |
| implementation-plan | Signed-off baseline and technical spec | plan.md with scoped files, dependencies, verification and risk; optional supporting models/contracts only when needed |
| task-breakdown | spec.md and plan.md | Ordered tasks.md, meaningful verification and explicit dependency/parallel boundaries |
| technical-consistency-review | Existing requirements, spec, plan and tasks | Read-only consistency/coverage findings before Gate 2/implementation; never run on missing downstream artifacts |

Business consistency uses existing risk-contradiction-scanner before requirements
validation/baseline sign-off; replace nonexistent consistency-scan references.
requirements.md remains the business source; no upstream business-spec template
is reused as UAW technical spec.md without rewriting its sections and intent.
All artifacts stay under .specify/features/<slug>/; no upstream CLI/script lookup.

## Compatibility contract

Ten legacy speckit-* names become small on-demand migration stubs, not a second
implementation. Active core routes use native names. Four planning stubs redirect
to the table above; clarify/checklist/implement/converge point to existing UAW
elicitation, validation, lane-aware implementation and verification steps.
Constitution/taskstoissues issue explicit retirement guidance: project rules
remain in AGENTS.md/local rules; external issue export requires a separate user
request and supported integration. No automatic rule rewrite or issue creation.
Retire upstream workflow registration and executable YAML, remove obsolete
runtime-specific references, preserve useful provenance/attribution and historical
project records. Aliases preserve source paths for safe upgrades; they do not
authorize overwriting a user's modified files or deleting retained customer files.

## Verification and cost boundaries — REQ-BA-007/008

Use standard-library structural checks, prompt decision-path scenarios, existing
hook/installer checks and temporary full-source install/adapter smoke tests.
Semantic scenario review is not executable proof of every future AI response.
Keep the hot entry-point count stable, native planning skills cold, context packs
at most 150 lines and existing lane budgets. Report measured catalog size and
available telemetry; no guaranteed monetary savings or invented price thresholds.
