# Agent Orchestration & Subagent Catalog

## Skill-Based Workflow & Subagents

This project uses skills from `.agents/skills/` and structured subagent personas from `.agents/agents/` across all development phases.
See `.agents/AGENTS.md` for the unified pipeline and mandatory quality gates.

---

## Universal Subagent Persona Catalog

| Subagent                  | Role                                                                              |   Lifecycle Phase   | Model     |
|:--------------------------|:----------------------------------------------------------------------------------| :------------------: |-----------|
| **`business-analyst`**    | 8-Stage BA Pipeline, IEEE 29148, BR- rules, SRS/US, Baseline Sign-off             |     **Phase 1**     | `inherit` |
| **`system-architect`**    | Speckit Specify/Plan/Tasks, API DTO contracts, Database migrations, ADRs          |    **Phase 2-4**    | `inherit` |
| **`code-explorer`**       | Read-only codebase research, execution path tracing, dependency mapping           |     **Phase 5**     | `inherit` |
| **`backend-developer`**   | Polyglot backend, API DTOs, database schema migrations, unit/integration tests    |     **Phase 5**     | `inherit` |
| **`frontend-developer`**  | Polyglot frontend UI, design tokens, 4 UX states, WCAG AA a11y, component tests   |     **Phase 5**     | `inherit` |
| **`slice-implementer`**   | Fullstack vertical slice orchestrator & cross-layer TDD integration               |     **Phase 5**     | `inherit` |
| **`build-resolver`**      | Polyglot typecheck, compile, dependency resolution & compiler error fixes         |     **Phase 5**     | `inherit` |
| **`e2e-runner`**          | Playwright E2E test journeys & critical flow verification                         |     **Phase 5**     | `inherit` |
| **`code-reviewer`**       | Adversarial dual-pass code review (Standards & Spec fidelity)                     |     **Phase 6A**    | `inherit` |
| **`ui-ux-reviewer`**      | Adversarial UI/UX review (Anti-AI-slop, 4 UX states, WCAG AA, motion)             |     **Phase 6A**    | `inherit` |
| **`tech-doc-architect`**  | Diataxis technical docs, feature READMEs, Architecture/Algorithm sync             |     **Phase 6B**    | `inherit` |
| **`user-guide-creator`**  | End-user guides with browser screenshots & Red Callout boxes (#EF4444)            |     **Phase 6B**    | `inherit` |
| **`agent-evaluator`**     | 5-axis agent quality evaluation, session friction & rule refinement               | **Phase 6B / Meta** | `inherit` |

---

## Model Allocation Policy

Every agent ships with `model: inherit`, so subagents run on whatever model the user selected for the session. This keeps the workflow harness-agnostic (Claude, Gemini, GLM, Qwen, DeepSeek, local models) and avoids hard failures from model IDs that do not exist on the active endpoint.

- **Default**: leave `model: inherit` in the agent frontmatter.
- **Opt-in override**: set `model:` only to an ID the *current* harness actually serves (Claude Code accepts `sonnet`, `opus`, `haiku`; other harnesses use their own catalog). Never commit a vendor-specific ID that is not resolvable in the active session.
- **Capability guidance**: phases 1-4 (domain modeling, risk scanning, architectural trade-offs, contract design) benefit from the strongest reasoning model available. Phases 5-6 (TDD iteration, diagnostics, checklist reviews, documentation) tolerate a faster, cheaper model.
- **Consistency check**: when overriding, keep every agent in the same phase chain on a reachable model, otherwise delegation fails mid-pipeline.

---

## Parallel Task Execution

ALWAYS use parallel task execution for independent operations:

```markdown
# GOOD: Parallel execution

Launch 3 agents in parallel:

1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# BAD: Sequential when unnecessary

First agent 1, then agent 2, then agent 3
```

---

## Dispatch & Delegation

Single source of truth: **`AGENTS.md` §4 (Delegation contract)**. It covers dispatch
hygiene (short ASCII `task` strings, reference by path), the two-strike fallback that
prevents deadlock, subagent transparency, and the completion contract.

Delegation is **tier-gated**: Tier 1 and Tier 2 may be implemented directly by the
orchestrator; only Tier 3 fans out into slices. Do not spawn micro-subagents for a
two-file change.
