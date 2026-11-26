# Consolidated UAW skills

Status: Implemented & Verified
Last updated: 2026-11-26

At this feature completion UAW shipped 53 skills: 9 hot entry points and 44 cold skills read on demand. BA-first Fast/Full behavior and the four native planning skills remain; wait-what is retained unchanged.

Current setup/debt/authoring and text-guide behavior supersedes the corresponding owners below; see [lean setup and text guides](../lean-setup-text-guides/README.md).

## Use the retained owners

| Need | Owner |
| --- | --- |
| Find a skill or next phase | skills-index, using the generated catalog |
| Review a diff for unnecessary complexity | ponytail-review diff |
| Audit the repository for unnecessary complexity | ponytail-review repo |
| Build/review marketing pages | design-taste-frontend |
| Build/review application screens | design-taste-product |
| Explain something more simply | wait-what |

[Catalog](../../../.agents/SKILLS.md) gives exact paths. UI owners share one foundations reference for stack/surface detection, subject-grounded visual direction, copy, an existing DESIGN.md anchor and final checks. Load only the relevant surface/reference. [Ponytail usage](../../../.agents/docs/ponytail-usage.md) documents levels and review scopes.

## Installation and updates

Removed identities are not supplied in new installs. Existing customer copies remain through updates, including edited retired skills. The unchanged update engine keeps customized skills, adapters, index, hooks/settings, domain documents and ownership evidence. Do not manually delete or adopt local files to force a match with the new inventory. Existing projects can therefore show more than 53 skills. A previously selected pack whose source is unavailable is reported as unavailable/partial and retained for review; removal is never silently treated as success.

The old source command names no longer provide supported entry points. Use native planning skills and the owners above. Historical approved artifacts may retain old names as point-in-time evidence. [ADR 0006](../../../adr/0006-consolidated-native-skill-library.md) supersedes source-alias retention without rewriting ADR 0004.

## Verification

See the [test plan](../../../.specify/features/skill-consolidation/test-plan.md), [acceptance evidence](../../../.specify/features/skill-consolidation/acceptance-report.md) and [independent review](../../../.specify/features/skill-consolidation/implementation/review-round-1.md).

PowerShell execution requires pwsh, unavailable in this environment. Local fixtures exercise updates without applying changes to real customer projects. No runtime, dependency or global configuration was added.
