# Operations: <product>

> Target: `docs/OPERATIONS.md`. Create only if missing; otherwise patch confirmed
> affected sections and preserve custom content. Replace placeholders from actual
> project evidence. Unknowns stay `ASM-`/`BLOCKED`, not executable defaults.
> Protocol: `.agents/docs/production-lifecycle.md`. Read relevant sections only.

## Ownership and environments

- Responsible owner/contact: <confirmed role and escalation route>
- Environments/hosting: <actual targets and non-secret references>
- Environment/configuration revision source: <where versioned/retrieved>
- Production authorization: <who may approve, scope and where evidence is recorded>

## Build, checks and acceptance

- Build/test/lint/typecheck commands: <verified commands and working directories>
- CI configuration/results: <existing pipeline reference or unresolved requirement>
- Staging or agreed alternative: <procedure and applicability>
- UAT/business AC: <source and how acceptance is recorded>
- Required smoke/health/log/alert checks: <targets, commands and confirmed criteria>

## Configuration and secrets

| Name/reference | Target and purpose | Secure location/access owner | Verification |
| --- | --- | --- | --- |
| <name only> | <environment/use> | <reference, never value> | <check, no disclosure> |

## Deployment

- Candidate identity: <immutable artifact/commit and how serving identity is checked>
- Verified deployment procedure: <actual commands/runbook and working directory>
- Order/dependencies/cutover constraints: <confirmed details or justified N/A>
- Post-deploy verification: <checks above, responsible owner and evidence location>

## Data changes, backup and recovery

- Applicability: <state/data affected, or explicit N/A reason>
- Migration compatibility/order: <actual supported code/schema combination>
- Backup/restore: <procedure, retention/access, restore evidence and freshness needs>
- Recovery goals: <confirmed acceptable data loss/downtime; unresolved if unknown>
- Failure triggers and recovery path: <rollback, forward-fix or restore procedure>
- Recovery authorization and validation: <scope, responsible owner, smoke/data checks>

Do not infer reversibility from a down migration or call a backup restorable
without evidence. Keep secret values out of this document and its linked logs.

## Release evidence

Use `docs/releases/<version>.md` for version-specific scope, candidate/target,
authorization, results and recovery attempts. Keep this runbook stable; update
only when the confirmed procedure or ownership changes. Existing guides/images,
custom scripts and accepted historical decisions remain untouched.
