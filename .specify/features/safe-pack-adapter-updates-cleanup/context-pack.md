# Context pack — safe-pack-adapter-updates-cleanup

- Lane: Full (T1). Gate 1: baseline.md SIGNED-OFF v1.0, 2026-11-26.
- Gate 2: APPROVED by owner 2026-11-26; implementation authorized.
- Intent: finish selected-pack/adapter updates, remove approved redundant source,
  preserve custom data through repeated installs/updates and derived output refresh.
- Confirmed: ASM-UPD-001..004; BR-UPD-001..004; REQ-UPD-001..008.
- AC-01..08: see test-plan.md; preserve bytes/hashes, not merely file existence.
- Contract: validate paths/metadata first; core + explicit packs; compare last
  written hash; keep conflicts/unowned files; never advance baseline on keep.
- Legacy does not prove pack selection or ownership. Marker is not ownership.
- Refresh order: source sync -> safe tier/index -> adapters -> hooks -> summary.
- No customer-file purge, global config changes, new dependencies or Git writes.
- Existing uncommitted work from parts 1–3 must remain intact.
- Architecture: spec.md; execution/ownership: plan.md; test matrix: test-plan.md.

## Slice A: update/install lifecycle

- Files: .agents/scripts/update-engine.py; install.sh; install.ps1;
  .agents/scripts/test/test-installers.py; new test-update-engine.py.
- Optional small stdlib helper under .agents/scripts/ only if file/function limits
  require splitting; exact helper ownership recorded before dispatch.
- Output: slice-a-report.md with changed files, commands, failures and limitations.
- Consumes derived-tool result contract in spec.md; does not edit slice B files.

## Slice B: derived ownership / catalog

- Files: .agents/scripts/{sync-harnesses.mjs,build-skill-index.mjs,install-hooks.js};
  optional-stack-skills/catalog.json; .agents/catalog.json;
  new test-derived-updates.mjs and test-catalog.mjs under .agents/scripts/test/.
- If shared JS helper is required, own only a named derived-state helper and its tests.
- Output: slice-b-report.md; result/manifest contract from spec.md.
- Do not touch installer/updater or cleanup resource files.

## Integration / cleanup: coordinator

- Scope: guide skill SKILL.md/SETUP.md, its approved scripts/template removals;
  Archify five example HTMLs, duplicate optional-wrapper resources and callers;
  distribution filters (serialize with A), README.md, harness/update docs,
  command-update skill; this feature docs/index.
- Output: acceptance-report.md, review findings/resolution, feature README indexed.
- Independent reviewer after integration: standards/security + requirement fidelity;
  scoped diff and AC; no implementer reasoning. Zero unresolved Critical.
