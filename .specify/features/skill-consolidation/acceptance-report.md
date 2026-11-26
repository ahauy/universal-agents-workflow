# Skill consolidation acceptance

Date: 2026-11-26
Status: Implemented and verified; independent Round 1 APPROVE.

## Delivered

Reduced 69 source skill identities to 53 (9 hot / 44 cold). Removed ten SpecKit migration aliases, standalone gain/help utilities, the route/audit aliases and two duplicate UI owners. Preserved useful behavior in skills-index, ponytail-review with diff/repository scopes, retained marketing/product design owners and one selectively loaded shared reference. Help moved into documentation. wait-what source remains byte-identical. Catalog authority/runtime mirror, generator, agents, guides, links and regression tests are synchronized. ADR 0006 supersedes source-alias retention without editing ADR 0004.

## Executed verification

| Suite | Passed | Skipped |
| --- | --- | --- |
| test-distribution-cleanup.py | 3 | 0 |
| test-installers.py | 9 | 3 |
| test-local-instructions.py | 4 | 0 |
| test-update-engine.py | 19 | 0 |
| test-update-integration.py | 2 | 0 |
| test-workflow.py | 3 | 0 |
| test-derived-updates.mjs | 12 | 0 |
| test-catalog.mjs | 3 | 0 |
| test-capture-screenshots.mjs | 7 | 0 |
| test-hooks.js assertions | 22 | 0 |
| Total | 84 | 3 |

Additional checks: generated index 9 hot/44 cold; mirror byte equality; validate-agents 25 agents/86 instruction files with zero errors/warnings; Bash syntax; diff whitespace; 50 concrete local Markdown links (zero broken). Independent reviewer reran inventory/index, catalog, workflow and update integration checks and approved standards/security, spec fidelity and lean passes with zero findings.

## Custom data and historical preservation

The integration fixture first installs synthetic old source trees for all 16 retired identities, modifies alternate customer copies, then removes source trees and applies two subsequent revisions. Both untouched owned and modified legacy copies survive with original last-written hashes. Customized wait-what, optional pack, adapters, index, settings/hooks, domain documents, cache and previously retired components survive; unrelated source siblings update. Fresh Bash source installation/reinstallation confirms retired identities absent and wait-what present while preserving CONTEXT and four Go selections. No updater/installer deletion behavior changed.

All 99 previous historical feature/ADR contents (excluding mutable indexes) are byte-identical. See [preservation evidence](implementation/preservation-check.json). Source wait-what is also byte-identical. Signed historical documents can mention retired names as immutable point-in-time evidence. Existing installed projects may retain more skills than the new source count; source cleanup never authorizes purging local data.

## Limits

Three PowerShell cases skipped because pwsh is unavailable; actual Windows execution is not certified. Updates were exercised only in temporary local fixtures, not real customer projects. Existing selected packs whose source disappears remain reported unavailable/partial rather than deleted. No home/global config, new dependency, Git commit or push performed. No monetary/token savings claim is inferred from skill count.

[Feature guide](../../../docs/features/skill-consolidation/README.md) · [Independent review](implementation/review-round-1.md)
