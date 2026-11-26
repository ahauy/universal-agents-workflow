# Lean production lifecycle acceptance

Date: 2026-11-26
Status: verification passed; independent Round 1 APPROVE with zero open findings.

## Delivered

Kept 50 skills (9 hot/41 cold). Added one on-demand canonical release protocol and exactly two reusable templates: operations-template.md -> docs/OPERATIONS.md, release-template.md -> docs/releases/<version>.md. Existing planning, verification, documentation, continuation/backlog and code-delivery instructions distinguish DEV_COMPLETE, RELEASE_READY and PRODUCTION_VERIFIED. Required applicable evidence, candidate/target/config identity, current readiness and matching operational authorization gate deployment. Failed/missing/skipped verification cannot produce a success claim; recovery needs actual serving/data evidence. No per-task release artifacts or automatic deploy from /continue/push. No actual product commands/platform defaults or executable state machine were introduced.

## Verification evidence

| Suite | Passed | Skipped |
| --- | --- | --- |
| test-production-lifecycle.py | 4 | 0 |
| test-distribution-cleanup.py | 4 | 0 |
| test-installers.py | 9 | 3 |
| test-local-instructions.py | 4 | 0 |
| test-update-engine.py | 19 | 0 |
| test-update-integration.py | 2 | 0 |
| test-workflow.py | 3 | 0 |
| test-derived-updates.mjs + test-catalog.mjs | 15 | 0 |
| test-hooks.js assertions | 22 | 0 |
| Total | 82 | 3 |

Additional checks: source catalog index 9 hot/41 cold and mirror equality, agent validator zero errors/warnings, Bash syntax, concrete local Markdown links and diff whitespace. New source contracts initially failed before protocol/templates/core routes existed, then passed.

[Sixteen manual scenarios](implementation/scenario-review.md) cover ordinary Fast completion, push-only evidence, required check failure/skip, candidate/config drift, reasoned N/A, matching/missing authorization, actual post-deploy checks and verified/failed recovery. These are synthetic instruction decisions reviewed against the protocol, not live deployment simulations or automated executable gate enforcement.

## Preservation

Two actual local update revisions preserve custom docs/OPERATIONS.md and docs/releases/1.2.3.md, customized release template and its last-written hash, as well as existing retained/retired skills, text guide/image/script, pack, adapter/index/hooks/settings/domain fixtures. Untouched source siblings update. Fresh full-source Bash install/reinstall ships both templates without instantiating fictional operations/release documents; custom CONTEXT and confirmed Go pack selections persist. No updater/installer deletion-policy implementation changed.

All 145 previous feature/ADR contents (excluding mutable indexes) and wait-what match the pre-change hashes. See [preservation check](implementation/preservation-check.json). Existing customer runbooks, release attempts and secret references must be patched surgically without overwriting history; secret values never belong in documents.

## Review and limits

Independent [Round 1](implementation/review-round-1.md) APPROVE: zero actionable findings across standards/security, fidelity and lean passes. All 16 manual scenarios independently checked against the protocol. Reviewer independently reran 21 passing tests plus 3 PowerShell skips and inspected the roadmap-link correction.

Three PowerShell cases skipped because pwsh is unavailable; actual Windows execution is not certified. No real CI/CD, cloud/staging, UAT, smoke/monitoring, backup restore or production deployment was executed. Those need the actual product's stack/hosting, commands, responsibility, authorization and evidence. This change supplies a lean instruction/template contract, not an automatic deployment runtime. No new skill/dependency/global configuration, Git commit or push performed. No monetary/token savings are inferred from document size.

[Feature guide](../../../docs/features/lean-production-lifecycle/README.md) · [Independent review](implementation/review-round-1.md)
