# Technical specification: Safe pack/adapter updates and cleanup

**Status:** Draft for Gate 2 | **Baseline:** [v1.0 SIGNED-OFF](baseline.md)
**Requirements:** [requirements.md](requirements.md) | **Date:** 2026-11-26

## Technical scope and existing evidence

REQ-UPD-001..008. Reuse update-engine.py three-way hashes, installer selectors,
existing harness/index/hook generators, Python/Node stdlib and local tests.
Current gaps: packs copied outside registry; apply uses core list only; copied
adapters skip refresh; marker-based writes lack hashes; prune uses names; source
session artifacts enter recursive copies. No database, public API or new runtime.

## Components and flow

1. Installer collects existing registry plus explicit new selections, without
   writing pack files yet. Existing update selection is never inferred from folders.
2. Validate source, target, metadata and all expanded source-target mappings before
   mutation. Use the same engine for fresh/reinstall/local sync and update apply.
3. Sync eligible core and pack files using the last successfully written content
   baseline. Missing target may be created; modified/unowned existing target kept.
4. Normalize tiers/build index safely after packs, refresh adapters, then hooks.
   Run generators from verified source code, not a locally customized target script.
5. Persist truthful per-file results and phase status; print updated/kept/conflict/
   unavailable/failed counts. A version check alone cannot claim refresh completed.

## Contracts and state

Extend workflow-source.json compatibly with a schema version and selected-pack
records: catalog ID, source path, target path. Keep existing repo/version/protected
fields and unknown metadata; maintain explicit last-written file hashes keyed by
mapping identity, preventing source aliases from claiming a different destination.
Catalog is trusted only after schema/path/collision validation, not merely by ID.

Use harness-manifest.json for derived file provenance, extending its versioned
schema with per-output path, kind (file/symlink), source identity and last-written
hash/link target. A generated directory is tracked per file, not as blanket
permission over user-added descendants. Index and hook provenance must use the
same last-written rule; hooks track owned groups/entries without adopting custom
settings. A small separate derived-state JSON is allowed only if needed to avoid
unrelated scripts overwriting one another's metadata; it follows identical validation.

Each derived command returns nonzero for a failed phase and reports conflicts
separately from successful writes. Updater aggregates phase outcomes, records
partial failure, and never prints unconditional complete. Preserve existing CLI
entry points; add only arguments needed for explicit selections and safe refresh.

Boundary validation: JSON object/schema/types/hash formats, unique pack IDs and
non-overlapping destinations, relative normalized paths, no absolute/parent escape,
no source/target symlink escape. Resolve filesystem aliases before containment
checks; reject conflicting core/pack ownership. Validate manifest cleanup paths too.
Protected paths still take precedence over pack mappings and generated ownership.
Do not execute a postprocessor whose source provenance has not been established.

## Comparison, migration and retry

| Situation | Action / baseline effect |
| --- | --- |
| Missing destination and valid mapping | Create; record bytes actually written. |
| Verified old hash equals current file; source changed | Update; advance hash to bytes written. |
| Current differs from verified old hash | Keep/report conflict; preserve old hash. |
| Existing file lacks ownership evidence | Keep/report unverified; do not adopt merely because bytes or marker match. |
| Verified owned symlink unchanged | Preserve/refresh only validated link target; do not follow it to modify custom/outside data. |
| Missing optional source | Keep installed files/registry; report unavailable; do not claim pack updated. |
| Removed upstream file or old distribution artifact | Do not delete installed copy. |

Legacy metadata is migrated only from validated existing mappings/hashes. Absent
selection means core only; report packs needing explicit reconfirmation. Missing
metadata with existing files means conservative keep, not a fresh empty trust
baseline. Corrupt/unsupported metadata or dangerous mappings fail preflight before
writes. Fresh metadata is built from successful writes, never an empty placeholder
that overwrites an existing registry. Write JSON atomically using sibling temporary
files and replace; interrupted phases retain enough old hashes for conservative retry.
No global transaction is promised: safe writes already completed may remain after a
later failure. Repeat runs preserve conflicts and retry unfinished phases.
Existing explicit interactive overwrite, if retained, requires per-file confirmation
and backup; --yes must continue to keep conflicts. It cannot authorize path escapes.

Hot/cold: relocate only validated framework-owned unchanged content, or remove a
redundant copy only when equivalence and framework ownership are proven. Differing
same-name trees and user-added descendants remain and are reported. --clean for
adapters also uses per-output ownership; a marker/path list alone cannot permit deletion.

## Catalog, Archify and cleanup design

Authoritative catalog: optional-stack-skills/catalog.json. .agents/catalog.json is
an explicitly generated runtime mirror required in installed projects; generate/check
it from the authority in maintenance/distribution, protect customized target copies.
Keep one canonical bundled Archify runtime at
.agents/skill-library/engineering/archify. The Archify catalog row must reference that
source/destination as already-in-core, not select a second owner overwriting it.
Replace the optional tools/archify wrapper with a short pointer if references require
it; remove its identical examples/reference copies and redirect callers to canonical
resources. Do not require global Archify installation. Verify local paths after install.

Remove only the 12 capture-*-screenshots.mjs and verify-extension-live.mjs in the
user-guide-with-screenshots scripts directory; remove the app-specific card example
and update callers. Keep capture-screenshots.mjs, screenshot-plan.example.json and
generic guide template. Remove only the five rendered HTML examples listed in tasks;
keep renderer templates, JSON inputs and render-examples.mjs; render tests to temp dirs.

Distribution excludes .agents/handoffs/, .agents/.cache/, project-specific
.specify/features/ and .specify/metrics/ content, local install/adapter state and
accepted project ADR history (retain adr/adr-template.md and generic spec templates).
Inspect other session/project artifacts before excluding; do not remove historical
source artifacts. Apply identical filters to fresh/reinstall/update paths so recursive
copies cannot bypass exclusions. Never purge corresponding existing target content.

## Failure/recovery and verification

Missing Python/Node: report the prerequisite and phase not run; existing-project
mutations requiring safe comparison must not fall back to blind copy. No new runtime
requirement beyond existing toolchain. Missing Node prevents derived completion;
valid source copies already written remain retriable, not reported as complete.
All tests use local temporary fixtures/mocked fetch/clone; no remote customer updates.
Map REQ-UPD-001..008 to AC-01..08 in test-plan.md and tasks.md. There are no unresolved
business ASM IDs. Technical implementation refinements must retain these invariants.
