---
invocation: model
name: git-workflow
description: >
  MANDATORY when performing any git operation — branching, committing, merging, rebasing,
  or resolving conflicts. Covers branching strategies, commit message conventions,
  merge vs rebase decisions, conflict resolution, and collaborative development workflows.
  MUST be read before creating branches, writing commit messages, or merging code.
metadata:
  origin: ECC
---

# Git Workflow Patterns

Best practices for Git version control, branching strategies, and collaborative development.

> Some sections of this skill were moved to `references/` to keep the load cheap. The router listing them is at the **bottom of this file**.

## 🚨 Strict Rules for AI / Antigravity (MANDATORY)

1. **Review-Gated Commits (Zero Auto-Commit)**:
   - **NEVER** run `git commit` automatically or silently.
   - **ALWAYS** wait for the user to review all changes and explicitly request a commit (or trigger `/command-git-push`).
   - Present changed/created files clearly with clickable links and summaries for user review before committing.

2. **6-Layer Modular Commits Breakdown**:
   - **DO NOT** lump all changes across multiple layers into one giant commit.
   - **ALWAYS** break down commits into granular, logical parts by domain/layer:
     - **Layer 1 - Specifications & BA Documents**:
       - Files: `.specify/**`, `specs/**`, `docs/spec/**`
       - Command: `git add .specify/ specs/ && git commit -m "docs(spec): add specification and test plan for <feature-name>"`
     - **Layer 2 - Shared Types & DTOs**:
       - Files: `packages/shared-types/**`
       - Command: `git add packages/shared-types/ && git commit -m "feat(shared-types): define DTOs and contracts for <feature-name>"`
     - **Layer 3 - Backend API & Services**:
       - Files: `apps/api/**`, `prisma/**`
       - Command: `git add apps/api/ prisma/ && git commit -m "feat(api): implement <feature-name> service and endpoints"`
     - **Layer 4 - Frontend Web UI & Components**:
       - Files: `apps/web/**`
       - Command: `git add apps/web/ && git commit -m "feat(web): implement <feature-name> UI components and views"`
     - **Layer 5 - Technical Docs, User Guides & Roadmap**:
       - Files: `docs/**`, `README.md`, `CHANGELOG.md`
       - Command: `git add docs/ CHANGELOG.md && git commit -m "docs: update feature documentation, user guide, and roadmap"`
     - **Layer 6 - Chores, Governance, Configs & Tooling**:
       - Files: `.agents/**`, `package.json`, `pnpm-lock.yaml`, root configs
       - Command: `git add .agents/ package.json pnpm-lock.yaml && git commit -m "chore: update configs and agent skills"`

3. **Strictly Single-Line English Commit Messages**:
   - Every commit message **MUST be on strictly a single line** in English.
   - Follow Conventional Commits: `<type>(<scope>): <subject>` (e.g. `feat(cards): implement contextual card creation with 3D preview`).
   - Imperative mood, lowercase scope, no trailing period, maximum 72 characters.
   - Never write multi-line paragraphs or markdown backticks inside the `git commit -m "..."` command string.

4. **Branch Minimization & Reuse Priority (Zero Unnecessary Branches)**:
   - **ALWAYS prioritize existing / active branches** for ongoing feature work, related fixes, design adjustments, refactorings, and documentation updates.
   - **DO NOT spawn new branches needlessly**. Avoid branch clutter and overhead.
   - **ONLY create a new branch as a last resort** when starting a completely distinct, unrelated feature or epic that cannot logically live on the current branch.

5. **User Guide Verification (On Request or Release Requirement)**:
   - Check `docs/user-guides/<slug>.md` only when the user requested a guide or the target release requires it. A UI change alone does not create a guide gate.
   - Verify concise text instructions against confirmed behavior and check local links. Preserve existing custom content and image assets.
   - Use `/command-user-guide <slug>` for selected text-guide work; no browser capture, annotation or application startup is required. Text-only guides satisfy this workflow.
   - UI review and E2E tests retain their own evidence requirements; those are separate from guide production.

6. **Mandatory English Pull Request Description**:
   - Whenever pushing changes to a remote branch (or completing a commit/push cycle), **ALWAYS** provide a ready-to-copy **Pull Request Title and Description in English** following the PR template (`## What & Why`, `## Key Changes`, `## Verification`, `## Screenshots / Artifacts`).
   - This ensures immediate traceability, clean review handoff, and frictionless PR creation on GitHub.

7. **Pre-Flight Auto-Sync with `origin/main` & Monorepo Drift Refresh**:
   - Before starting new work or resuming a roadmap story on any branch, **ALWAYS** fetch `origin/main` and rebase to keep local history up-to-date.
   - If `pnpm-lock.yaml` changed during rebase: run `pnpm install`.
   - If `prisma/schema.prisma` or migrations changed during rebase: run `pnpm --filter api prisma generate`.

8. **Intelligent Semantic Conflict Resolution with Verification Gate**:
   - When a rebase/merge conflict occurs (`<<<<<<<`, `=======`, `>>>>>>>`):
     1. Automatically parse both sides of the conflict.
     2. Semantically merge the changes, preserving business logic and type safety.
     3. Remove all conflict markers.
     4. **MANDATORY Gate**: Run unit/component tests (`pnpm test`) and typecheck before running `git rebase --continue`.
     5. If business rules are inherently ambiguous or conflicting, abort cleanly with `git rebase --abort` and ask the user.

9. **Multi-Scope Detection & Automatic Branch Isolation**:
   - When unstaged or modified changes span across multiple unrelated domains (e.g. `auth` vs `decks` vs `agents`):
     - **NEVER** lump them all into the current branch.
     - **ALWAYS** notify the user with a scope breakdown table.
     - **Auto-split & isolate workflow**:
       1. Commit matching files for current branch first.
       2. Stash remaining files: `git stash push -m "multi-scope-stash"`.
       3. Checkout target branch: `git checkout <target-branch>`.
       4. Restore files: `git checkout stash@{0} -- <files_for_this_scope>`.
       5. Commit and push on target branch.
       6. Return to original branch.

10. **Strict Domain-to-Branch Mapping & Cross-Contamination Prevention**:
    - **Global Governance, Agent Rules & Skill References** (`.agents/**`, `GEMINI.md`, `.specify/templates/**`, `package.json`, root configs):
      - **Target Domain**: `chore/governance-<slug>` or `chore/agent-skills` (or `main` if merged).
      - **STRICT PROHIBITION**: NEVER commit global governance or agent configs into domain feature branches (e.g. `feat/card-management`, `feat/auth-*`, `feat/deck-*`).
    - **Feature-Specific Code & Documents** (`apps/web/src/features/<domain>/**`, `apps/api/src/modules/<domain>/**`, `specs/<slug>/**`, `docs/features/<slug>/**`, `docs/user-guides/<slug>.md`):
      - **Target Domain**: `feat/<domain>-<feature-slug>` (e.g. `feat/card-management`, `feat/deck-crud-management`). All specs and user guides for a feature live together on the feature branch.
    - **Global Architecture, Roadmaps & Product References** (`docs/architecture/**`, `docs/algorithms/**`, `docs/PRODUCT_BACKLOG_ROADMAP.md`, `README.md`, `vocabulary-app-feature-ideas*.md`):
      - **When modified alongside a feature**: Commit on that feature's branch (`feat/<slug>`).
      - **When updated independently (standalone roadmap/architecture update)**: `docs/<topic-slug>` (e.g. `docs/update-roadmap`, `docs/sm2-algorithm-reference`).
    - **Shared Libraries & Packages** (`packages/shared-types/**`):
      - Belongs to the feature branch that introduced/modified the DTOs, or `chore/shared-types` if standalone.
    - **Auto-Routing Gate**: If changed files do not match `CURRENT_BRANCH`, AI must alert the domain mismatch, isolate the changes via stash/branch checkout, and keep every feature branch 100% focused on its core domain.

6. **Mandatory English Pull Request Description**:
   - Whenever pushing changes to a remote branch (or completing a commit/push cycle), **ALWAYS** provide a ready-to-copy **Pull Request Title and Description in English** following the PR template (`## What & Why`, `## Key Changes`, `## Verification`, `## Screenshots / Artifacts`).
   - This ensures immediate traceability, clean review handoff, and frictionless PR creation on GitHub.

7. **Pre-Flight Auto-Sync with `origin/main` & Monorepo Drift Refresh**:
   - Before starting new work or resuming a roadmap story on any branch, **ALWAYS** fetch `origin/main` and rebase to keep local history up-to-date.
   - If `pnpm-lock.yaml` changed during rebase: run `pnpm install`.
   - If `prisma/schema.prisma` or migrations changed during rebase: run `pnpm --filter api prisma generate`.

8. **Intelligent Semantic Conflict Resolution with Verification Gate**:
   - When a rebase/merge conflict occurs (`<<<<<<<`, `=======`, `>>>>>>>`):
     1. Automatically parse both sides of the conflict.
     2. Semantically merge the changes, preserving business logic and type safety.
     3. Remove all conflict markers.
     4. **MANDATORY Gate**: Run unit/component tests (`pnpm test`) and typecheck before running `git rebase --continue`.
     5. If business rules are inherently ambiguous or conflicting, abort cleanly with `git rebase --abort` and ask the user.

9. **Multi-Scope Detection & Automatic Branch Isolation**:
   - When unstaged or modified changes span across multiple unrelated domains (e.g. `auth` vs `decks` vs `agents`):
     - **NEVER** lump them all into the current branch.
     - **ALWAYS** notify the user with a scope breakdown table.
     - **Auto-split & isolate**: Commit the files matching the current branch first, then automatically checkout/switch to the relevant target branches to commit and push the remaining files into their respective isolated branches.
## When to Activate

- Setting up Git workflow for a new project
- Deciding on branching strategy (GitFlow, trunk-based, GitHub flow)
- Writing commit messages and PR descriptions
- Resolving merge conflicts
- Managing releases and version tags
- Onboarding new team members to Git practices

## References (read on demand)

This skill is split so a load costs ~2.8k tokens instead of ~6.3k. The mandatory rules above always apply; open a reference only for the operation you are actually performing.

| Open | Contains |
| --- | --- |
| `references/branching-and-commits.md` | Branching Strategies, Commit Messages, Branch Management |
| `references/merge-rebase-conflicts.md` | Merge vs Rebase, Conflict Resolution |
| `references/pr-and-release.md` | Pull Request Workflow, What, Why, How, Testing, Screenshots (if applicable), Checklist, Release Management |
| `references/config-hooks-antipatterns.md` | Git Configuration, Common Workflows, Git Hooks, Anti-Patterns, Quick Reference |

Never load more than one reference file at a time.
