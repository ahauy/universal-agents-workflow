# Skill & Reference Matrix (tra cứu theo ngữ cảnh)

> Loaded on demand. Do not read this file at session start — consult the row that
> matches the situation you are actually in.

## Project-wide references

| Context / Area                                    | Reference                                   | Location      |
| ------------------------------------------------- | ------------------------------------------- | ------------- |
| Project Shared Language (Ubiquitous Language)     | `CONTEXT.md`                                | Root          |
| Architecture Decisions & Enduring Constraints     | `adr/`                                      | Root          |
| Project Design System & Tokens                    | `DESIGN.md` / design tokens                 | Target UI root |

## Phase 1 — Business Analysis

| Context / Area                                    | Skill                              | Location                        |
| ------------------------------------------------- | ---------------------------------- | ------------------------------- |
| New feature intake & complexity classification    | `intake-classifier`                | `engineering/intake-classifier` |
| Business value & 6-pillar domain elicitation      | `elicitation-interview`            | `engineering/elicitation-interview` |
| Deep interactive interview primitive              | `grilling`                         | `productivity/grilling`         |
| Async stakeholder questionnaire generation        | `to-questionnaire`                 | `productivity/to-questionnaire` |
| AS-IS / TO-BE / gap + RBAC, state machines, ERD   | `domain-modeling`                  | `engineering/domain-modeling`   |
| Requirements document (`requirements.md`, optional audience exports) | `spec-writer`                      | `engineering/spec-writer`       |
| IEEE 29148 quality gate & traceability matrix     | `spec-validator`                   | `engineering/spec-validator`    |
| Baseline sign-off & dev handover gate             | `handover` (≠ `handoff`)           | `engineering/handover`          |
| Consistency / contradiction scan across artifacts | `risk-contradiction-scanner`       | `engineering/risk-contradiction-scanner` |
| Decision tickets map for large ambiguous efforts  | `wayfinder`                        | `engineering/wayfinder`         |

## Phase 2–4 — Spec, Plan, Tasks

| Context / Area                                    | Skill                              | Location                        |
| ------------------------------------------------- | ---------------------------------- | ------------------------------- |
| Technical Specification (equiv. to-spec)          | `speckit-specify`                  | `engineering/speckit-specify`   |
| Architecture Plan & Contract DTOs                 | `speckit-plan`                     | `engineering/speckit-plan`      |
| Granular Task Decomposition                       | `speckit-tasks`                    | `engineering/speckit-tasks`     |
| Cross-artifact consistency (`/analyze`)           | `speckit-analyze`                  | `engineering/speckit-analyze`   |
| Architecture Scaffolding (greenfield only)        | `scaffold-architecture`            | `engineering/scaffold-architecture` |
| Module design, service interfaces, seams          | `codebase-design`                  | `engineering/codebase-design`   |
| Automated deep module & seam enforcement          | `setup-deep-modules`               | `engineering/setup-deep-modules`|

## Phase 5 — Implementation

| Context / Area                                    | Skill                              | Location                        |
| ------------------------------------------------- | ---------------------------------- | ------------------------------- |
| Feature execution, slice delegation & review      | `implementation-orchestrator`      | `engineering/implementation-orchestrator` |
| Backend & REST API design patterns                | `api-design`                       | `engineering/api-design`        |
| Bug diagnosis, regressions, flaky tests           | `diagnosing-bugs`                  | `engineering/diagnosing-bugs`   |
| Throwaway design & UI prototype exploration       | `prototype`                        | `engineering/prototype`         |
| E2E test, Playwright test                         | `e2e-testing`                      | `engineering/e2e-testing`       |

## Phase 6 — Review, Docs, Delivery

| Context / Area                                    | Skill                              | Location                        |
| ------------------------------------------------- | ---------------------------------- | ------------------------------- |
| Code review (dual pass, 4 stopping rules)         | `code-reviewer` agent              | `.agents/agents/code-reviewer.md` |
| UI visual review & component QA                   | `ui-design-review`                 | `engineering/ui-design-review`  |
| Architectural audit, hotspot scan, HTML report    | `improve-codebase-architecture`    | `engineering/improve-codebase-architecture` |
| Technical documentation, feature README           | `technical-documentation`          | `engineering/technical-documentation` |
| User guide with real screenshots (per release)    | `user-guide-with-screenshots`      | `engineering/user-guide-with-screenshots` |
| Verification evidence before completion           | `verification-before-completion`   | `engineering/verification-before-completion` |
| Git branch, commit, merge workflow                | `git-workflow`                     | `engineering/git-workflow`      |

## UI Design (only when the task touches UI)

| Context / Area                                    | Skill                              |
| ------------------------------------------------- | ---------------------------------- |
| Landing, marketing, public surfaces               | `frontend-design` + `design-taste-frontend` + `ui-taste-pro` |
| In-app, dashboard, data-bearing screens           | `frontend-design` + `design-taste-product` + `ui-taste-pro` |
| Animation, motion, micro-interactions             | `motion-design`                    |
| Accessibility (WCAG AA)                           | `frontend-a11y`                    |

## Productivity / meta

| Context / Area                                    | Skill                              | Location                        |
| ------------------------------------------------- | ---------------------------------- | ------------------------------- |
| Intelligent skill and workflow router             | `route`                            | `productivity/route`            |
| Plain-language re-pitch with project vocabulary   | `wait-what`                        | `productivity/wait-what`        |
| Session context compaction for agent handoff      | `handoff` (≠ `handover`)           | `productivity/handoff`          |
| Session retrospective & environment tuning        | `retro`                            | `productivity/retro`            |
| Hunk-by-hunk git conflict resolution by intent    | `resolving-merge-conflicts`        | `engineering/resolving-merge-conflicts` |
| Authoring documentation optimized for AI agents   | `writing-for-agents`               | `engineering/writing-for-agents`|
| One-time repository onboarding & self-config      | `/command-skill-setup`             | `engineering/command-skill-setup` |
| Interactive architecture, sequence & FSM diagrams | `archify`                          | `engineering/archify`           |

## Ponytail family (minimal-code enforcement)

| Context / Area                                    | Skill                | Location                    |
| ------------------------------------------------- | -------------------- | --------------------------- |
| Always-active minimal code ladder                 | `ponytail`           | `engineering/ponytail`      |
| Over-engineering diff review                      | `ponytail-review`    | `engineering/ponytail-review` |
| Whole-repo bloat audit                            | `ponytail-audit`     | `engineering/ponytail-audit`|
| Deliberate shortcut ledger                        | `ponytail-debt`      | `engineering/ponytail-debt` |
| Benchmark impact scoreboard                       | `ponytail-gain`      | `engineering/ponytail-gain` |
| Commands quick-reference card                     | `ponytail-help`      | `engineering/ponytail-help` |

## Optional stack skills (install per project, not loaded by default)

`optional-stack-skills/` — `languages/` (go, python, rust, swift, flutter),
`frameworks/` (prisma, nestjs, frontend-patterns, liquid-glass-design),
`tools/` (archify). Run `/skill-setup` to activate only the stack you use.

## Deferred / not in the default catalog

These ship as files but are intentionally **not** loaded by default. Activate on demand:

- `docker-patterns`, `postgres-patterns` — infra-specific, only for containerised / SQL projects.
- `speckit-constitution`, `speckit-clarify`, `speckit-checklist`, `speckit-converge`, `speckit-implement`, `speckit-taskstoissues` — upstream spec-kit commands not wired into the 7-step pipeline. Use only when explicitly requested.
