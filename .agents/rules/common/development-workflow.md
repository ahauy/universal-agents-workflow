# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature
> development process that happens before git operations.

**BA checkpoint first.** Establish outcome, affected behavior, scope, evidence,
material unknowns and acceptance in chat; reuse confirmed answers. New/unresolved
business behavior triggers T7. Roadmap labels never bypass risk triggers.
 Run `intake-classifier` and announce Fast or Full (rules in
`AGENTS.md` §2). The steps below marked *Full lane* are skipped entirely in the
Fast lane — that is not a shortcut, it is the default path.

## Fast lane (default)

1. Read the target files, their tests, and the relevant `CONTEXT.md` terms.
2. Plan in five lines or fewer: files, approach, tests, risk.
3. Red → Green → Refactor on the smallest useful test.
4. Verify with the repo's test/lint/typecheck for the touched area.
5. Self-check `SECURITY`, `SPEC_FIDELITY`, `RELIABILITY`.
6. One Conventional Commit, only when the user asked.

No feature folder, no subagents, no `baseline.md`.

## Full lane (escalation only)

0. **Deep Business Analysis & Domain Elicitation** _(mandatory before any technical
   specification in this lane)_
   - Probe the **6-Pillar Domain Framework**:
     1. Goal & Personas (Mục tiêu & Phân quyền RBAC)
     2. Business Rules & Logic (Validation, thuật toán domain, state machines)
     3. Workflows & Edge Cases (Happy path, negative cases, concurrency, error recovery)
     4. Entities & Data Model (Trường dữ liệu, quan hệ entities/models, lifecycle)
     5. UX/UI Behaviors (Empty/Loading/Error states, feedbacks, toasts/modals)
     6. Impact & Non-Functional (Tương thích ngược, bảo mật, hiệu năng)
   - **Interactive Interview**: Ask structured questions with recommended options and
     trade-offs. Never make silent business assumptions.
   - **Research & Reuse**: GitHub search (`gh search repos/code`), library docs, and
     package registries for battle-tested solutions before writing net-new code.

1. **Plan First (UAW Native Planning)**
   - Use `technical-spec` → `spec.md` with verified domain decisions.
   - Use `implementation-plan` → `plan.md`; supporting models/contracts only when relevant.
   - Use `task-breakdown` → `tasks.md` with dependency-ordered phases.
   - Run `technical-consistency-review` only after spec/plan/tasks exist.
   - Reuse signed-off BA evidence; obtain baseline approval (Gate 1) before
     technical planning, then plan/tasks approval (Gate 2) before code.

2. **TDD Approach**
   - Write tests first (RED), implement to pass (GREEN), refactor (IMPROVE).
   - Verify the coverage target the repo already enforces; do not invent one.

3. **Code Review**
   - Use **code-reviewer** agent immediately after writing code.
   - Address CRITICAL and HIGH issues.
   - Fix MEDIUM issues when possible.

4. **Commit & Push**
   - Detailed commit messages.
   - Follow conventional commits format.
   - See [git-workflow.md](./git-workflow.md) for commit message format and PR process.

5. **Pre-Review Checks**
   - Verify all automated checks (CI/CD) are passing.
   - Report merge conflicts; never auto-resolve or rebase.
   - Ensure branch is up to date with target branch.
   - Only request review after these checks pass.
