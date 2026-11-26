---
invocation: user
name: speckit-specify
description: Legacy compatibility alias; use technical-spec under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/specify.md
  status: migration-only
---

# Legacy migration: speckit-specify

Read [the native technical-spec skill](../technical-spec/SKILL.md) on demand and follow its inputs, outputs and stopping conditions.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
