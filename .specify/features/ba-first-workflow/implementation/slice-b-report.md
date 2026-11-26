# Slice B report — native planning and migration

REQ-BA-005/006 implemented within B ownership. No Git writes, installs, A-file
edits or SKILLS.md generation were performed by this slice.

## Changes

- Added four cold native skills: technical-spec, implementation-plan,
  task-breakdown, technical-consistency-review. They enforce signed-off Full
  baseline, business/technical ownership, missing-artifact stops and Gate 2.
- Replaced all ten legacy speckit-* entries with migration-only stubs; retained
  their paths and provenance. Old reference paths now contain inert retirement
  notes, with no runnable upstream hook protocol or duplicate implementation.
- Removed executable .specify/workflows/speckit/workflow.yml, emptied its registry
  and added retirement guidance. Safe updates still preserve customer changes.
- Rewrote spec/plan/tasks/checklist templates for native UAW contracts, retired
  constitution generation, corrected context-pack lane and test-plan traceability.
- Updated system-architect, route/wayfinder/scaffold/user-guide routes, index
  grouping/symptoms, harness lane wording, Antigravity analysis selection, and
  mirrored catalog scaffold descriptions. Approved blueprint choices are reused.
- Added accepted ADR 0004 and its ADR index row without editing prior ADRs.

## Verification

- python3 .agents/scripts/test/test-workflow.py: all 3 cases pass (inventory,
  legacy/registry retirement, no upstream execution dependencies).
- skill-creator quick_validate.py: all four native skills valid.
- node --check: build-skill-index.mjs and sync-harnesses.mjs pass.
- bash -n: sync-antigravity-global.sh passes.
- Both catalogs and workflow registry parse as JSON; catalogs remain identical.
- Self-check: native skills distinguish BA consistency from technical review;
  absent baseline/spec/plan/tasks stop downstream work; Fast does not create
  Full artifacts or delegate. Legacy aliases do not grant approvals or Git writes.

## Integration boundaries and limits

Coordinator must generate SKILLS.md after both slices finish, run full installer,
harness and hook checks, and integrate independent semantic forward tests.
Syntax/structural checks do not prove future agent decisions or monetary savings.
No source-level Critical findings identified in this self-check.
