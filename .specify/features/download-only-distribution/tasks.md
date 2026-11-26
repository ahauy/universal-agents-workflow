# Tasks: Download-only distribution

Status: COMPLETE, approved scope implemented and reviewed on 2026-11-26. See acceptance-report.md for verification limits.
References: plan.md, spec.md, test-plan.md, context-pack.md.

- [x] T001 Record baseline approval and confirmed ASM-DOWNLOAD-001..003 in baseline.md and 01-elicitation.md.
- [x] T002 Produce requirements/traceability/validation artifacts and technical plan under this feature directory.
- [x] T003 Obtain the owner's Gate 2 approval of plan.md + tasks.md before implementation.
- [x] T004 [P] [US1/US2/US5] Slice A: inventory and remove packages/mcp-server/**; update README.md, AGENTS.md, .agents/scripts/sync-harnesses.mjs and root test-plan.md; add successor ADR/index.
- [x] T005 [P] [US3] Slice B: strengthen .agents/skill-library/engineering/spec-validator/SKILL.md prerequisites, assumption checks, acceptance/traceability coverage and result boundaries.
- [x] T006 [US2/US4] Run .agents/scripts/test/test-installers.py; add only necessary distribution regression coverage there; run fresh/reinstall smoke tests in a temporary project.
- [x] T007 [US1/US5] Verify package-only output/dependencies are absent and no active guidance/adapter output requires UAW MCP; confirm third-party integration files are retained.
- [x] T008 [US3] Review complete/missing/assumption/acceptance/dangling-link validator scenarios from test-plan.md and record evidence in acceptance-report.md.
- [x] T009 [US4] Run hooks regressions, Bash syntax and whitespace checks; record unavailable pwsh checks as skips.
- [x] T010 Run independent dual-pass review plus lean pass, resolve any Critical findings and record review evidence in review-report.md.
- [x] T011 [US5] Complete this feature's README.md, index it from .specify/features/README.md, update CHANGELOG.md and report acceptance status briefly.

T004 and T005 are parallel-safe, disjoint slices. T006-T009 depend on both;
T010 follows integration; T011 follows review. No task includes Git staging,
commit/push, package publication or changes to accepted ADR 0002.
