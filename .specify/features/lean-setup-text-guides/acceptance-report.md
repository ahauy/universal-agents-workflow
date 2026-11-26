# Lean setup and text guides acceptance

Date: 2026-11-26
Status: automated suites passed; independent Round 2 APPROVE, zero open findings.

## Delivered

Source inventory is 50 identities (9 hot/41 cold). Setup/onboarding is owned by command-skill-setup through an on-demand reference; agent-authoring guidance is a technical-documentation reference; debt ledger is ponytail-review debt. wait-what is unchanged. A text-only user-guide replaces user-guide-with-screenshots. command-user-guide is a 23-line router. Source capture script, plan, screenshot setup/template and seven obsolete capture-only tests are removed. Documentation, catalog mirrors, generator, agents/declarations, shipping advisory and verification gate now use text-guide behavior on request or release need. UI review/E2E evidence rules remain separate.

## Executed evidence

| Suite | Passed | Skipped |
| --- | --- | --- |
| test-distribution-cleanup.py | 4 | 0 |
| test-installers.py | 9 | 3 |
| test-local-instructions.py | 4 | 0 |
| test-update-engine.py | 19 | 0 |
| test-update-integration.py | 2 | 0 |
| test-workflow.py | 3 | 0 |
| test-derived-updates.mjs + test-catalog.mjs | 15 | 0 |
| test-hooks.js assertions | 22 | 0 |
| Total | 78 | 3 |

Additional checks: source index 9 hot/41 cold, runtime/authority catalog byte equality, validate-agents zero errors/warnings, Bash syntax, diff whitespace and concrete local Markdown links. Initial updated workflow tests correctly failed before retirement (53 instead of 50 and old setup skill present); consolidated source passes. An active-route regression test guards against old capture-owner instructions, including verification-before-completion.

## Data preservation

The integration fixture installs synthetic older source trees for 20 retired identities (16 from the prior feature plus four current), customizes alternate installed copies, removes source trees, then performs two updates. Unchanged/modified old skills and their original hashes survive. Customized new user-guide and wait-what survive without provenance adoption; custom guide text and its old image reference, PNG bytes, legacy capture scripts, domain/ADR/cache, optional pack, adapter, index and settings/hooks survive. Untouched source siblings still update. Fresh Bash install/reinstall verifies new guide owner present and retired identities absent while preserving CONTEXT and four confirmed Go packs. The updater/installer implementation and zero-deletion policy are unchanged.

All 120 previous feature/ADR artifact contents (excluding mutable indexes) and wait-what are byte-identical to the pre-change snapshot. See [preservation evidence](implementation/preservation-check.json). Existing customer guides/images/scripts are never purged; existing installations may retain more than the fresh-source skill count.

## Review and limits

Independent [Round 1](implementation/review-round-1.md) identified High R1: the retained Git skill still rejected text-only guides and the PR checkbox still triggered on every UI change. A focused regression first failed on that gate; the narrow correction passed 4/4 and independent [Round 2](implementation/review-round-2.md) APPROVE resolved R1 with zero new/open findings. No Critical findings.

Three PowerShell cases skipped because pwsh is unavailable; actual Windows execution is not certified. Source/synthetic local fixtures do not certify live customer upgrades. Existing explicitly selected missing source packs remain reported unavailable/partial rather than silently deleted or migrated. No actual browser/app launch for guide generation, new dependency, home/global config change, commit or push was performed. No provider-token or monetary-saving claim is derived from source size.

[Feature guide](../../../docs/features/lean-setup-text-guides/README.md) · [Test plan](test-plan.md) · [Review](implementation/review-round-1.md)
