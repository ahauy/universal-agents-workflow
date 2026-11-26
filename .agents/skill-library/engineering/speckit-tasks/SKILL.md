---
invocation: user
name: speckit-tasks
description: Legacy compatibility alias; use task-breakdown under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/tasks.md
  status: migration-only
---

# Legacy migration: speckit-tasks

Read [the native task-breakdown skill](../task-breakdown/SKILL.md) on demand and follow its inputs, outputs and stopping conditions.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
