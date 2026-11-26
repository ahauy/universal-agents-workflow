# Guide slice report

## Changes

REQ-LEAN-002/003 implemented within the guide-owned scope. `command-user-guide` is now a thin router to new `user-guide`; the text owner and minimal template use confirmed behavior, real control names and concise numbered actions. Existing custom guide sections, image references/assets and unrelated scripts must be preserved during edits. No mandatory guide per feature/UI change, browser/app startup, capture, annotations or new dependency is part of guide generation. UI review and E2E verification remain separate.

Removed the old source-only `user-guide-with-screenshots` tree (SKILL, capture script, screenshot plan, setup instructions and image-oriented template). Replaced the user-guide agent procedure with a short current-owner pointer and updated its openai.yaml summary. Shipping advisory now concerns release-required text instructions, with no screenshot requirement.

## Files

- `.agents/skills/engineering/command-user-guide/SKILL.md`
- `.agents/skill-library/engineering/user-guide/SKILL.md`
- `.agents/skill-library/engineering/user-guide/templates/user-guide-template.md`
- `.agents/agents/user-guide-creator.md`
- `.agents/agents/openai.yaml` (guide summary only)
- `.agents/skills/engineering/command-git-push/SKILL.md` (advisory only)
- Removed `.agents/skill-library/engineering/user-guide-with-screenshots/`

## Verification and boundaries

Concrete Markdown links from the command/new skill resolve. The removed source tree is absent. `git diff --check` passed. No customer/project guides, images, customized installed files, updater logic, tests, catalog, history, dependencies, global settings or Git writes were changed by this slice. Coordinator owns obsolete capture test removal, integration/data-preservation regressions and active catalog/docs synchronization.

No deviations from scoped acceptance criteria.
