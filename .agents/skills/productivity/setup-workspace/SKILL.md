---
name: setup-workspace
invocation: user
description: >
  One-time repository onboarding and self-configuration skill (replacing `setup-matt-pocock-skills`).
  Inspects the active repository to detect tech stack, package manager, git remote, issue tracker,
  and testing frameworks. Populates `CONTEXT.md` with initial domain shorthands, sets up `adr/`,
  and configures environment hooks. Trigger when you say "setup this workspace", "configure project
  for this repo", or "run self-config".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Setup Workspace — One-Time Repository Onboarding

## Purpose

Instead of manually copy-pasting configuration files, editing hardcoded tech stack tables,
or guessing project setup, `setup-workspace` runs once per repository to discover context
and tailor the Universal Agents Workflow to the target codebase.

---

## 4-Step Discovery Loop

```mermaid
flowchart TD
    A["1. Inspect Project Roots"] --> B["2. Shared Language & ADR Prep"]
    B --> C["3. Optional Stack Linking"]
    C --> D["4. Summary & Verification"]
```

### Step 1: Inspect Project Roots

1. **Manifest Discovery**:
   - Node/TypeScript: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`
   - Python: `pyproject.toml`, `requirements.txt`
   - Go: `go.mod`
   - Rust: `Cargo.toml`
   - Java/Kotlin: `pom.xml`, `build.gradle`
2. **Git & Issue Tracker**:
   - Detect git remote URL (`git remote -v`).
   - Identify issue tracking convention (GitHub Issues, Linear, Jira, or local markdown).
3. **Testing & Linting Tooling**:
   - Detect test runners (`vitest`, `jest`, `playwright`, `pytest`, `cargo test`).
   - Detect formatting/linting (`biome`, `prettier`, `eslint`, `ruff`).

### Step 2: Initialize Shared Language & ADRs

1. **`CONTEXT.md` Initialization**:
   - If `CONTEXT.md` contains default placeholders, populate the initial components and packages found during Step 1.
   - Seed project-specific terminology from `README.md` and high-level docs.
2. **`adr/` Setup**:
   - Ensure `adr/` exists at workspace root with `adr-template.md`.
   - Seed `adr/0001-record-architecture-decisions.md` if not already present.

### Step 3: Polyglot Stack & Framework Linking (Powered by catalog.json)

1. Load [optional-stack-skills/catalog.json](../../../optional-stack-skills/catalog.json) and match items against the detected technology stack:
   - **Language Skills & Rules**:
     - Python: `python-patterns`, `python-importlinter`
     - Go: `go-patterns`, `go-rules`, `go-depguard`
     - Rust: `rust-patterns`
     - TypeScript/Node: `typescript-patterns`, `ts-dependency-cruiser`
   - **Frameworks & UI**:
     - NestJS: `nestjs-patterns`
     - Prisma ORM: `prisma-patterns`
     - React / Next.js: `react-rules`, `frontend-patterns`, `liquid-glass-design`
   - **Infrastructure & Intelligence (MCP)**:
     - Docker & Postgres: `docker-patterns`, `postgres-patterns`
     - MCP Code Intelligence: `code-review-graph` (Tree-sitter SQLite graph for token reduction)
2. **Render Selection Table with Concise Summaries**:
   Always display a structured Markdown table including the **Concise Summary (Mô tả ngắn gọn)** column for every detected skill so the user understands its exact benefit.
3. Prompt the user for confirmation (or run `/skill-setup` for the full automated onboarding experience).

### Step 4: Verification & Handoff

Output a clean onboarding report:

- Detected Stack & Package Manager
- Active Branch & Git Remote
- Initialized `CONTEXT.md` and `adr/`
- Activated Skills, Rules & MCP Servers (with short descriptions)
- Recommended first skill to run (e.g. `route`, `intake-classifier`, or `improve-codebase-architecture`).
