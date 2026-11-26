# Skill Catalog (mục lục)

> Read this file when you need to pick a skill — it is **not** injected into
> the system prompt. Then open exactly one `SKILL.md` from the path column.
> Never load the whole library.

| Tier | Location | Cost | Contents |
| --- | --- | --- | --- |
| Hot | `.agents/skills/` | name + description on every request | 9 entry points and slash commands |
| Cold | `.agents/skill-library/` | zero until read | 41 on-demand skills |

Regenerate with `node .agents/scripts/build-skill-index.mjs`; verify with `--check`.

## Pick fast (symptom → skill)

| Symptom | Skill |
| --- | --- |
| New request, unclear size or scope | `intake-classifier` |
| Scope is vague, hidden design branches | `grilling` |
| Need AS-IS / TO-BE, RBAC, state machine, ERD | `domain-modeling` |
| Turn analysis into requirements.md | `spec-writer` |
| Requirements need an IEEE 29148 check | `spec-validator` |
| Design a signed-off Full feature | `technical-spec` |
| Turn a technical spec into an implementation plan | `implementation-plan` |
| Break a plan into ordered tasks | `task-breakdown` |
| Check existing requirements + spec + plan + tasks | `technical-consistency-review` |
| Implement an approved Full feature | `implementation-orchestrator` |
| Bug reproduced, root cause unknown | `diagnosing-bugs` |
| Over-engineered diff / bloated repo | `ponytail-review` |
| Need an architecture or sequence diagram | `technical-documentation` |
| Need a plain-language user guide | `user-guide` |
| Unsure which skill or phase applies | `skills-index` |

## Hot set — already in the system prompt (9)

| Skill | When | Path |
| --- | --- | --- |
| `command-continue-project` | Continue the roadmap in the Fast lane by default; escalate to the Full lane only on a hard trigger. | `.agents/skills/engineering/command-continue-project/SKILL.md` |
| `command-generate-backlog` | Interview the user and render docs/PRODUCT_BACKLOG_ROADMAP.md: MoSCoW, RICE, dependency chain, effort, context budget,… | `.agents/skills/engineering/command-generate-backlog/SKILL.md` |
| `command-git-push` | Inspect changes, write Conventional Commits by layer, push the branch, and emit an English PR brief. | `.agents/skills/engineering/command-git-push/SKILL.md` |
| `command-skill-setup` | Inspect and onboard a project, then activate confirmed catalog skills and rules safely through registered mappings. | `.agents/skills/engineering/command-skill-setup/SKILL.md` |
| `command-update` | Update the framework through the 3-Way Hash engine; protects project data and user-added skills (Zero Deletion Policy). | `.agents/skills/engineering/command-update/SKILL.md` |
| `command-user-guide` | Write or update a concise text guide in docs/user-guides/<slug>.md using confirmed feature behavior. | `.agents/skills/engineering/command-user-guide/SKILL.md` |
| `intake-classifier` | BA checkpoint and lane selector: reuse confirmed evidence; Fast for bounded existing behavior, Full on risk or… | `.agents/skills/engineering/intake-classifier/SKILL.md` |
| `ponytail` | Laziest solution that works: YAGNI, stdlib before custom, native before deps, one line before fifty. | `.agents/skills/engineering/ponytail/SKILL.md` |
| `skills-index` | Skill catalog router. | `.agents/skills/engineering/skills-index/SKILL.md` |

## Intake & Business Analysis (10)

| Skill | When | Path |
| --- | --- | --- |
| `elicitation-interview` | Use after a request escalates to the Full lane (see AGENTS.md §2). | `.agents/skill-library/engineering/elicitation-interview/SKILL.md` |
| `grilling` | The reusable interview primitive. | `.agents/skill-library/productivity/grilling/SKILL.md` |
| `to-questionnaire` | Turn a decision you cannot answer alone into a Markdown questionnaire for the one person who CAN answer it. | `.agents/skill-library/productivity/to-questionnaire/SKILL.md` |
| `domain-modeling` | Use for Full-lane work, after elicitation (and gap-analysis, if run) to turn interview answers into concrete domain… | `.agents/skill-library/engineering/domain-modeling/SKILL.md` |
| `gap-analysis` | Use for Full-lane work, after elicitation-interview has captured business value and the 6 pillars. | `.agents/skill-library/engineering/gap-analysis/SKILL.md` |
| `risk-contradiction-scanner` | Use for Full-lane work, after domain-modeling, to scan the accumulated business rules and state machines for logic… | `.agents/skill-library/engineering/risk-contradiction-scanner/SKILL.md` |
| `spec-writer` | Use for Full-lane work once elicitation, domain modeling, and the consistency scan are complete. | `.agents/skill-library/engineering/spec-writer/SKILL.md` |
| `spec-validator` | Use for Full-lane work immediately after spec-writer produces its documents. | `.agents/skill-library/engineering/spec-validator/SKILL.md` |
| `handover` | Use for Full-lane work as the final step of the domain baseline, once spec-validator has returned a clean pass (or… | `.agents/skill-library/engineering/handover/SKILL.md` |
| `wayfinder` | Plan large, ambiguous efforts (exceeding a single session) as a shared map of decision tickets on an issue tracker… | `.agents/skill-library/engineering/wayfinder/SKILL.md` |

## Spec, Plan & Tasks (8)

| Skill | When | Path |
| --- | --- | --- |
| `technical-spec` | Design UAW technical spec.md from a signed-off Full-lane baseline; return unresolved business decisions to BA. | `.agents/skill-library/engineering/technical-spec/SKILL.md` |
| `implementation-plan` | Plan scoped UAW implementation from signed-off baseline and technical spec; define files, dependencies, risks and… | `.agents/skill-library/engineering/implementation-plan/SKILL.md` |
| `task-breakdown` | Create dependency-ordered UAW tasks.md from technical spec and implementation plan, with verification and scoped… | `.agents/skill-library/engineering/task-breakdown/SKILL.md` |
| `technical-consistency-review` | Review existing UAW requirements, spec, plan and tasks for traceability and contradictions before Gate 2; read-only. | `.agents/skill-library/engineering/technical-consistency-review/SKILL.md` |
| `scaffold-architecture` | Generates the initial project/feature folder structure, seeds base files (shared types, error constants, DTO… | `.agents/skill-library/engineering/scaffold-architecture/SKILL.md` |
| `codebase-design` | MANDATORY when designing or refactoring module boundaries, service interfaces, domain logic, custom React hooks, or… | `.agents/skill-library/engineering/codebase-design/SKILL.md` |
| `setup-deep-modules` | Wire automated architectural seam and deep module enforcement for the active codebase (TypeScript, Python, Go, Rust,… | `.agents/skill-library/engineering/setup-deep-modules/SKILL.md` |
| `improve-codebase-architecture` | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever… | `.agents/skill-library/engineering/improve-codebase-architecture/SKILL.md` |

## Implementation (10)

| Skill | When | Path |
| --- | --- | --- |
| `implementation-orchestrator` | Use once handover has signed off a feature's baseline and spec (Phase 3 complete) and it's time to write the actual… | `.agents/skill-library/engineering/implementation-orchestrator/SKILL.md` |
| `api-design` | MANDATORY when designing, creating, or modifying any REST API endpoint, route, or controller. | `.agents/skill-library/engineering/api-design/SKILL.md` |
| `diagnosing-bugs` | MANDATORY when diagnosing, debugging, or troubleshooting hard bugs, regressions, flaky tests, data anomalies, or… | `.agents/skill-library/engineering/diagnosing-bugs/SKILL.md` |
| `prototype` | Build a throwaway prototype to answer a design question before committing to the real implementation. | `.agents/skill-library/engineering/prototype/SKILL.md` |
| `e2e-testing` | MANDATORY when writing, modifying, or debugging any E2E test, Playwright test, or browser automation test. | `.agents/skill-library/engineering/e2e-testing/SKILL.md` |
| `git-workflow` | MANDATORY when performing any git operation — branching, committing, merging, rebasing, or resolving conflicts. | `.agents/skill-library/engineering/git-workflow/SKILL.md` |
| `resolving-merge-conflicts` | Work through an in-progress git merge or rebase conflict hunk-by-hunk, resolving by intent traced to each side's… | `.agents/skill-library/engineering/resolving-merge-conflicts/SKILL.md` |
| `wizard` | MANDATORY when provisioning infrastructure, configuring environment secrets/keys, setting up third-party OAuth/API… | `.agents/skill-library/engineering/wizard/SKILL.md` |
| `postgres-patterns` | MANDATORY when writing raw SQL queries, designing database schemas, creating indexes, or configuring Row Level Security… | `.agents/skill-library/engineering/postgres-patterns/SKILL.md` |
| `docker-patterns` | MANDATORY when creating, modifying, or reviewing any Dockerfile, docker-compose.yml, .dockerignore, or container… | `.agents/skill-library/engineering/docker-patterns/SKILL.md` |

## Review, Docs & Delivery (4)

| Skill | When | Path |
| --- | --- | --- |
| `ui-design-review` | Use as the independent visual and design review step whenever a UI slice has been implemented — whether inside… | `.agents/skill-library/engineering/ui-design-review/SKILL.md` |
| `technical-documentation` | MANDATORY when writing, updating, or reviewing technical documentation, architecture docs, feature docs, API… | `.agents/skill-library/engineering/technical-documentation/SKILL.md` |
| `user-guide` | Create or update concise text instructions for end users from confirmed behavior. | `.agents/skill-library/engineering/user-guide/SKILL.md` |
| `verification-before-completion` | Verify completion against the selected Fast or Full lane, acceptance criteria, relevant automated checks and zero… | `.agents/skill-library/engineering/verification-before-completion/SKILL.md` |

## UI & Design (4)

| Skill | When | Path |
| --- | --- | --- |
| `design-taste-frontend` | Anti-slop frontend skill for landing pages, portfolios, and redesigns. | `.agents/skill-library/engineering/design-taste-frontend/SKILL.md` |
| `design-taste-product` | Anti-slop design skill for product UI — dashboards, in-app screens, data tables, multi-step forms and wizards,… | `.agents/skill-library/engineering/design-taste-product/SKILL.md` |
| `motion-design` | Use this skill whenever building, reviewing, or refining UI/web animation — hover effects, scroll reveals, page… | `.agents/skill-library/engineering/motion-design/SKILL.md` |
| `frontend-a11y` | MANDATORY when building any interactive React UI component, form, modal, dropdown, or navigation element. | `.agents/skill-library/engineering/frontend-a11y/SKILL.md` |

## Minimal code (ponytail) (1)

| Skill | When | Path |
| --- | --- | --- |
| `ponytail-review` | Diff/repository complexity review or a debt ledger of deliberate ponytail shortcuts. | `.agents/skill-library/engineering/ponytail-review/SKILL.md` |

## Productivity & meta (4)

| Skill | When | Path |
| --- | --- | --- |
| `wait-what` | Use immediately when an explanation, architectural rationale, or decision does not land or feels confusing. | `.agents/skill-library/productivity/wait-what/SKILL.md` |
| `handoff` | Compact the current session context, in-flight work, decisions made, and immediate next actions into a structured… | `.agents/skill-library/productivity/handoff/SKILL.md` |
| `retro` | Conduct a retrospective on a coding session or project milestone to continuously improve the agent's operating… | `.agents/skill-library/productivity/retro/SKILL.md` |
| `setup-subagents` | Detect which models each installed harness actually exposes, decide which of them the user is permitted to use, and… | `.agents/skill-library/engineering/setup-subagents/SKILL.md` |

## How to use a cold skill

1. Find the row that matches the situation (or the symptom in *Pick fast*).
2. Read that one `SKILL.md` with the file-read tool.
3. Follow it. Do not read sibling skills unless it explicitly points at one.
4. A cold skill has no `skill` tool entry — the file read **is** the load.
