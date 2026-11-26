---
invocation: user
name: speckit-analyze
description: Legacy compatibility alias; use technical-consistency-review under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/analyze.md
  status: migration-only
---

# Legacy migration: speckit-analyze

Read [the native technical-consistency-review skill](../technical-consistency-review/SKILL.md) on demand and follow its inputs, outputs and stopping conditions.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
