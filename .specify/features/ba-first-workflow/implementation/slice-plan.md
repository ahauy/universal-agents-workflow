# Slice plan: BA-first UAW

Both gates approved. Models inherit the parent; no Git writes or runtime installs.
Read context-pack.md, spec.md and plan.md, not the prior chat or full spec chain.

| Slice | Requirements | Ownership | Dependencies | Output |
| --- | --- | --- | --- | --- |
| A | REQ-BA-001..004/007 | Governance, BA, roadmap, root pointers, hook, docs | None; parallel with B | slice-a-report.md |
| B | REQ-BA-005/006 | Native skills, aliases, templates, catalogs, migration | None; parallel with A | slice-b-report.md |
| Integration | REQ-BA-001..008 | Generated index, tests, acceptance, review/feature docs | A+B | ../acceptance-report.md |

## A files

AGENTS.md, README.md, CLAUDE.md, GEMINI.md, .cursorrules, .windsurfrules,
.github/copilot-instructions.md, .agents/docs/*.md,
.agents/rules/common/agents.md and development-workflow.md,
.agents/agents/business-analyst.md,
.agents/skills/engineering/{intake-classifier,command-generate-backlog,command-continue-project}/SKILL.md,
.agents/scripts/hooks/session-context-init.js,
.agents/skill-library/engineering/{elicitation-interview,domain-modeling,gap-analysis,risk-contradiction-scanner,spec-writer,spec-validator,handover,implementation-orchestrator}/SKILL.md.

Use the canonical skill names in plan.md. Keep native names aligned with B;
do not edit B-owned source, generated SKILLS.md or integration tests.

## B files

.agents/skill-library/engineering/{technical-spec,implementation-plan,task-breakdown,technical-consistency-review}/SKILL.md (new),
ten speckit-* skill folders/references,
.agents/agents/system-architect.md,
.agents/skill-library/{productivity/route,engineering/wayfinder,engineering/scaffold-architecture,engineering/user-guide-with-screenshots}/SKILL.md,
.agents/scripts/{build-skill-index,sync-harnesses}.mjs and sync-antigravity-global.sh,
.agents/catalog.json, optional-stack-skills/catalog.json,
.specify/templates/*, .specify/workflows/*,
adr/0004-ba-first-uaw-workflow.md and adr/README.md.

Keep all ten legacy entry points small migration stubs; four canonical skills
stay cold. Read /Users/vutuanhau/.codex/skills/.system/skill-creator/SKILL.md
as needed for authoring; repository layout and invocation policy take precedence.
Do not edit A files or run the index generator until both slices finish.

## Coordinator

.agents/SKILLS.md generation, .agents/scripts/test/*, code-reviewer persona
terminology only if needed, feature docs and .specify/features/README.md.
Do not touch installers/update engine, optional tech packs, prior signed-off
feature history, accepted ADRs or unrelated user changes. Run current structural
regressions on owned code and report limitations/semantic case evidence concisely.
