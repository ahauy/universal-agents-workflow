# Release: <version>

> Target: `docs/releases/<version>.md`. Create only if absent; otherwise append
> evidence/attempts without rewriting history or custom content. Replace placeholders
> with confirmed facts. Protocol: `.agents/docs/production-lifecycle.md`.
> Required checks need passing evidence; unresolved or skipped required checks block.

## Identity and scope

- Current state: <DEV_COMPLETE | RELEASE_READY | BLOCKED | FAILED | ROLLED_BACK | PRODUCTION_VERIFIED>
- Candidate: <immutable artifact/commit identifier>
- Target environment/config revision: <confirmed identity>
- Scope and AC/UAT source: <backlog/story links; no duplicated requirement text>
- Release owner / operational contact: <responsible role and escalation route>
- Operations runbook: <existing docs/OPERATIONS.md reference>
- Material unknowns/blockers: <ASM- ids and affected decisions, or none with evidence>

## Readiness decision

For each check, set applicability to required or N/A with a reason; record actual
PASS/FAIL/MISSING/SKIPPED evidence for required checks. No row is passed by default.

| Check | Applicability/reason | Result and evidence reference | Candidate/target/config and time |
| --- | --- | --- | --- |
| Build/tests/lint/typecheck/configured CI | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| Staging or agreed evidenced alternative | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| UAT against agreed business AC | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| Config/secret references available | <required or reasoned N/A> | <names/secure references only> | <identity/time> |
| Migration compatibility/order | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| Backup freshness/restore evidence | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| Recovery procedure/owner/checks | <required or reasoned N/A> | <actual result/link> | <identity/time> |
| Smoke/health/log/alert checks prepared | <required or reasoned N/A> | <actual result/link> | <identity/time> |

- Evidence reuse: <why prior evidence still matches; invalidating changes require recheck>
- Findings: <zero unresolved Critical; High fixes or explicit specific owner acceptance>
- Readiness outcome: <RELEASE_READY only if applicable required checks passed; otherwise BLOCKED>
- Decision owner/time/evidence: <actual decision; readiness does not authorize deploy>

## Deployment attempt <id>

- Readiness recheck: <current RELEASE_READY; evidence still matches candidate/target/config with no invalidating changes; BLOCKED cannot be overridden by authorization>
- Authorization: <existing explicit approval covering candidate/target/action; absent means no production write>
- Executor/time/candidate/target/config: <actual values>
- Execution/result: <verified procedure, command/result reference; no secret values>
- Observed serving/data state: <actual state, including partial/failed deployment>

## Post-deploy verification

| Required check | Actual candidate/target/config | Time, result and evidence |
| --- | --- | --- |
| Smoke journey and health | <deployed identity> | <actual result/link> |
| Relevant logs/alerts | <deployed identity> | <actual result/link> |
| Migration/config/data checks if applicable | <deployed identity or justified N/A> | <actual result/link> |

- Outcome: <PRODUCTION_VERIFIED only after actual authorized deployment and required checks pass; BLOCKED if evidence missing/skipped, FAILED if a check failed>
- New findings: <Critical blocks success and cannot be accepted; High fixed or explicit specific owner risk acceptance before PRODUCTION_VERIFIED>
- Owner/contact and agreed observation/follow-up: <confirmed responsibility and checks>

## Recovery / follow-up

- Failure/impact/trigger: <facts, or no recovery needed with reason>
- Authorized recovery action: <actual rollback/restore or new forward-fix candidate>
- Compatibility/restore point/data-loss constraints: <confirmed evidence, no assumed reversibility>
- Execution and resulting serving/data state: <actual result/link>
- Recovery verification: <required smoke/health/data results and time>
- Outcome: <ROLLED_BACK only after prior state restoration is verified; otherwise FAILED>
- Outstanding incident/blockers: <owner and next action; retain failed-attempt evidence>

Text-only user documentation is optional unless requested or required for this
release. Preserve existing guides/images/scripts and unrelated custom notes.
