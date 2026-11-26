# Context Pack — download-only-distribution

Phase written: 6 (delivery documentation). Updated: 2026-11-26. Lane: Full, trigger T1.

## Scope

Remove UAW MCP; keep download/file-based init and the existing validation skill.
Baseline v1.0 is signed off by the owner. Gate 2 was approved in chat on 2026-11-26: minh duyet.
Preserve installer safety and unrelated working-tree changes.
Slices A/B and available acceptance checks are complete. Independent review approved.

## IDs in play

BR-DOWNLOAD-001..005, REQ-DOWNLOAD-001..005, US-DOWNLOAD-001..005.
ASM-DOWNLOAD-001..003 are confirmed. See traceability-matrix.md for mapping.

## Acceptance criteria

- No UAW MCP package/runtime or active instructions requiring it.
- Download initialization retains local skills and part-1 data protection.
- Validation does not PASS missing evidence, unconfirmed assumptions,
  absent acceptance criteria or broken BR/REQ/US links.
- Existing installer/hook checks pass; PowerShell skips are reported.
- New ADR supersedes the immutable old MCP decision; no replacement CLI.

## Contracts

- Runtime entry points remain install.sh and install.ps1.
- The validator is an agent skill, not an executable certification service.
- Third-party MCP configuration remains outside the deletion scope.
- No Git add/commit/push, destructive resets or conflict resolution.

## Files expected for the technical plan

- packages/mcp-server/**: approved deletion, including ignored package-only output/dependencies.
- README.md, AGENTS.md, .agents/scripts/sync-harnesses.mjs: current guidance/adapters.
- .agents/skill-library/engineering/spec-validator/SKILL.md: prerequisite/failure rules.
- .agents/scripts/test/test-installers.py, test-plan.md: retained verification guidance/tests.
- adr/0003-download-only-distribution.md, adr/README.md: successor decision and index.
- .specify/features/download-only-distribution/*: feature artifacts and completion evidence.
- .specify/features/README.md: feature documentation index.

## Open questions

No business questions. Gates 1 and 2 are approved. Gates 3 and 4 are satisfied;
see acceptance-report.md, review-report.md and README.md for final evidence and limits.

## Do not re-derive

Do not add a replacement server, validator CLI or init CLI. Do not remove external
MCP integrations. Do not modify the accepted ADR or unrelated existing changes.
