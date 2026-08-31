# Archify CLI Manual & Command Reference

> **IMPORTANT:** Archify runs as a zero-dependency Node.js skill at `~/.agents/skills/archify/`.
> All commands use `node bin/archify.mjs`. There is NO global `npx archify` command.

---

## Installation

```bash
# Install Archify globally (Antigravity/Claude Code/Cursor):
npx -y skills add tt-a1i/archify --skill archify --global --copy --yes
# Installs to: ~/.agents/skills/archify/
```

---

## Health Check

```bash
# Verify runtime is ready:
node bin/archify.mjs doctor

# Run built-in demo (generates 5 diagram examples):
node bin/archify.mjs demo /tmp/archify-demo
```

---

## Core Workflow: Author → Validate → Deliver → Visual Check

### Step 1: Choose diagram type & read schema

```bash
# When unsure which diagram type fits your scenario:
node bin/archify.mjs guide "multi-agent agent run lifecycle" --json
```

Read the matching schema: `~/.agents/skills/archify/schemas/<type>.schema.json`

### Step 2: Author JSON IR candidate

Write candidate to: `docs/architecture/<slug>.json` or `/tmp/<slug>.json`

### Step 3: Validate (run after every edit)

```bash
# validate <TYPE> <file.json> [options]
node bin/archify.mjs validate architecture docs/architecture/system-map.json --quality showcase --json
node bin/archify.mjs validate lifecycle docs/architecture/feature-lifecycle.json --quality showcase --json
node bin/archify.mjs validate workflow docs/architecture/ba-pipeline.json --quality showcase --json
node bin/archify.mjs validate sequence docs/architecture/api-sequence.json --quality showcase --json
node bin/archify.mjs validate dataflow docs/architecture/agent-dataflow.json --quality showcase --json
```

**Validation flags:**

| Flag                 | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `--quality showcase` | Require 9 artifact checks (not just 4 basic)                          |
| `--json`             | Machine-readable JSON receipt with diagnostics                        |
| `--layout-json`      | (workflow only) Expose compiler layout receipt for geometry diagnosis |

A showcase pass must report **all 9 artifact checks** with 0 composition errors and 0 warnings.

### Step 4: Deliver (final acceptance — runs once)

```bash
# deliver <TYPE> <input.json> <output.html> [options]
node bin/archify.mjs deliver architecture \
  docs/architecture/system-map.json \
  docs/architecture/system-map.html \
  --quality showcase --json

node bin/archify.mjs deliver lifecycle \
  docs/architecture/feature-lifecycle.json \
  docs/architecture/feature-lifecycle.html \
  --quality showcase --json
```

**Delivery flags:**

| Flag                 | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `--quality showcase` | Full 9-check showcase acceptance                           |
| `--json`             | Machine-readable JSON receipt with SHA-256 + byte counts   |
| `--repo-root .`      | (architecture only) Enable source grounding via git commit |

> A non-zero exit can never be described as success. Delivery atomically commits the HTML and reports SHA-256. A failed delivery preserves the previous artifact — do not run `visual-check` on that path.

### Step 5: Visual Check (after delivery)

```bash
# Measure containment at 4 viewport sizes + capture screenshots:
node bin/archify.mjs visual-check docs/architecture/system-map.html --json
```

Checks containment at `1440×900`, `1600×1000`, `1920×1080`, and `2048×1320`.
Receipt always reports `visualReview: "pending"` — screenshots are evidence for inspection.

---

## Architecture Snapshot Diff (Before / Delta / After)

```bash
# compare architecture <base.json> <head.json> [output.html] [options]
node bin/archify.mjs compare architecture \
  docs/architecture/snapshots/v1-shallow.json \
  docs/architecture/snapshots/v2-deep.json \
  /tmp/architecture-refactor-diff.html --json
```

Use this in `improve-codebase-architecture` Phase 6A to visually highlight collapsed shallow modules and new deep module seams.

> **Note:** `compare` is architecture-only. It validates both snapshots independently, pairs components only by stable IDs, and classifies semantic vs. presentation changes separately.

---

## Brand Discovery & Capture

```bash
# Discover built-in brand marks:
node bin/archify.mjs brands "NestJS" --json
node bin/archify.mjs brands "PostgreSQL" --json

# Capture a brand from a URL (use only when no built-in mark exists):
node bin/archify.mjs brands capture "https://nestjs.com/img/logo-small.svg" --json
```

---

## Preview (local authoring loop only)

```bash
# Live preview during authoring — NOT for production delivery:
node bin/archify.mjs preview architecture \
  docs/architecture/system-map.json \
  /tmp/preview-output.html \
  --quality showcase
```

> Do not use `preview` as a substitute for `deliver`. Preview does not produce the delivery receipt.

---

## Workflow Migration (v1 → v2)

```bash
# Migrate an existing workflow to schema v2 layout:
node bin/archify.mjs migrate workflow \
  docs/architecture/old-workflow.json \
  docs/architecture/new-workflow.json \
  --to-schema 2 --json
```

Use schema v2 for new workflows. Keep `schema_version: 1` only when preserving existing fixed geometry.

---

## CI/CD Integration

```bash
#!/bin/bash
# Example: validate and deliver in CI pipeline
SKILL_DIR="$HOME/.agents/skills/archify"

# Validate all architecture diagrams:
for json in docs/architecture/*.json; do
  node "$SKILL_DIR/bin/archify.mjs" validate architecture "$json" --quality showcase --json
done

# Deliver main architecture map:
node "$SKILL_DIR/bin/archify.mjs" deliver architecture \
  docs/architecture/system-map.json \
  docs/architecture/system-map.html \
  --quality showcase --json
```

---

## Common Errors & Fixes

| Error                       | Cause                          | Fix                                           |
| --------------------------- | ------------------------------ | --------------------------------------------- |
| `schema_version` invalid    | Using `"2.16.0"` (string)      | Use `1` (integer)                             |
| `components` not found      | Using `nodes` for architecture | Use `components` array                        |
| `meta.title` missing        | `title` at top level           | Move into `"meta": { "title": ... }`          |
| `meta.views` invalid        | Using `chapters`               | Use `meta.views` with `focus[]` array         |
| `tag` array error           | Using `"tags": []`             | Use `"tag": "string"` (single string)         |
| `lifecycle` nodes not found | Using `nodes`                  | Use `states` array                            |
| `lifecycle` edges not found | Using `connections`            | Use `transitions` array                       |
| `dataflow` edges not found  | Using `connections`            | Use `flows` array                             |
| `workflow` edges not found  | Using `connections`            | Use `edges` array                             |
| CLI command not found       | Using `npx archify`            | Use `node bin/archify.mjs`                    |
| Showcase check fails (4/9)  | Missing `meta.quality_profile` | Add `"quality_profile": "showcase"` in `meta` |
