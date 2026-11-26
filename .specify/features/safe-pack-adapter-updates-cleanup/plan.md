# Implementation plan: Safe pack/adapter updates and cleanup

**Status:** APPROVED at Gate 2 by owner, 2026-11-26.
**Baseline:** [SIGNED-OFF v1.0](baseline.md) | **Spec:** [spec.md](spec.md)
**Requirements:** [requirements.md](requirements.md) | **Date:** 2026-11-26

## Approach and existing evidence

Extend the existing safe engine and generators; no replacement framework/dependency.
Core and explicitly selected packs share hash comparisons, validated mappings and
truthful phase results. Preserve custom data across repeated runs and all generators.
Cleanup is source/distribution-only; no customer-file deletion/migration sweep.

## Scope and ownership

| Requirements | Exact files / bounded changes | Owner |
| --- | --- | --- |
| 001,002,004,007 | .agents/scripts/update-engine.py; install.sh; install.ps1; test/test-installers.py; new test/test-update-engine.py | A: registry, sync, installer parity, filters |
| 002,003,004,006 | .agents/scripts/sync-harnesses.mjs; build-skill-index.mjs; install-hooks.js; both catalog.json paths; new test/test-derived-updates.mjs and test/test-catalog.mjs | B: derived provenance, safe regeneration, canonical catalog |
| 005,006 | user-guide-with-screenshots/{SKILL.md,SETUP.md,scripts/,templates/}; Archify examples HTML and optional-stack-skills/tools/archify/ duplicates/callers | Coordinator: approved cleanup |
| 008 | README.md; .agents/docs/harness-compatibility.md; .agents/skills/engineering/command-update/SKILL.md; affected usage docs; feature artifacts/index | Coordinator: integration, verification, docs |

Paths in first two rows are under .agents/scripts/ unless stated otherwise. All
requirements use REQ-UPD- prefix. Exact agent touch lists live in context-pack.md.
Extract a small stdlib helper only when needed for <800-line files/<50-line
functions; record exact helper ownership before dispatch, no shared parallel edits.

## Dependency and execution order

1. T001 records pre-change fixture hashes/protected source history and reproducible
   test failures. Freeze registry/provenance/result contracts from spec.md.
2. Full-lane A and B may run in parallel with disjoint files and scoped packs;
   A calls existing derived entry points and consumes the frozen result contract.
   Their reports list tests, conflicts and environment limits, not transcripts.
3. Coordinator integrates A+B, then performs cleanup and reference repairs. Serialize
   any distribution-filter changes with A and catalog changes with B. No third
   implementation agent is needed. Preserve all earlier uncommitted work.
4. Run acceptance/repeat-update matrix, then independent review (standards/security
   and spec fidelity, lean pass if diff >300 lines). Fix findings and rerun affected
   checks; subsequent reviews cover corrective deltas. Zero Critical before delivery.
5. Write/index feature README and concise acceptance report. End task metrics only
   on delivery; wait time does not demonstrate AI token/cost savings.

## Risks, compatibility and recovery

- Legacy hashes/mappings cannot establish new pack ownership: keep/report unknowns,
  allow explicit reconfirmation, and never treat a marker as proof.
- User edits to adapter/hook/index or same-name hot/cold skills require per-file or
  per-entry comparisons. Keep user-added children and old conflict baselines.
- Validate all paths and manifests before writes; include symlink escapes and shared
  destination collisions, not only lexical '..'.
- A later phase can fail after safe copies: persist partial state atomically, expose
  failure, retry safely; no claim of all-or-nothing rollback. Existing explicit
  overwrite retains backup/confirmation. No automated Git rollback/reset.
- Keep necessary runtime mirrors and renderer assets. No new dependencies/global
  config or external application changes. PowerShell executable is currently absent;
  record skips honestly, do not claim Windows runtime validation without evidence.

## Verification

Use test-plan.md cases V01..V18 with temporary workspaces, byte/hash comparisons
and two successive source versions. New failing tests precede each behavioral fix.
Run Python unittest discovery for test-*.py, Node test-hooks.js and new derived/catalog
suites; catalog --check, validate-agents.mjs, Bash syntax. Validate fresh-installed
Archify demo + five renderers and generic screenshot paths/CLI without requiring an
application or browser not in the fixture. Run PowerShell installer cases if pwsh
exists; otherwise leave an explicit platform limitation. No remote --apply on real projects.

## Decisions, handoff and Gate 2

Use the existing feature artifacts; no separate API/schema/DB documents or new ADR
needed for this extension. No unresolved business decisions. Read-only consistency
check is recorded in validation-report.md. Approval of baseline is not approval of
implementation: owner approval of this plan.md and tasks.md is still required by
AGENTS.md §5 Gate 2. After approval, dispatch only bounded Full slices in context-pack.md.

## Execution closeout

2026-11-26: implemented after explicit Gate 2 approval. See acceptance-report.md
for actual commands, two corrected planning command paths, technical refinements
and runtime/platform limits. Review Round 2 APPROVE; no business scope change.
