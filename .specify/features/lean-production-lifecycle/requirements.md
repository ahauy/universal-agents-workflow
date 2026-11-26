# Requirements

## 1. Context
The framework covers BA through code delivery, but push is not production deployment. Add small release/operations controls without per-task ceremony.

## 2. Behavior
BR-PROD-001: Separate DEV_COMPLETE, RELEASE_READY and PRODUCTION_VERIFIED; pushed commits alone prove none of the operational outcomes.
BR-PROD-002: Applicable required checks need passing evidence for the candidate and target. Missing/failed/skipped required checks block readiness; N/A needs an explicit applicability reason. No unresolved Critical; High requires fix or explicit owner risk acceptance.
BR-PROD-003: Never deploy or run destructive recovery from framework approval alone. Reuse matching prior operational authorization; ask only if missing. State/data recovery must be valid for actual migrations and backup evidence; never promise generic rollback.
BR-PROD-004: Preserve custom operations/release docs, images, skills, settings and accepted history. No secret values in documentation.

## 3. Requirements
REQ-PROD-001: Document concise release flow using existing skills only, on demand.
REQ-PROD-002: Supply operations-template.md and release-template.md for target docs/OPERATIONS.md and docs/releases/<version>.md. Do not instantiate fictional product commands/URLs/platform defaults.
REQ-PROD-003: Integrate verification, planning, roadmap/status, shipping wording and technical documentation; no automatic production execution from /continue or push.
REQ-PROD-004: Verify scenarios, active links/catalog, unchanged Fast/Full behavior and two-update custom-data preservation.

## 4. Acceptance criteria
- Still 50 skills (9 hot/41 cold), no new runtime/dependency or specific vendor CI deployment.
- Release preparation covers actual build/test/CI, staging or evidenced alternative, UAT against agreed AC, config/secrets references, owner/responsibility, migration/backup/recovery when applicable.
- DEV_COMPLETE remains feature scope; RELEASE_READY needs applicable evidence; authorized deployment plus actual post-deploy smoke/health/log/alert checks for the exact candidate/target yields PRODUCTION_VERIFIED. Failed production checks cannot report success; record FAILED or ROLLED_BACK with verified recovery.
- Reuse evidence only for matching candidate/environment/config with no invalidating changes; required missing/failed/skipped evidence blocks, not N/A by convenience. Unknown commands/hosting remain ASM-/BLOCKED until established.
- Exactly two new reusable lifecycle templates; OPERATIONS stable, release record per release, only relevant sections read, user-guide text-only remains optional.
- Template/source updates preserve existing custom operations/release data, domain docs/skills/hooks/settings and prior accepted history. All relevant checks pass; skips/limits truthful.
