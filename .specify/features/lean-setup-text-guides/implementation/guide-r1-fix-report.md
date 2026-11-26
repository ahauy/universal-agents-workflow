# R1 guide gate correction

Resolved the retained Git guide contradiction in the scoped source locations:

- `.agents/skill-library/engineering/git-workflow/SKILL.md` section 5: replaced the per-UI-feature screenshot gate with on-request/release-required text-guide verification. Text-only guides are sufficient; existing custom content/assets remain preserved. UI review/E2E evidence stays separate.
- `.agents/skills/engineering/command-git-push/SKILL.md` PR checklist: guide checkbox now applies only to requested/release-required text documentation.

No unrelated Git rules were changed, and no Git mutation was performed. `git diff --check` passed. Parent owns focused regression assertions and verification.
