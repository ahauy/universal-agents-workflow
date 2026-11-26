---
invocation: user
name: speckit-checklist
description: Legacy compatibility alias; use spec-validator under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/checklist.md
  status: migration-only
---

# Legacy migration: speckit-checklist

Read [the native spec-validator skill](../spec-validator/SKILL.md) on demand and follow its inputs, outputs and stopping conditions. This validates business requirements; use technical-consistency-review only after spec, plan and tasks exist.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
