# Acceptance evidence: Download-only distribution

Date: 2026-11-26. Implementation checks complete; independent review APPROVE.
Baseline v1.0 and Gate 2 were explicitly approved by the owner.

## Case results

| Case | Result | Evidence |
| --- | --- | --- |
| TC-001 | PASS | packages/mcp-server is absent, including package-only dependencies and output. The distribution regression failed while it existed and passes after removal. |
| TC-002 | PASS | Before/after SHA-256 matches for .agents/mcp_config.json and both optional integration catalogs; no external MCP configuration was removed. |
| TC-003 | PASS | Actual fresh installation and reinstall from the full current source into a temporary project both exit 0. Six required local artifacts/skills and WorkBuddy guidance are present; no UAW MCP package is installed. |
| TC-004 | PASS, semantic review | Complete confirmed inputs require all eight quality criteria, applicable substantive scenarios and an evidence-backed matrix; headings/keywords alone cannot satisfy a pass. |
| TC-005 | PASS, semantic review | Missing requirements, unreadable elicitation, empty domain evidence and placeholder-only risk records explicitly block validation. Unsupported checks are BLOCKED and overall result is FAIL. |
| TC-006 | PASS, semantic review | Unconfirmed/conflicting ASM blocks; unrelated unfinished task boxes do not become assumptions. Confirmation evidence is required. |
| TC-007 | PASS, semantic review | Missing substantive acceptance scenarios or applicable REQ-to-story coverage forces FAIL with affected IDs. |
| TC-008 | PASS, semantic review | Duplicate definitions, missing/wrong-type upstream targets and broken links force FAIL; references are distinguished from definitions. |
| TC-009 | PASS for available runtime checks | Installer suite: 10 cases, 7 passed and 3 skipped because pwsh is absent. Existing hooks: 21 passed. Bash and adapter JavaScript syntax checks passed. |
| TC-010 | PASS | Active UAW setup references are absent from guidance; remaining package-name assertions are negative regression tests. Generated WorkBuddy guidance uses local artifacts. Old ADR hash is unchanged; ADR 0003/index records succession. |

## Data preservation

- SHA-256 comparisons verify both installers, accepted ADR 0002 and the three
  third-party integration/config catalogs are unchanged from the start of this task.
- Hash comparisons verify 23 unrelated pre-existing modified/untracked files
  remain unchanged, including earlier user workflow edits.
- Actual reinstall preserves customized AGENTS.md and CONTEXT.md, a pre-existing
  SIGNED-OFF v1.0 baseline, installedAt and an existing manifest entry.
- Local fresh/reinstall checks also verify installed skills and generated adapter
  guidance. They do not execute a remote installer or publish changes.

## Reproducible checks

```text
python3 .agents/scripts/test/test-installers.py
node .agents/scripts/test/test-hooks.js
bash -n install.sh
node --check .agents/scripts/sync-harnesses.mjs
python3 .agents/scripts/validate-agents.py
node .agents/scripts/build-skill-index.mjs --check
git diff --check
```

Full-source smoke checks invoke install.sh --target <temporary-project> --mode
team -y, assert local artifacts, customize user content, then reinstall and
compare content hashes/metadata. Temporary output is not shipped.

## Limits

TC-004..TC-008 review decisions prescribed by a prompt, not an executable
validator or every future agent response. Variations and evidence locations
are in implementation/slice-b-report.md. No automatic IEEE certification is
claimed. PowerShell runtime was unavailable; skips are not counted as passes.
Remote download services and package publication were not exercised. Removing
local source does not unpublish npm or modify external client registrations.

## Final review and delivery gates

Independent standards/security, fidelity and lean review returned APPROVE with
no actionable findings. The reviewer independently reran installer regressions,
hooks, syntax, whitespace and temporary WorkBuddy generation; full-source smoke
and preservation hashes above are coordinator evidence, not reviewer reruns.
See review-report.md. Feature README.md exists and is indexed in
../README.md, satisfying Gate 4. No unresolved Critical finding remains.
