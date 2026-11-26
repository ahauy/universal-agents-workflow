# Scoped implementation context

Full T1; owner explicitly approved audit corrections + A/B removals + Archify removal.
Read baseline.md, requirements.md, spec.md for confirmed scope, no re-interview.
Protect prior signed artifacts; source cleanup only; no global/customer/Git writes.

## A: onboarding and instruction consistency

Own: .agents/skills/engineering/command-skill-setup/SKILL.md;
.agents/skill-library/productivity/setup-workspace/SKILL.md;
.agents/skill-library/engineering/verification-before-completion/SKILL.md;
optional-stack-skills/frameworks/react-rules/*.md;
optional-stack-skills/languages/typescript/rules/*.md;
.agents/docs/harness-compatibility.md and token-budget.md.
Use existing engine --sync --extra-ship source=target from explicit choices; cold
paths from catalog, no manual registry/hash adoption, no global Archify instructions.
Repair rule links for both source and installed flattened layout; absent docs in
future projects are not automatically broken template links. Add narrowly scoped
instruction regression test test-local-instructions.py under scripts/test/.
Output implementation/slice-a-report.md. Do not touch catalog/index or coordinator docs.

## B: screenshot workflow and test isolation

Own: .agents/skills/engineering/command-user-guide/SKILL.md;
.agents/skill-library/engineering/user-guide-with-screenshots/{SKILL.md,SETUP.md,
scripts/capture-screenshots.mjs}; new test-capture-screenshots.mjs;
.agents/scripts/test/test-hooks.js (isolate session cache in temp workspace).
URL/commands inferred from actual project; reject failed/unknown actions, cleanup
browser finally, no false complete. No fake screenshots or actual browser dependency
installation; temporary mocked Playwright fixture tests. Explain annotation support
truthfully rather than promising generic script adds unsupported highlights.
Output implementation/slice-b-report.md. Do not touch coordinator cleanup tests.

## Coordinator: removal/integration

Own Archify source and optional wrapper removal, global sync script removal,
approved cache/active duplicate/handoff removal, catalog+build-skill-index routes,
SKILLS generation, remaining active Archify docs (README/domain-modeling/technical-
documentation/improve-codebase-architecture/docs), cleanup/derived/catalog/integration
test adaptations, feature docs/index and independent review. Coordinate docs A before
cross-file regeneration. Preserve old legacy custom Archify paths in target tests.
