# Lean setup and text guides

Status: Implemented; verification evidence recorded in the feature acceptance report.
Last updated: 2026-11-26

UAW ships 50 skills (9 hot/41 cold). Three duplicate owners are merged, and end-user guide writing now uses concise text instructions without a screenshot workflow. BA gates, native planning, wait-what and update preservation remain.

## Current entry points

| Need | Owner |
| --- | --- |
| First-time onboarding or change selected skills | command-skill-setup, loading its onboarding reference only as needed |
| Write agent instructions, skills or rules | technical-documentation, using its agent-authoring reference |
| List deliberate shortcut debt | ponytail-review debt |
| Write/update an end-user guide | command-user-guide → user-guide |

Use the [catalog](../../../.agents/SKILLS.md) for paths. A guide request produces docs/user-guides/<slug>.md from confirmed source/requirements; it does not require launching the app, opening a browser or generating annotated pictures. A UI change alone does not trigger guide generation. Existing image references and custom notes remain during targeted edits. UI review and E2E evidence checks have their own scopes.

## Safe updates

Old source owners and capture tools are not supplied in fresh installs. Existing installed copies, customized skills/scripts, guides/images, hooks/settings and domain data remain protected by the unchanged update engine. Existing projects may therefore show more skills than a fresh install. Missing previously selected source packs remain unavailable/partial for review; never delete or re-adopt custom files to force the new inventory.

[ADR 0007](../../../adr/0007-lean-setup-and-text-guides.md) records the current decision without rewriting earlier accepted history. [Acceptance evidence](../../../.specify/features/lean-setup-text-guides/acceptance-report.md) links executed tests, preservation checks and review. PowerShell execution was unavailable; local fixtures do not certify live customer or Windows updates.
