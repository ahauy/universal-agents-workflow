---
invocation: user
name: speckit-converge
description: Legacy compatibility alias; use verification-before-completion under UAW lane and gate rules.
metadata:
  origin: github-spec-kit
  source: templates/commands/converge.md
  status: migration-only
---

# Legacy migration: speckit-converge

Read [the native verification-before-completion skill](../verification-before-completion/SKILL.md) on demand and follow its inputs, outputs and stopping conditions. Complete UAW acceptance/review gates and resolve Critical findings; this alias grants no automatic fix loop or external action.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
