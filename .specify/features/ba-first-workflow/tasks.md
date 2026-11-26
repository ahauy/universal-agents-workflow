# Tasks: BA-first UAW

Status: COMPLETE, approved work implemented and reviewed on 2026-11-26. See acceptance-report.md for verification limits. References: baseline.md, spec.md, plan.md, test-plan.md.

- [x] T001 Record the owner's scope/cost-policy approval and confirmed ASM-BA-001..003.
- [x] T002 Validate business rules/requirements and sign baseline v1.0.
- [x] T003 Draft native contracts, migration mapping, plan and acceptance cases.
- [x] T004 Obtain explicit Gate 2 approval of plan.md + tasks.md before implementation.
- [x] T005 [P] [US1/US2/US3/US4/US7] Slice A: align governance, BA skills, intake/backlog/continue, root adapters and context hook using plan.md's file scope.
- [x] T006 [P] [US5/US6] Slice B: add four native skills, rewrite legacy stubs, templates/registry/routes and catalog sources; record successor ADR 0004.
- [x] T007 [US2/US6] Regenerate .agents/SKILLS.md after A+B, resolve all current skill references/metadata and check native/legacy paths without missing upstream runtime calls.
- [x] T008 [US1/US2/US3/US4/US5/US7] Review all lane/BA/roadmap/artifact decision cases and add meaningful standard-library structural/hook regression checks under .agents/scripts/test/.
- [x] T009 [US6/US8] Run installer/hook/agent/catalog regressions and fresh/reinstall/adapter smoke checks, preserving earlier data-safety behavior and custom content.
- [x] T010 [US7] Record hot/cold catalog estimates and actual telemetry availability; report unknown cost honestly, without inferring money from duration/LOC.
- [x] T011 Run independent standards/security, fidelity and lean review; resolve Critical findings within the repository's review-round cap.
- [x] T012 [US8] Record acceptance evidence, complete/index this feature README, update CHANGELOG.md and report briefly; no Git writes/publication.

T005 and T006 are parallel-safe with disjoint ownership. T007-T010 depend on
both. T011 follows integration and T012 follows review. Baseline/requirements
and previous signed-off feature history are immutable after sign-off.
