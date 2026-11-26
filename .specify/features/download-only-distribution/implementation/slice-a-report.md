# Slice A report

## Delivered

- Deleted `packages/mcp-server/`, including package source, templates, package tests,
  runtime output and ignored dependencies. Deletion was explicitly approved;
  pre-existing changes within the removed package are covered by that scope.
- Removed the npm/MCP setup route from `README.md`; retained the download/file
  quickstart and both installer entry points.
- Updated `AGENTS.md` and WorkBuddy output in `sync-harnesses.mjs` to direct agents
  to local artifacts and the existing `spec-validator` skill.
- Updated root `test-plan.md` to cover download distribution and local validation.
- Added accepted ADR 0003 and an ADR index marking ADR 0002 as superseded without
  editing the accepted historical decision.
- Preserved other existing working-tree changes and third-party MCP integrations.
  No git writes or replacement CLI were introduced.

## Evidence

- `python3 .agents/scripts/test/test-installers.py -k download_distribution`:
  failed before implementation because the package existed; passed after deletion
  (1 test).
- `node --check .agents/scripts/sync-harnesses.mjs`: passed.
- Generated the WorkBuddy adapter in an isolated temporary UAW target and asserted
  it points to `spec-validator` with no UAW package or tool registration: passed.
  An initial fixture without `AGENTS.md` was correctly rejected; the valid fixture
  includes the required project marker.
- Asserted the package directory is absent and assigned active guidance contains
  no package path or npm reference: passed.
- Compared ADR 0002 bytes against HEAD: unchanged.

## Self-check

REQ-DOWNLOAD-001/002/005 are covered by this slice. No unresolved Critical
findings. Full installer/hook regression and validation-skill scenario review
remain owned by slices B/C; PowerShell availability is reported there.
