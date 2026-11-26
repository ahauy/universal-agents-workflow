# Acceptance evidence: BA-first UAW

Date: 2026-11-26. Gates 1/2 approved. Implementation and checks complete;
independent Round 2 returned APPROVE with both findings resolved and no open Critical.

## Acceptance cases

| Case | Evidence / outcome |
| --- | --- |
| TC-001 | Concise outcome/behavior/scope/evidence/unknown/AC checkpoint in AGENTS and intake; clear existing work stays Fast, one context, no Full artifacts. Semantic path reviewed. |
| TC-002 | T7 covers new/unresolved business behavior irrespective of small diff; no implementation with unresolved business decisions. Semantic path reviewed. |
| TC-003 | T1-T7 govern small roadmap stories; auth/PII/schema/entity triggers remain Full. Legacy template effort routing removed; SPEC-001 independently resolved in Round 2. |
| TC-004 | BA/intake/backlog/continuation reuse confirmed evidence and ask only material gaps. No forced re-interview. Semantic path reviewed. |
| TC-005 | Backlog elicits domain goals/journeys/rules/edge behavior before stories/AC. Corrected template uses evidence/unknown placeholders instead of exclusions, scores or stack defaults; SPEC-002 independently resolved in Round 2. |
| TC-006 | Blocked decisions retain [!]/T5 and dependencies require [x]; template continuation defers to canonical rules. Semantic path reviewed. |
| TC-007 | Short question batches have no fixed total cap; unanswered business facts stay ASM-, never guessed. Semantic path reviewed. |
| TC-008 | Business consistency precedes baseline; native technical consistency requires actual requirements/spec/plan/tasks and signed-off baseline. Semantic path and native forward exercise reviewed. |
| TC-009 | Isolated forward exercise produced draft technical spec, plan and tasks on a complete synthetic fixture, with explicit pending Gate 2. Incomplete/contradictory ASM fixture stopped before downstream artifacts. No application code or test-pass claims were produced. |
| TC-010 | Four native skills and ten local migration stubs exist; registry has no executable SpecKit workflow. Three structural regressions and all four skill-authoring validations pass. |
| TC-011 | 9 hot entries retained. Metadata before/after: 1480/1465 characters (~370/~366 estimated tokens). 57/61 cold skills; planning entry text 113302/14481 characters. These are configuration/text measurements, not actual billed token usage or monetary savings. |
| TC-012 | Installer: 7 passed, 3 pwsh skips. Hooks: 21 passed. Full-source local fresh/reinstall checks pass with 4 native skills, 10 aliases, valid catalog and protected user content/history/metadata. |

## Verification detail

- Standard-library workflow checks: 3 passed, after an observed initial 3 failures.
- Native skill quick_validate: all four passed. Catalog: 9 hot + 61 cold, no drift.
- Agent contract validator: 25 agents / 102 instruction files, no findings.
- Bash and changed JavaScript syntax checks passed; git diff --check passed.
- Full-source temporary install/reinstall retained user instructions/context,
  signed baseline, customer-owned legacy reference note, installedAt and manifest entry.
- After the roadmap correction, another fresh-install check copied the corrected
  template byte-for-byte, retained all four native skills and passed catalog validation.
- Installer/update-engine, external MCP configuration, prior accepted ADRs and
  signed download-only feature history are unchanged. Mirrored catalogs changed
  only the native scaffold description; all other catalog entries are unchanged.
- New template links are relative to their instantiated feature directory;
  those links resolve against actual feature artifacts rather than the template folder.

## Evidence and limits

implementation/slice-a-report.md records TC-001..008 semantic decision paths.
implementation/forward-test-report.md records an independent isolated planning
exercise; a temporary context-pack setup collision was corrected and input hashes
reconciled. This is limited observed agent behavior, not certification of every
future response. implementation/review-round-1.md preserves the initial findings;
the current verdict and resolution tracker belong in review-report.md.

PowerShell execution is skipped because pwsh is absent. Remote download services,
publication and live external harnesses were not exercised. Actual token/billing
usage is unavailable in existing telemetry; no financial saving is claimed.
No Git staging, commit, push, external account writes or new runtime installation.

## Delivery gates

Round 1 identified SPEC-001 (High) and SPEC-002 (Medium) in an old active roadmap
template. Both were corrected within the approved template scope. Incremental
Round 2 verified routing, neutral placeholders, schema/story fields and whitespace;
verdict APPROVE, no open findings. The original report is retained in
implementation/review-round-1.md and the resolution tracker is in review-report.md.
Feature README.md is indexed from ../README.md. Gates 3 and 4 are satisfied.
