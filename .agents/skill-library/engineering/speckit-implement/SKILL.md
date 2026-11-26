---
invocation: user
name: speckit-implement
description: Legacy compatibility alias; use implementation-orchestrator under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/implement.md
  status: migration-only
---

# Legacy migration: speckit-implement

Follow AGENTS.md implementation and lane rules first. Fast stays in one context with its BA checkpoint; only Full after Gates 1 and 2 uses [implementation-orchestrator](../implementation-orchestrator/SKILL.md).

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
