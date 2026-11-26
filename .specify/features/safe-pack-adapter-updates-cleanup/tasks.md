# Tasks: Safe pack/adapter updates and cleanup

**Status:** APPROVED at Gate 2 by owner, 2026-11-26; implementation complete; evidence in acceptance-report.md.
**Inputs:** [baseline v1.0](baseline.md), [spec.md](spec.md), [plan.md](plan.md)

## Ordered work

- [x] T001 (REQ-UPD-001..008) Coordinator: snapshot current source/protected history,
  create local fixture strategy and freeze spec contracts. Verify current failures
  without touching customer projects. No dependency.
- [x] T002 [P/A] (REQ-UPD-001,002,004,007) Add failing update-engine/installer cases
  V01..06,V09..11,V14 in test-update-engine.py/test-installers.py. Depend T001.
  Verify failures expose registry, trust, path/filter or phase-result bugs.
- [x] T003 [A] (same IDs) Implement validated persisted pack selections/mappings,
  compatible legacy migration, core+pack safe writes and distribution filtering in
  update-engine.py. Atomic metadata, no baseline adoption on keep. Depend T002.
- [x] T004 [A] (REQ-UPD-001..004,007) Wire install.sh/install.ps1 and apply/sync to
  shared safe path: select packs before generation, persist successful hashes,
  ordered postprocessing and honest partial status. Depend T003; final integration
  consumes T007. Verify V01..06,V09..11,V14 and existing installer regressions.
- [x] T005 [P/B] (REQ-UPD-002..004,006) Add failing derived/catalog cases V07..08,
  V12..13,V16 in new test-derived-updates.mjs/test-catalog.mjs. Depend T001.
- [x] T006 [B] (REQ-UPD-002..004) Implement per-file/link provenance, conservative
  legacy behavior and safe clean/copy/link refresh in sync-harnesses.mjs; guard
  tier/index writes/pruning and hook groups in build-skill-index.mjs/install-hooks.js.
  Depend T005. Verify marker-edited files, copied custom descendants, hooks and
  same-name hot/cold trees preserved through two refreshes.
- [x] T007 [B] (REQ-UPD-004,006) Finish derived exit/result contracts and canonical
  catalog generation/check; remove Archify duplicate ownership via canonical row.
  Own both catalog files. Depend T006; verify V10,V16. Return bounded slice report.
- [x] T008 (REQ-UPD-005) Coordinator after A/B: delete exactly the 12 app capture
  scripts and verify-extension-live.mjs under user-guide-with-screenshots/scripts/;
  remove templates/user-guide-example-card-creation.md, repair SKILL.md/SETUP.md
  and any callers. Keep generic capture, screenshot plan and template. Verify V15.
- [x] T009 (REQ-UPD-006) Coordinator: remove only these Archify examples HTMLs:
  workflow-agent-tool-call-rendered.html, sequence-cache-miss-request.html,
  dataflow-product-analytics.html, lifecycle-agent-run.html, web-app-rendered.html.
  Consolidate optional-stack-skills/tools/archify duplicated JSON/references to
  canonical engineering/archify resources; preserve useful redirect and update
  callers. Depend T007. Verify V16..17 from an installed temporary workspace.
- [x] T010 (REQ-UPD-001..008) Integrate A/B+cleanup; finish source filters without
  deleting signed history, update README/harness docs/command-update instructions.
  Depend T004,T007..09. Run all V01..18; compare protected bytes and repeat runs.
- [x] T011 (REQ-UPD-008) Independent reviewer: standards/security and spec fidelity;
  lean pass for >300-line diff. Depend T010. Output scoped findings, resolve Critical
  and other blocking acceptance failures; rerun affected tests, review corrections.
- [x] T012 (REQ-UPD-008) Coordinator: feature README/index, acceptance-report.md
  with pass/fail/skip evidence, conflicts/limits and cleanup inventory. Depend T011.
  Check zero unresolved Critical, end metrics and report briefly. No Git writes.

## Dependencies and parallel boundaries

Only A(T002..04) and B(T005..07) are parallel; disjoint ownership in context-pack.md.
T004 integration waits for T007's derived behavior. Coordinator cleanup touches no
A/B active files; any helper/shared-file change is named and serialized first.
A/B read their bounded context pack and relevant spec sections. Independent review
receives AC/diff, not implementer reasoning. No automatic commit/push/deployment.

## Coverage and completion

| Requirement / AC | Tasks | Observable verification |
| --- | --- | --- |
| REQ-UPD-001 / AC-01 | T002..04,T010 | V01..03: chosen packs persist; unchosen absent |
| REQ-UPD-002 / AC-02 | T002..06,T010 | V03..09,V12..14: custom bytes and old hashes preserved |
| REQ-UPD-003 / AC-03 | T004..07,T010 | V07..08,V10,V12..13: safe ordered regeneration |
| REQ-UPD-004 / AC-04 | T002..07,T010 | V04..11: unsafe writes blocked; truthful results |
| REQ-UPD-005 / AC-05 | T008,T010 | V15: app scripts absent, generic paths resolve |
| REQ-UPD-006 / AC-06 | T007,T009..10 | V16..17: mirror/refs and renderers work |
| REQ-UPD-007 / AC-07 | T002..04,T010 | V14,V18: source exclusions, customer/history kept |
| REQ-UPD-008 / AC-08 | T010..12 | V01..18, independent review, indexed report |

Gate 2 requires explicit owner approval of plan + tasks. Passing the planning
consistency check is not implementation authorization or executable acceptance.

## Completion evidence

2026-11-26: T001..T012 completed. Review Round 2 APPROVE; 72 tests/assertions
passed, 3 PowerShell cases skipped (pwsh unavailable). See acceptance-report.md
for case mapping and limitations. No Git writes or customer remote updates.
