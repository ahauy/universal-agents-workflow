# Protocol and template slice

## Delivered

- Canonical .agents/docs/production-lifecycle.md (114 lines): preparation/readiness/deployment/verification/recovery anchors; separates development completion, readiness, verified production and blocked/failed/rolled-back outcomes.
- operations-template.md (53 lines): stable target docs/OPERATIONS.md, verified commands/config references, ownership and applicable data recovery evidence.
- release-template.md (68 lines): per-version identity-bound evidence, authorization/attempt results, post-deploy checks and recovery record.

## Requirements

REQ-PROD-001/002 and BR-PROD-001..004: on-demand release scope only; existing skills, no executable deploy/new runtime; exact candidate/environment/config evidence; required missing/failed/skipped checks block; justified N/A; no secret values; no implicit production authorization; actual post-deploy proof and realistic data recovery. Copy only when missing; patch/append existing custom documents without clobbering history.

## Verification

Concrete relative Markdown links resolve. No template prechecks success. Owned whitespace check passed. Semantic end-to-end scenarios and update-preservation suites belong to coordinator validation; no real deployment was run. No Git writes or customer/global mutations.

## Integration clarification

Deployment now explicitly requires current RELEASE_READY and a fresh identity/evidence validity check before any production write; authorization cannot override BLOCKED readiness. Post-deploy Critical findings remain unacceptably blocking, and new High findings require a fix or explicit specific owner risk acceptance before PRODUCTION_VERIFIED. Corresponding release-template fields record both checks.
