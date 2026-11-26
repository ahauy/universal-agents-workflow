# Technical specification: Download-only distribution

Status: DRAFT for Gate 2. Baseline: SIGNED-OFF v1.0.
Requirements source: requirements.md; this document specifies implementation only.

## Distribution boundary — REQ-DOWNLOAD-001/002

Delete packages/mcp-server in full, including its modified scaffold regression
from part 1, npm lockfile, templates, ignored node_modules and generated dist.
Those files serve the deliberately removed distribution, not the retained installer.
No replacement npm package, server, executable validator or init command is introduced.

Keep install.sh/install.ps1 and their public arguments. Preserve the existing
part-1 installer regression cases. Correct setup instructions and the WorkBuddy
adapter template at their sources rather than generating unrelated editor files.
Retain .agents/mcp_config.json and external integration catalog entries.

## Validation boundary — REQ-DOWNLOAD-003

The implementation is the existing spec-validator/SKILL.md procedure:

1. Resolve the requested feature directory and inspect requirements.md,
   01-elicitation.md, 03-domain-model.md and 04-risk-register.md. Do not require
   technical spec.md/plan.md/tasks.md at this pre-baseline stage.
2. Missing, unreadable, empty or placeholder-only required evidence is a blocking
   finding; do not substitute empty strings, infer approvals or issue PASS.
3. Check unresolved assumptions in the assumption records rather than treating
   all unchecked Markdown task boxes as assumptions.
4. Inspect every REQ and US for unique IDs, valid Derived from / Traces to links,
   applicable testable acceptance scenarios and coverage. Dangling references,
   duplicate IDs and uncovered requirements are reported by ID.
5. Review the eight quality criteria semantically and record validation-report.md
   plus traceability-matrix.md. A pattern match is not a semantic review or an
   IEEE certification; structural blockers cannot become PASS through an override.

Signed-off inputs remain immutable: failures are reported, not patched by the
validator. Existing explicit user acceptance of non-blocking qualitative gaps
must remain distinguishable from a clean PASS.

## Guidance/history boundary — REQ-DOWNLOAD-004/005

Remove active UAW MCP setup/tool instructions from root documentation, adapter
source and test guidance. Keep approved historical records; a new ADR 0003 and
ADR index identify the successor without editing accepted ADR 0002.
Feature documentation includes verification evidence and a feature index entry.
Unrelated working-tree edits must not be reverted or overwritten.

## Validation contracts

Automated evidence covers package absence, actual local install/reinstall behavior,
installer regression outcomes and existing hooks. Semantic validator behavior is
reviewed against the concrete cases in test-plan.md; keyword-only checks must not
be presented as proof of that behavior. PowerShell runtime checks are reported
as skipped if pwsh remains unavailable. No TypeScript build is required after
the sole TypeScript package in scope is removed.
