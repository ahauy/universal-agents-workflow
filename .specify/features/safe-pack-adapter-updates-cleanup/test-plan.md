# Acceptance test plan

**Status:** Planned, not executed for parts 4–5. Baseline v1.0; Gate 2 pending.

Use local temporary source/target fixtures; capture bytes/hashes before each run.
Exercise install/reinstall/local sync and apply via mocked fetch/clone. No actual
customer paths/global config or network update. Two source upgrades are required
for preservation checks so first-run keep cannot hide later baseline adoption.

| Case / AC | Setup and action | Expected observable evidence |
| --- | --- | --- |
| V01 / AC-01 | Fresh install with explicit pack; reinstall then local/apply update | Registry ID/mapping and actual hashes survive; untouched core+pack advance. |
| V02 / AC-01 | Catalog contains an unselected matching/new pack | No unselected files/registry entry appear on update. |
| V03 / AC-01,02 | Edit one pack file, add custom child; run source v2 then v3 | Custom bytes and previous baseline unchanged; safe sibling advances twice. |
| V04 / AC-02,04 | Legacy validated hashes, missing pack selections | Core migrates conservatively; no pack inferred; reconfirmation notice. |
| V05 / AC-02,04 | Existing files, missing ownership metadata incl identical/marker-bearing content | Keep unverified content across repeated updates; no trust adoption. |
| V06 / AC-04 | Corrupt/unsupported registry or manifest; invalid entry types/hashes | Failure before mutations; existing metadata/data bytes unchanged. |
| V07 / AC-02,03 | Adapter copy: unchanged file, edited marker file, custom descendant | Only verified unchanged files advance; custom data and old baseline stay. |
| V08 / AC-02,03 | Valid owned symlink; user-retargeted or broken custom link; --clean | Safe owned link maintained; altered/unverified links/custom targets preserved. |
| V09 / AC-04 | Absolute/.. mappings, collisions, source/target symlink escape, unsafe clean manifest | Reject before write; outside sentinel and target bytes unchanged. |
| V10 / AC-03,04 | New pack skill plus derived step fails or Node absent; retry | Pack precedes index/adapters/hooks; failure/unrun phase explicit, no false complete; safe retry. |
| V11 / AC-04 | Selected pack source removed/unavailable | Keep installed files/registry; report unavailable; no claimed pack update. |
| V12 / AC-02,03 | Same-name hot/cold differ; equivalent owned copy; custom descendants | No name-only deletion; only proven redundant/unchanged owned copies moved/pruned. |
| V13 / AC-02,03 | User hook groups/settings, edited generated hook and custom index | Preserve custom bytes/entries; update only proven unchanged owned content; repeat safely. |
| V14 / AC-02,07 | Protected CONTEXT/domain/source/env/ADR/signed baseline + user file removed upstream | All retained through reinstall/two updates; no purge or overwrite. |
| V15 / AC-05 | Fresh installed screenshot skill after cleanup | 13 app scripts/card example absent; generic script/plan/template refs resolve, CLI/plan parse checks pass. |
| V16 / AC-06 | Catalog regeneration/check + installed Archify path | One authority, byte-correct runtime mirror; valid sources/destinations, no duplicate owner; custom runtime catalog kept. |
| V17 / AC-06 | Installed Archify demo and render-examples to temp output | Five HTMLs absent from ship; JSON inputs render five outputs; demo works with bundled runtime. |
| V18 / AC-07,08 | Source contains notes/cache/metrics/features/accepted ADRs; install then rerun | Not shipped; generic templates remain; existing customer/history unaffected; prior regressions pass. |

Commands expected after implementation: Python unittest discover under
.agents/scripts/test/ with pattern test-*.py; node test-hooks.js and new
 test-derived-updates.mjs/test-catalog.mjs; node build-skill-index.mjs --check;
node validate-agents.mjs; bash -n install.sh. Resolve script paths from repo root.
Run installer PowerShell cases when pwsh exists; otherwise report SKIP with reason.
Render to isolated temp directories, not tracked examples. Generic screenshot checks
must not claim a real browser/app screenshot run unless actually executed.

For every case record command, result and pertinent before/after hash assertion in
acceptance-report.md. Independent review covers security/standards and spec fidelity;
zero unresolved Critical plus all required available checks green before delivery.
