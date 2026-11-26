---
invocation: model
name: user-guide
description: "Create or update concise text instructions for end users from confirmed behavior. Use when a guide is requested or required for release documentation."
---

# User Guide

Write plain-language instructions in `docs/user-guides/<slug>.md`. This is a
text documentation workflow, separate from the technical feature README.

## Workflow

1. Identify the requested feature, audience, slug and scope. Read its confirmed
   requirements, relevant source and existing guide; reuse established answers.
   Ask only for material gaps in user actions, permissions or observable results.
   Never invent UI labels, behavior, business rules or success claims.
2. Describe the user's goal, required access and the shortest useful sequence of
   actions. Use actual control labels and explain each meaningful result. Add
   recovery advice only where the source or approved requirements supports it.
3. Use [the text template](templates/user-guide-template.md) as needed. Keep one
   user action per numbered step and use everyday language. Include tips or FAQ
   only when relevant; omit empty sections and implementation detail.
4. Update an existing guide surgically: read it first, keep unrelated custom
   notes and existing image references/assets, and change only affected steps.
   Do not regenerate the whole document or delete guides, images or scripts.
   When preservation is unclear, ask rather than overwrite.
5. Check action names, behavior and relative document links against available
   evidence. Update an existing `docs/user-guides/README.md` index entry when
   applicable, preserving other entries. Report the guide path and any unverified
   behavior honestly; reading source is not proof of live interaction.

## Boundaries

Run on request or for the target project's release documentation, not after every
feature or UI edit. No server startup, browser session, screenshot plan, capture,
annotation or new dependency is part of this workflow. Existing visual assets
remain project data. UI review and E2E testing keep their own verification rules.

Do not modify the technical feature README as a substitute for the requested
end-user guide. No Git writes are authorized by this skill.
