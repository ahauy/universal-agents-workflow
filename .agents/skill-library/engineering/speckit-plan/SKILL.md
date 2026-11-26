---
invocation: user
name: speckit-plan
description: Legacy compatibility alias; use implementation-plan under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/plan.md
  status: migration-only
---

# Legacy migration: speckit-plan

Read [the native implementation-plan skill](../implementation-plan/SKILL.md) on demand and follow its inputs, outputs and stopping conditions.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
