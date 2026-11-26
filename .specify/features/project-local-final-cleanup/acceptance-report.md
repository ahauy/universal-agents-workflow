# Acceptance: project-local final cleanup

**Date:** 2026-11-26. **Status:** acceptance checks passed; independent Round 1 APPROVE.

## Changes and scope

Owner approved final-audit corrections, group A/B removal and complete active
visual-tool removal. Source cleanup removed 114 files / 3,560,531 bytes: bundled
and optional runtime/resources, global-sync script, approved local cache/duplicate
active metric/old handoff. Mermaid remains the diagram format. Historical baseline,
ADR and acceptance content is not rewritten. ADR 0005 supersedes the prior active
retention decision. No installed global tools or real customer files were removed.

Onboarding uses verified source engine/registry/catalog mappings; cold remains cold.
Verification branches Fast/Full and permits diagnostic tests without inventing a
baseline. Rule links are valid both in source and flattened deployment. Screenshot
commands derive actual app setup and fail honestly; annotations are a separate
browser/image step, not a capability falsely promised by the generic script.
Hook tests now use a temporary workspace/cache instead of deleting the real cache.

## Executed evidence

| Suite / command from repo root | Outcome |
| --- | --- |
| python3 .agents/scripts/test/test-distribution-cleanup.py | 3 pass |
| python3 .agents/scripts/test/test-installers.py | 9 pass; 3 pwsh skips |
| python3 .agents/scripts/test/test-local-instructions.py | 4 pass |
| python3 .agents/scripts/test/test-update-engine.py | 19 pass |
| python3 .agents/scripts/test/test-update-integration.py | 2 pass |
| python3 .agents/scripts/test/test-workflow.py | 3 pass |
| node --test .agents/scripts/test/test-derived-updates.mjs .agents/scripts/test/test-catalog.mjs .agents/scripts/test/test-capture-screenshots.mjs | 22 pass |
| node .agents/scripts/test/test-hooks.js | 22 pass |
| node .agents/scripts/build-skill-index.mjs --check | 9 hot / 60 cold, valid |
| python3 .agents/scripts/validate-agents.py | 25 agents / 100 instructions, zero errors/warnings |
| bash -n install.sh | pass |

Total **84 test cases/assertions passed; 3 skipped**. Index/syntax/agent validation
are additional. Python captured output: [python-results.json](implementation/python-results.json).
Initial removal assertions failed on present runtime/cache; screenshot fixtures
first failed five cases; instruction tests first exposed lane/link/setup drift.
These were corrected and the corresponding checks passed afterward.

## Data preservation and traceability

[test-plan.md](test-plan.md) maps all five requirements to evidence. Full integration
runs two upstream revisions with customized pack, marker adapter, index, edited and
added hook groups/settings, local cache, signed feature/domain data and legacy old
tool/helper files; their bytes remain and kept baseline hashes do not advance.
Untouched source siblings still update. Actual full-source Bash Go install and
reinstall keep four confirmed packs and custom CONTEXT. No live network apply was run.

All 78 prior feature/ADR artifacts excluding their mutable indexes are byte-identical
to the pre-change snapshot. See [history check](implementation/history-check.json)
and [snapshot location](implementation/pre-change-snapshot.txt). Approved group A
paths remain absent after tests; no real cache was recreated.

## Review and limitations

Independent [Round 1](implementation/review-round-1.md) APPROVE: zero findings
across standards/security, specification fidelity and lean passes; zero unresolved
Critical findings. No runtime/dependency installed, global config
changed, or Git add/commit/push performed. Per-file atomic updates remain safely
retriable, not a global transaction. PowerShell runtime is absent; Windows execution
is not certified by skipped tests. Mocked browser tests verify error/cleanup flow,
not live UI screenshot appearance. Historical documents may retain retired tool
names as immutable evidence; there are no positive active runtime/catalog/doc routes.
