# Setup, agent-authoring and debt slice

Status: implemented for REQ-LEAN-001 and REQ-LEAN-003; integration verification belongs to coordinator.

## Changes

- Retired source identities setup-workspace, writing-for-agents and ponytail-debt.
- command-skill-setup is a 21-line router. references/onboarding.md owns manifest/package/test/lint discovery, Git/issue conventions, safe CONTEXT/ADR preparation, confirmed choices, catalog-selected registered activation and truthful reporting.
- Onboarding preserves custom sections, existing templates/ADRs and ignore entries; unknown domain facts and architectural choices are not invented. Existing tracking mode is reused. Cold destinations, selectedPacks/last-written ownership, keep-on-conflict and project-local optional MCP boundaries remain explicit.
- technical-documentation now routes on demand to references/writing-for-agents.md for authoritative pointers, dense instructions, failure/recovery modes, shared vocabulary, preconditions/gates and a skill template. No standalone identity remains.
- ponytail-review adds debt scope with a source-comment ledger: file/line, simplification, ceiling, upgrade trigger, no-trigger flags and marker totals. Debt does not claim estimated reduction; it reports without mutation and persists only when requested.

## Files

- .agents/skills/engineering/command-skill-setup/SKILL.md
- .agents/skills/engineering/command-skill-setup/references/onboarding.md
- .agents/skill-library/engineering/technical-documentation/SKILL.md
- .agents/skill-library/engineering/technical-documentation/references/writing-for-agents.md
- .agents/skill-library/engineering/ponytail-review/SKILL.md
- Removed three former SKILL.md trees above.

## Verification and boundaries

All eight concrete local Markdown links in the five retained/new source files resolve. Owned diff whitespace passes. No updater/installer, catalog/index, shared docs, tests, customer/domain files, wait-what, signed history, home/global config or Git writes were changed by this slice. Existing tests checking activation instructions must inspect the on-demand onboarding reference, rather than require the hot router to duplicate it.
