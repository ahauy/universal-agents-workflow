# Acceptance report — parts 4–5

**Date:** 2026-11-26. **Status:** available acceptance checks passed; independent Round 2 APPROVE.
Gate 1 baseline v1.0 and Gate 2 plan/tasks were explicitly approved by the owner.
No implementation beyond approved scope, Git add/commit/push or real remote
customer update was performed. All destructive test fixtures used temporary paths.

## Executed checks

| Suite / command from repository root | Result |
| --- | --- |
| python3 .agents/scripts/test/test-update-engine.py | 19 passed |
| python3 .agents/scripts/test/test-installers.py | 9 passed; 3 PowerShell skips |
| python3 .agents/scripts/test/test-update-integration.py | 2 passed |
| python3 .agents/scripts/test/test-distribution-cleanup.py | 3 passed |
| python3 .agents/scripts/test/test-workflow.py | 3 passed |
| node .agents/scripts/test/test-derived-updates.mjs | 12 passed |
| node .agents/scripts/test/test-catalog.mjs | 3 passed |
| node .agents/scripts/test/test-hooks.js | 21 passed |
| node .agents/scripts/build-skill-index.mjs --check | 9 hot / 61 cold, valid |
| python3 .agents/scripts/validate-agents.py | 25 agents / 102 instruction files; no errors/warnings |
| bash -n install.sh | passed |

Total test cases/assertions reported by these suites: **72 passed, 3 skipped**.
Structural/index/syntax checks are additional, not included in that total.
Captured Python output: [python-checks.json](implementation/python-checks.json).

Execution corrected two planning command mistakes: unittest discover with the
existing hyphenated filenames collected zero tests, so each test-*.py was invoked
directly; the agent validator is validate-agents.py, not validate-agents.mjs.
Zero-test discovery was not counted as a pass. No new test dependency was added.

## Acceptance traceability

| Case | Evidence / observed result |
| --- | --- |
| V01 | Persisted mapping unit test; actual full-source Bash fresh/reinstall with four Go packs; local integration two upgrades. |
| V02 | Mocked apply/same-version retry uses stored packs only; new detected/bundled rows do not add update selections. |
| V03 | Full-source integration keeps customized pack bytes and old baseline through v2/v3 while safe siblings update. |
| V04 | Legacy valid metadata/installedAt preserved by reinstall; absent selections and ownership are conservative, no directory inference. |
| V05 | Identical unowned files and marker-only legacy adapter stay unowned through repeats. |
| V06 | Invalid registry/hash/source metadata and derived state reject before source writes. |
| V07 | Adapter copy fixtures preserve edited files and user descendants twice; safe copies advance. |
| V08 | Changed/broken links survive refresh/clean; recorded unchanged ownership drives normal symlink flow. |
| V09 | Escape/core-pack collision/source-alias and symlink guards; actual engine .cursor escape regression leaves only original target sentinels and outside unchanged. |
| V10 | Mocked ordered source generators, failure/missing Node and retry; phase status/exit results explicit; installer does not print unconditional completion. |
| V11 | Missing selected source keeps registry/files and records unavailable/partial. |
| V12 | Same-name differing/unowned trees remain; only fully owned equivalent trees prune; custom descendants prevent pruning. |
| V13 | Full integration and hooks/index tests preserve custom index, edited hook, added group and unknown settings twice; no baseline adoption. |
| V14 | CONTEXT/env/custom skill/accepted ADR/baseline, removed upstream file and custom legacy script/cache kept across repeated updates. |
| V15 | 13 app scripts/card guide removed; generic plan parses, script syntax and template paths valid. |
| V16 | Canonical catalog byte mirror tests; bundled Archify row has one owner/local runtime; customized runtime copies follow keep rule. |
| V17 | Five diagrams + demo render from retained JSON to temp output; installed runtime demo also succeeds without shipped HTML. |
| V18 | Source distribution exclusions tested; 53 prior feature/ADR artifacts (excluding the updated feature index) and current signed baseline match pre-change hashes. |

## Cleanup and preserved history

[Exact removal inventory](implementation/cleanup-inventory.json): 12 app capture
scripts, one extension helper, one prefilled card guide, five generated example
HTMLs, five duplicate JSONs and two duplicate references. Total 26 files /
4,096,850 bytes. Kept runtime renderer templates/JSON and generic screenshot tools.
No automatic removal from existing customer projects.

Pre-change snapshot path is recorded in
[pre-change-snapshot.txt](implementation/pre-change-snapshot.txt). All 53 prior
feature/ADR source artifacts excluding the feature index are byte-identical; current
signed baseline unchanged. The feature index was intentionally updated for Gate 4.

## Review and limits

Independent [Round 1](implementation/review-round-1.md) identified REL-001 (High,
Windows path separators) and SPEC-001 (Medium, adapter preflight timing). Both
were corrected with red-to-green regressions. Independent [Round 2](implementation/review-round-2.md)
APPROVE confirms both RESOLVED and no new findings. Zero unresolved Critical,
High or Medium findings.

PowerShell runtime was unavailable: 3 cases SKIP, not PASS. Windows separator
semantics have a simulated Node regression; that does not replace actual Windows
or pwsh execution. Generic screenshot validation covered syntax/plan/resources,
not a browser capture against an unrelated running application. Remote apply used
mocked fetch/clone, never live customer projects. Safe writes are atomic per file,
not globally transactional; conflicts/legacy unverified outputs can remain partial
by design and are reported rather than silently overwritten.
