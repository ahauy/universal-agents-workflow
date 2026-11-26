# Lifecycle scenario review

Method: manual application of the canonical protocol to synthetic evidence cases.
This is an instruction/gate review, not execution of a deploy or automated state
validator. Independent reviewer checks the decisions against the same rules.

| Case | Given evidence | Required decision / action |
| --- | --- | --- |
| S01 | Bounded Fast task tests/self-check pass, no release selected | DEV_COMPLETE; no operations/release artifact or extra BA ceremony |
| S02 | Commit/push succeeded, no release or deployed evidence | DEV_COMPLETE only; never claim production |
| S03 | Candidate/target/config match; all applicable readiness evidence passed | RELEASE_READY; no implied deployment authorization |
| S04 | Required CI/build check failed or missing | BLOCKED, even if owner wants to accept a High risk |
| S05 | A required test was skipped because its runner was absent | BLOCKED; skip is not PASS or justified N/A |
| S06 | Prior passing tests belong to another candidate/config or drift occurred | BLOCKED until affected evidence is renewed |
| S07 | Stateless release, backup/data changes genuinely N/A with reason, all required checks pass | RELEASE_READY; no unnecessary backup ceremony |
| S08 | Ready release but authorization missing or for another target/operation | No production write; record BLOCKED and missing scope, preserve prior readiness evidence |
| S09 | Matching previous production authorization and readiness still valid | Reuse approval; execute only confirmed authorized procedure, no repeated approval request |
| S10 | Actual authorized candidate deployed; agreed smoke/health/log/alert checks pass | PRODUCTION_VERIFIED, with identity/time/results and owner |
| S11 | Deployment command exits zero but post-deploy required evidence is missing/skipped | BLOCKED; command success is not production verification |
| S12 | Post-deploy smoke fails | FAILED with observed serving/data state and impact; do not assume rollback occurred |
| S13 | Recovery command ran but health/data/restore verification missing or failed | Keep FAILED; never label ROLLED_BACK from command exit alone |
| S14 | Prior serving/data state restored and required recovery checks passed | ROLLED_BACK; failed candidate remains not production-verified |
| S15 | Migration irreversible, compatible recovery/authorization unknown | Escalate/block recovery; no improvised down migration or assumed data restoration |
| S16 | Unresolved Critical or newly found unaccepted High | No success verdict; Critical cannot be accepted, High needs fix/specific owner acceptance |

Source contract tests verify state/section exposure, unresolved template defaults,
concrete links and core/verification routing. Integration tests exercise actual
file-preserving updates, not production procedures.
