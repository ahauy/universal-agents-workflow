---
invocation: model
name: technical-documentation
description: >
  MANDATORY when writing, updating, or reviewing technical documentation,
  architecture docs, feature docs, API references, or agent instruction files
  (AGENTS.md, CONTRIBUTING.md, GEMINI.md). Applies the Diataxis framework,
  Matt Palmer's 8 rules, OpenAI quality principles, and canonical-alias governance.
license: MIT
metadata:
  source: "https://github.com/openclaw/openclaw"
---

# Technical Documentation

## Purpose

Produce and review technical documentation that is clear, actionable, and maintainable for both humans and AI coding agents. Covers product documentation surfaces (`docs/`, `README*`, API docs, architecture specs) as well as contributor and agent governance files (`AGENTS.md`, `CONTRIBUTING.md`, `GEMINI.md`).

## When to Use

- **Feature Completion (Phase 6)**: Writing `docs/features/<feature-slug>/README.md`, updating `docs/features/README.md` index, and syncing architecture docs immediately after code review.
- **Architecture & API Documentation**: Documenting system design, database models, state machines, or REST APIs in `docs/architecture/`.
- **Algorithm & Domain Documentation**: Documenting core algorithms (e.g. SuperMemo-2, Streak calculations, XP formulas) in `docs/algorithms/`.
- **Governance & Instruction Maintenance**: Creating or updating `AGENTS.md`, `CONTRIBUTING.md`, `.cursorrules`, or skill manifests.
- **Documentation Audit & Review**: Reviewing doc PRs/diffs for structural clarity, accurate commands, working links, and absence of doc drift.

---

## Core Workflow

```
1. Classify Task: Build (create/update) vs. Review (audit/verify)
   Context: Brownfield (existing repo docs) vs. Evergreen (reusable baseline)
      ↓
2. Inventory Scope:
   - Governance: AGENTS.md, CONTRIBUTING.md, GEMINI.md, skills
   - Product docs: docs/features/, docs/architecture/, docs/algorithms/, README.md
      ↓
3. Apply Core Principles (Matt Palmer 8 Rules + OpenAI Cookbook):
   - Funnel Structure: What/Why → Quickstart → Deep Dive / Next Steps
   - Diataxis Framework: Tutorial | How-To | Reference | Explanation
   - Agent-Friendly: Real paths (clickable), concrete commands, explicit boundaries
      ↓
4. Execute (Follow references/build.md or references/review.md; for agent instructions, read only the needed section of references/writing-for-agents.md)
      ↓
5. Validate Quality & Link Integrity (IEEE / Markdown lint pass)
```

---

## The Diataxis Framework for Project Docs

Every technical document must explicitly match one of the 4 Diataxis quadrants:

| Quadrant                                 | Purpose                                                | Location / Example                                         | Tone / Style                            |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------- |
| **Tutorial** (Learning-oriented)         | Step-by-step guide for beginners to complete a project | `docs/tutorials/`, Getting Started guides                             | Prescriptive, hands-on, no assumptions  |
| **How-To Guide** (Problem-oriented)      | Recipes to accomplish a specific real-world task       | `docs/guides/`, "How to seed deck data", "How to add a NestJS module" | Practical, goal-focused, step-by-step   |
| **Reference** (Information-oriented)     | Precise technical descriptions, APIs, schemas          | `docs/features/<slug>/`, API DTOs, Prisma schema reference            | Concise, exact, complete, authoritative |
| **Explanation** (Understanding-oriented) | Architectural reasoning, trade-offs, algorithms        | `docs/architecture/`, `docs/algorithms/supermemo-2.md`                | Contextual, thoughtful, explains _why_  |

---

## Agent & Contributor Governance Rules (`AGENTS.md` / `CONTRIBUTING.md`)

For skills, prompts, rules or agent-facing docs, read the relevant section of
[writing for agents](references/writing-for-agents.md) on demand. Keep terminology,
short pointers, concrete failure modes, inputs and exit checks aligned with the
actual project; do not preload the other documentation references.


1. **Canonical Source of Truth**:
   - `AGENTS.md` (or `.agents/AGENTS.md`) is the canonical authority for AI workflows.
   - All tool-specific files (`.cursorrules`, `.cursor/rules/*`, `CLAUDE.md`) must act as compatibility aliases or symlinks to maintain **DRY**.
2. **3 Explicit Behavioral Boundaries for Agents**:
   - **`Always`**: Required actions (e.g., read tech skill before coding, run TDD, zero critical bugs).
   - **`Ask first`**: Architectural changes, deleting database tables, adding heavy dependencies.
   - **`Never`**: Hardcoding credentials/secrets, committing broken builds, swallowing errors silently.
3. **Concrete & Actionable**:
   - Always provide exact runnable CLI commands (`pnpm test`, `npx prisma migrate dev`).
   - Use exact clickable file paths (absolute local file links or valid repo-relative links).

---

## Post-Review Feature Documentation Checklist (Phase 6 Integration)

Immediately upon passing Code Review (Stage 4 of implementation / Phase 6):

- [ ] **Feature README Created**: `docs/features/<feature-slug>/README.md` populated with:
  - Background & Business Value (derived from signed-off spec)
  - Architecture & Data Flow (Mermaid diagrams grounded in the current code and approved requirements)
  - Key Endpoints & DTO Contracts
  - UI/UX States & Components
  - Test Traceability Matrix (link to `test-plan.md`)
- [ ] **Feature Index Updated**: Added entry row into `docs/features/README.md`.
- [ ] **Architecture Sync**: Updated `docs/architecture/` if database schema, services, or APIs changed.
- [ ] **Algorithm Sync**: Updated `docs/algorithms/` if learning formulas or streak mechanics changed.
- [ ] **Link & Path Verification**: All markdown links and code snippets verified against actual codebase.

---

## Operations and release records (on demand)

For selected release/operations work, read the relevant [production lifecycle](../../../docs/production-lifecycle.md#preparation) section only. Maintain stable `docs/OPERATIONS.md` using the [operations template](../../../../.specify/templates/operations-template.md), and one `docs/releases/<version>.md` using the [release template](../../../../.specify/templates/release-template.md). Create a missing file only from confirmed project evidence; otherwise patch affected sections, preserving custom notes, existing evidence, image/assets and accepted history. Do not overwrite an existing runbook or regenerate every release record.

Operations covers actual commands/environments, responsibility, health/log/alert checks and applicable migration/backup/recovery. Record secret names and secure-store references only, never values. Unknown commands, URLs or platform choices stay ASM-/BLOCKED. Release records link reusable candidate/target/config evidence rather than duplicating reports; record DEV_COMPLETE, RELEASE_READY and PRODUCTION_VERIFIED distinctly. Failed checks and recovery outcomes must remain truthful. Ordinary task docs need neither a new operations document nor a release record; text user guides remain separately requested or release-selected.

## References

- [`references/principles.md`](./references/principles.md): Matt Palmer 8 rules & OpenAI Cookbook guidelines.
- [`references/agent-and-contributing.md`](./references/agent-and-contributing.md): Canonical/alias governance for AGENTS.md and CONTRIBUTING.md.
- [`references/build.md`](./references/build.md): Playbook for writing fresh technical docs.
- [`references/review.md`](./references/review.md): Audit rubric and review checklist.

- [`references/writing-for-agents.md`](./references/writing-for-agents.md): Dense agent-facing instructions, concrete failure modes, vocabulary and skill template.
