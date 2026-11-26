# 0008: Release evidence and production boundaries

Status: Accepted
Date: 2026-11-26
Authority: owner approved the proposed lightweight dev-to-production extension.

## Decision

Keep the existing 50 skills and Fast/Full feature gates. Canonical production-lifecycle.md defines DEV_COMPLETE, RELEASE_READY and PRODUCTION_VERIFIED with candidate/target/config-bound evidence, required-check blockers, matching operational authorization and verified failure/recovery outcomes. Existing skills route to applicable sections on demand. Add only operations-template.md for docs/OPERATIONS.md and release-template.md for docs/releases/<version>.md. No release artifact per ordinary task and no executable vendor CI/deploy pipeline in this framework change.

## Consequences

Code push proves no deployment. Real project CI/CD, UAT, monitoring and recovery require actual commands/platforms and evidence. Existing matching authorization is reused; framework approval never authorizes production mutation. Required failed/missing/skipped evidence blocks, Critical cannot be waived, and rollback needs actual serving/data recovery checks. Target operations/release documents, customized templates and earlier accepted artifacts remain protected by the unchanged updater. This extends prior BA-first and text-guide decisions; it does not rewrite them or add new runtime/global configuration.
