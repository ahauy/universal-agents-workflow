---
invocation: user
name: command-user-guide
description: "Write or update a concise text guide in docs/user-guides/<slug>.md using confirmed feature behavior."
triggers:
  - "/command-user-guide"
  - "/user-guide"
  - "/guide"
  - "/auto-user-guide"
  - "create user guide"
  - "write user guide"
  - "user documentation"
---

# Command: User Guide

Read [user-guide](../../../skill-library/engineering/user-guide/SKILL.md) on demand.
Pass the requested feature/slug, confirmed behavior and existing guide path to it.
That skill owns the writing workflow; do not duplicate its instructions here.

Run when requested or when the target project's release documentation requires it.
A UI change alone does not trigger guide generation. Keep this task text-only;
no app startup, browser capture or annotation step is required.
