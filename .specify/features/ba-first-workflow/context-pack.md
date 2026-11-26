# Context Pack — ba-first-workflow

Phase written: 6, delivery documentation. Date: 2026-11-26. Lane: Full (T1).

## Scope and IDs

Owner approved UAW as the core, BA checkpoints for all implementation requests,
Fast for clear bounded work and Full for new/unclear business behavior or risk.
BR-BA-001..008 -> REQ-BA-001..008 -> US-BA-001..008.
ASM-BA-001..003 confirmed. Baseline v1.0 and Gate 2 approved by the owner in chat.
Slices A/B, integration checks and isolated native forward exercise are complete.
Review Round 1's two roadmap-template issues were resolved in incremental Round 2;
verdict APPROVE. See review-report.md, acceptance-report.md and indexed README.md.

## Acceptance

- No lane/roadmap bypass of material business decisions; no repeated answered interviews.
- Fast: concise checkpoint, one context, no Full folder. Full: deep BA when needed,
  scoped delegation, current budgets and approval/review gates retained.
- requirements.md owns intent; spec.md owns technical design. Check BA consistency
  before baseline and technical consistency only after spec/plan/tasks exist.
- Self-contained native skills; no absent SpecKit scripts or invented defaults.
- Catalog/agent/hook/installer/reference checks pass; no Critical; report limits.
- Preserve earlier safety, signed history and unrelated edits. No Git writes.

## Technical planning boundaries

Plan exact native skill names, compatibility/retirement mapping and active
reference migration. Avoid duplicate planning/BA systems and extra runtimes.
No token-cost integration or guaranteed savings; use existing measurement tools
and distinguish estimated characters from actual billed usage.

## Expected file families

- AGENTS.md, README.md and root harness pointer files (.github instructions included).
- .agents/docs/*.md, .agents/rules/common/{agents,development-workflow}.md.
- .agents/agents/{business-analyst,system-architect,code-reviewer}.md.
- .agents/skills/engineering/{intake-classifier,command-continue-project,command-generate-backlog}/SKILL.md.
- .agents/skill-library/engineering/{elicitation-interview,domain-modeling,gap-analysis,risk-contradiction-scanner,spec-writer,spec-validator,handover,implementation-orchestrator,scaffold-architecture}/SKILL.md.
- Native planning skills and legacy speckit-* folders/references identified by plan.
- .agents/skill-library/{productivity/route,engineering/wayfinder,engineering/user-guide-with-screenshots}/SKILL.md for active routes only.
- .agents/scripts/{build-skill-index,sync-harnesses}.mjs, sync-antigravity-global.sh,
  hooks/session-context-init.js, tests under .agents/scripts/test/.
- .agents/SKILLS.md, .agents/catalog.json and optional-stack-skills/catalog.json.
- .specify/templates/* and .specify/workflows/* (retire upstream execution entries).
- adr/0004-ba-first-uaw-workflow.md, adr/README.md and this feature's artifacts/index.

## Do not re-derive

No reinstallation of SpecKit or MCP, no new CLI/framework, no forced legacy
customer-file deletion. Existing installer protection and all accepted ADRs/
previous feature baselines remain unchanged. See implementation/slice-plan.md for ownership.
