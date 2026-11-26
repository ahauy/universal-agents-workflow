# Domain model: Download-only distribution

## AS-IS / TO-BE / GAP

AS-IS: UAW offers both a TypeScript MCP package and downloadable workflow files.
The MCP init creates a router without its required skills; its regex validator
can pass missing evidence. File-based installers and the spec-validator skill
already exist independently of that package.

TO-BE: UAW is installed through the existing download/file-based installers.
Agents read local skills and artifacts; no UAW MCP package or replacement CLI
is required. Third-party integrations remain optional and unchanged.

GAP: remove the package, correct active documentation/adapters, and strengthen
the file-based validation procedure. Preserve installer safeguards from part 1.
Record the architectural change with a successor ADR; do not rewrite history.

## Rules

- BR-DOWNLOAD-001: Distribution and initialization use existing file-based installers.
- BR-DOWNLOAD-002: UAW's MCP package is removed, including package-only tests and dependencies.
- BR-DOWNLOAD-003: Requirements validation uses local business artifacts and must
  not PASS missing inputs, unresolved assumptions, missing acceptance criteria or broken traceability.
- BR-DOWNLOAD-004: Existing data protection and unrelated working-tree changes are preserved.
- BR-DOWNLOAD-005: Active guidance must describe the remaining distribution;
  accepted ADRs remain immutable and are superseded through a new ADR.

## Workflow and boundaries

Owner downloads workflow -> installer checks safety -> local workflow files are
available -> agent validates requirements using spec-validator -> reports gaps
or evidence-backed review results. Invalid inputs stay blocked for correction.

No new domain entity, database, auth/RBAC, PII, user interface, or retention
policy is introduced. The actors remain the repository owner and AI agent;
neither receives new permissions. Existing feature baselines are not recreated.

## Acceptance evidence

Use existing installer/hook regressions and fresh/reinstall smoke checks.
Inspect negative validation scenarios against the written skill; a prompt's
semantic behavior is not proven by keyword matching or an IEEE compliance claim.
Report unavailable PowerShell runtime honestly rather than counting skips as passes.
