# Existing-skill production integration slice

Scope: REQ-PROD-001/003 and BR-PROD-001..004; changes limited to seven assigned skill files.

## Changes

- verification-before-completion retains Fast/Full feature checks and adds release-only verification: DEV_COMPLETE is feature scope, RELEASE_READY needs current candidate/target/config evidence, and PRODUCTION_VERIFIED needs actual authorized deployment plus applicable post-deploy checks. Required missing/failed/skipped checks block; N/A needs a reason; Critical is never accepted and High needs fix or explicit owner acceptance. Failed smoke/health checks produce FAILED; verified recovery produces ROLLED_BACK rather than verifying a failed candidate.
- technical-spec, implementation-plan, task-breakdown and technical-consistency-review route only selected release/operational scope to relevant lifecycle sections. They preserve ordinary feature flow, unresolved ASM- decisions, conditional migration/data recovery and the distinction between approved planning and operational authorization.
- technical-documentation routes on demand to the two new templates for stable OPERATIONS and per-release evidence, preserving custom content/assets and storing secret names/references only.
- command-git-push now explicitly reports source delivery only; no automatic deployment/release record, and neither framework approval nor Git approval grants production authorization. Existing matching authorization is reused.

## Files

- .agents/skill-library/engineering/verification-before-completion/SKILL.md
- .agents/skill-library/engineering/technical-spec/SKILL.md
- .agents/skill-library/engineering/implementation-plan/SKILL.md
- .agents/skill-library/engineering/task-breakdown/SKILL.md
- .agents/skill-library/engineering/technical-consistency-review/SKILL.md
- .agents/skill-library/engineering/technical-documentation/SKILL.md
- .agents/skills/engineering/command-git-push/SKILL.md

## Verification and boundaries

Local instruction suite: 4/4 passed. validate-agents: 25 agents and 84 instruction files, zero errors/warnings at slice verification. git diff --check passed. New local links use the assigned canonical protocol/template paths and anchors; target-existence verification was pending the parallel protocol slice at the initial check and is part of coordinator integration. No skill descriptions changed; no catalog identity or runtime added. No product/global/customer writes, dependency installation, Git mutation or real deployment. Existing unrelated Git behavior was left unchanged.
