---
invocation: user
name: speckit-taskstoissues
description: Retired legacy entry point; explains the supported UAW replacement.
metadata:
  origin: github-spec-kit
  source: templates/commands/taskstoissues.md
  status: migration-only
---

# Legacy migration: speckit-taskstoissues

Retired. External issue export is outside the core workflow. It requires a separate explicit user request and a supported integration; do not create issues or infer authorization from tasks.md.

This retained path supports safe upgrades, not an upstream runtime. Do not install or invoke SpecKit scripts, extension hooks or workflow YAML. Preserve modified customer files and signed-off history. No Git writes are authorized by this alias.
