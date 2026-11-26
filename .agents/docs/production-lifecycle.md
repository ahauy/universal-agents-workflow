# Lean production lifecycle

Read only the section needed for a selected release or operations task. Feature
work keeps its Fast/Full gates; this protocol adds no per-task release ceremony.
`/continue` completes development scope and `/command-git-push` publishes commits.
Neither deploys a product nor proves that production is working.

| State | Evidence required |
| --- | --- |
| `DEV_COMPLETE` | Applicable feature AC, tests/review and lane documentation passed. |
| `RELEASE_READY` | The candidate has passed all applicable required readiness checks below. |
| `PRODUCTION_VERIFIED` | Authorized deployment occurred and required post-deploy checks passed for that candidate and target. |
| `BLOCKED` | A material decision, authorization or required readiness evidence is missing/failed/skipped, or required post-deploy evidence is missing/skipped. |
| `FAILED` | Deployment or required post-deploy verification failed; record the actual serving state. |
| `ROLLED_BACK` | Recovery restored the confirmed prior state and its required checks passed; the failed candidate is not production-verified. |

These labels are recorded evidence, not an executable state machine. Keep prior
outcomes in the release record; do not rewrite a failed attempt as success.

## Preparation

1. Reuse confirmed backlog/AC, manifests, existing CI/deployment configuration and
   prior decisions. Discover the actual hosting, environments, build/test/deploy
   commands, health targets and responsible owner. Record material unknowns as
   `ASM-`/`BLOCKED`; never invent a provider, command, URL or success threshold.
2. Create `docs/OPERATIONS.md` from the [operations template](../../.specify/templates/operations-template.md)
   only if absent. Otherwise update only confirmed affected sections, preserving
   custom instructions, links and accepted decisions. Keep it stable across releases.
3. For a selected version, create `docs/releases/<version>.md` from the
   [release template](../../.specify/templates/release-template.md) only if absent.
   Otherwise append the current attempt/evidence without overwriting prior results.
   Record an immutable candidate identifier, target environment and configuration
   revision. Link existing test results instead of duplicating their contents.
4. Use existing planning/review/documentation skills; `wizard` is for an actual
   authorized manual procedure, not an automatic extra artifact. Configure real
   CI/CD only for the confirmed project stack/host when in scope. This framework
   supplies no executable deployment pipeline or invented vendor defaults.

## Readiness

Scope each check as required or `N/A` with an explicit applicability reason.
Missing/failed/skipped required checks block `RELEASE_READY`; unknown evidence is
not `N/A`. Reuse evidence only when it matches the candidate, relevant environment
and configuration, and no subsequent change invalidates it. Re-run affected checks
after code, dependency, migration, configuration or environment drift.

- Build, relevant tests/lint/type checks and configured CI pass. Establish which
  checks are required for this release; absent CI does not count as passing CI.
- Staging verification, or an explicitly agreed evidenced alternative appropriate
  to the product, passes. UAT covers the agreed user/business acceptance criteria.
- Required configuration and secret references are available for the target;
  document names/locations and verification outcomes, never secret values.
- Migration order, compatibility and recovery are established when state/data is
  affected. Backup freshness, retention/access and actual restore evidence meet
  the confirmed recovery needs. A backup file alone is not proof of restorability.
- Deployment owner, operational contact, health/smoke checks and relevant logs/
  alerts are known. Recovery triggers and procedure are usable for this candidate.
- Zero unresolved Critical findings. Fix High findings or record explicit owner
  acceptance with the specific risk; acceptance cannot waive a required failed
  check or label an unverified candidate successful.

Readiness is not deployment authorization. Record `RELEASE_READY` only with linked
passing evidence; any invalidating change requires a new readiness decision.

## Deployment

Before a production write, require current `RELEASE_READY` and recheck that its
evidence still matches the candidate, environment and configuration with no
invalidating changes. `BLOCKED` readiness cannot be overridden by authorization.
Then verify explicit authorization covers the candidate,
target and operation. Reuse matching authorization already given; ask only if it
is missing or the scope changed. Approval to improve this framework, complete a
feature, push Git or mark release readiness does not authorize a live deployment.

Execute the confirmed project procedure, recording who/when, candidate, target,
configuration and result. Do not expose secrets in commands/logs. A successful
deploy command proves execution only; proceed to verification before claiming
production success. An interrupted or failed attempt records `FAILED` and the
observed serving/data state, not an assumed rollback or completed deployment.

## Verification

For the actual deployed candidate and target, run the agreed smoke journey and
health checks, inspect relevant logs/alerts and verify migrations/configuration
where applicable. Record commands or check references, timestamps and results.
Missing, skipped or failed required checks cannot yield `PRODUCTION_VERIFIED`.
Source review, a successful push or staging evidence alone cannot substitute.
Missing/skipped post-deploy evidence records `BLOCKED`; failed checks record
`FAILED`. Newly discovered Critical findings also prevent a success verdict.
Fix newly discovered High findings or obtain explicit owner acceptance of the
specific risk before `PRODUCTION_VERIFIED`; Critical findings cannot be accepted.

Only after these checks pass record `PRODUCTION_VERIFIED`, the owner/contact and
any agreed observation/follow-up. A post-deploy failure records `FAILED`, impact
and recovery action; do not keep the candidate's success label to hide that result.

## Recovery

Use the confirmed rollback, forward-fix or restore procedure appropriate to the
actual change. Do not assume a database migration is reversible or that reverting
an application restores data. Confirm compatible code/schema, backup restore point,
permitted data loss/downtime and required authorization before destructive actions.
If recovery is unknown or unauthorized, escalate to the responsible owner rather
than improvise. Contain impact only within the authority already granted.

Record recovery execution and verify the intended serving/data state with its
required smoke/health checks. Verified restoration of the prior state is
`ROLLED_BACK`; otherwise keep `FAILED` and the outstanding incident/blocker. A
forward fix is a new candidate requiring its applicable readiness/deploy checks.
Retain failed attempts, incident notes and evidence without leaking secrets.

## Document boundaries

Never purge or regenerate customer operations/release documents, guides, images,
scripts, skills or settings to match these templates. Signed requirements and
accepted ADRs remain immutable. User-guide production stays text-only and runs
only when requested or selected for release documentation. UI/E2E verification
retains its own evidence requirements. Read the two documents by relevant section;
the templates introduce neither a new skill nor a runtime/dependency.
