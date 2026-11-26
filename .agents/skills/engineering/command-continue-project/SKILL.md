---
invocation: user
name: command-continue-project
description: "Continue the roadmap in the Fast lane by default; escalate to the Full lane only on a hard trigger. Scans PRODUCT_BACKLOG_ROADMAP.md, unblocks [!] stories, then implements the next story."
triggers:
  - "/command-continue-project"
  - "/continue"
  - "/next"
  - "/auto-continue-project"
  - "continue project"
  - "next roadmap task"
  - "work on next user story"
---

# Command: Continue Project Workflow (/command-continue-project)

Picks the next story from `docs/PRODUCT_BACKLOG_ROADMAP.md`
(created using the [roadmap template](../../../../.specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md))
and runs it through the **Fast lane** unless a hard trigger says otherwise.
Lane rules are owned by [AGENTS.md](../../../../AGENTS.md) §2 — this file only executes them.

**Requires:** `docs/PRODUCT_BACKLOG_ROADMAP.md` with schema-version `1.1` or `1.2`.
If the file is missing or older, stop and ask the user to run `/generate-backlog`.

---

## Step 0 — Pre-flight (read-only)

Run `git status --short --branch`. **Do not** fetch, rebase, stash, or install
anything. `AGENTS.md` §0.1 forbids autonomous git.

| Finding | Action |
| --- | --- |
| Dirty working tree | Report the files and ask whether to continue on top or stop. |
| Branch diverged from remote | Report it. The user decides: rebase, merge, or ignore. |
| On `main`/`master` | Ask before creating `feat/<slug>`; never branch silently. |
| Lockfile or schema drift | Mention it; run installs only after the user agrees. |

---

## Step 1 — Scan the roadmap

1. Read `docs/PRODUCT_BACKLOG_ROADMAP.md` (targeted reads; do not load the whole file twice).
2. Keep the YAML `tech-stack` block in context — it is small and every step needs it.
   Do **not** write a `00-tech-context.md` file for the Fast lane.
3. Pick the target story, in order:
   - first `[/]` (resume in-progress work);
   - else the first `[ ]` from the top of the active sprint;
   - skip `[~]` (deferred).
4. **Blocked story (`[!]`):** this is escalation trigger T5, not a stop. Offer a
   targeted interview (normally 2–3 questions per batch, no fixed total) to resolve
   the blocker, record the answers, then continue in the **Full lane**. Do not start
   implementation while the checkbox is still `[!]`.
5. **Dependency gate:** if any `Depends-on` entry is not `[x]`, refuse and name the
   blocking story.
6. Extract: US id, title, slug, effort, context-budget, AC, and the
   `Tasks (Backend)` / `Tasks (Frontend)` checklists when present.

---

## Step 2 — BA checkpoint and lane

Establish outcome, affected behavior, scope, existing evidence, material
unknowns and observable acceptance expectations in chat. Reuse confirmed story
AC and code/test evidence; ask only unanswered material questions. Record ASM-
items and never approve business assumptions by selecting an unblocked story.
Fast is the default for bounded confirmed behavior with no trigger.

| Trigger | Full lane because |
| --- | --- |
| T1 — diff > 250 lines or > 8 files | too large for one context |
| T2 — breaking/structural schema change | migration risk |
| T3 — auth, RBAC, billing, PII | security review required |
| T4 — new entity, service, or public contract | design must be recorded |
| T5 — story marked `[!]` | unresolved decisions |
| T6 — user typed `/full`, enterprise re-elicitation or audit-grade artifacts | explicit request |
| T7 — new or unresolved business behavior/rules/defaults/acceptance | baseline decisions required |

Effort `S` and `M` on an unblocked story never trigger Full lane by themselves.
Announce the choice once:

```markdown
🎯 <US-ID> — <title>
⚡ Lane: Fast | Full (<trigger or "no trigger">)
📋 Effort: <S|M|L|XL> · AC source: roadmap
```

If the user disagrees, follow the user and record the override in the story notes.

Record the lane with `node .agents/scripts/metrics.mjs start --lane <fast|full> --story <id>`
(plus `--trigger T#` when escalating). It costs one line and makes the next review
evidence-based.

---

## Step 3 — Fast lane (default)

One context. No subagents. No feature folder.

1. **Read before writing**: the files named by the story, the matching tests, and
   `CONTEXT.md` terms. Stop when you can name the exact files to change.
2. **Plan in 5 lines or fewer** in chat: files, approach, tests to add, risk.
3. **Red**: write the failing test (or reproduce the bug) and run it.
4. **Green**: minimal implementation, then run the focused test.
5. **Verify**: run the package's test/lint/typecheck for the touched area. If the
   repo has no runner for it, say so instead of inventing one.
6. **Self-check** before declaring done:
   - `[SECURITY]` injection, secrets, authz, unsafe deserialization
   - `[SPEC_FIDELITY]` every AC covered, no invented business rule
   - `[RELIABILITY]` unhandled errors, async, null/undefined paths
7. **Close**: mark the story `[x]` in the roadmap and run
   `node .agents/scripts/metrics.mjs end`. Commit only when the user asked
   (`/command-git-push` or explicit approval) — one Conventional Commit.

Write `test-plan.md` only when the story needs more than three test cases. Skip
`baseline.md`, `00-intake.md`, `CHANGELOG.md`, and `context-pack.md` entirely.

---

## Step 4 — Full lane (triggered or requested)

Only after Step 2 escalated, or the user typed `/full`. Create
`.specify/features/<slug>/` and run the full pipeline:

### 4a. Domain baseline → **Gate 1**

- `business-analyst` runs `intake-classifier` (records the lane + trigger),
  then `elicitation-interview` — 2–3 questions per batch, anchored on the roadmap
  AC. Never re-ask what the AC already settles.
- `domain-modeling` (+ gap analysis) → `risk-contradiction-scanner` → `spec-writer`
  (one `requirements.md`, four sections) → `spec-validator` (max 2 loops).
- `handover` marks `baseline.md` `SIGNED-OFF v1.0` and appends the Dev Handover Brief.
- **Stop** and present: scope, `BR-` rules, stories, risks, open `ASM-`.
  Proceed only on explicit approval.

### 4b. Technical plan → **Gate 2**

- `system-architect`: `technical-spec` → `implementation-plan` → `task-breakdown`
  → `technical-consistency-review` after all three artifacts exist (with `codebase-design`). Write `context-pack.md` before any slice dispatch.
- **Stop** and present architecture, data model, contracts, task order.
  Proceed only on explicit approval.

### 4c. Implementation

- Decompose by dependency layer. Dispatch **independent slices in parallel**;
  serialize only when one consumes another's output.
- One developer per cohesive slice (Data+Logic+API together, UI separately).
  Never split a slice into four micro-subagents.
- Each subagent reads `context-pack.md` + its scoped files, and returns the
  short slice result — never a transcript.
- `build-resolver` only on real build/type errors; `code-explorer` only when the
  affected files cannot be named.
- TDD per slice: failing test → minimal code → refactor.

### 4d. Review → **Gate 3**

- `code-reviewer` dual-pass (A: standards & security, B: spec fidelity); Pass C
  only when the diff exceeds 300 lines.
- `ui-ux-reviewer` only when UI files changed.
- Max 3 rounds; rounds 2–3 review the incremental diff only.
- Block on any unresolved `Critical`.

### 4e. Docs → **Gate 4**

- `tech-doc-architect`: `docs/features/<slug>/README.md` + index. ADR only when
  architecture actually changed.
- Text-only user-guide runs only when requested or selected for release documentation, not on each story.

### 4f. Close

- Run the repo's full test command once.
- Mark the story `[x]` in the roadmap.
- Run `node .agents/scripts/metrics.mjs end --review-rounds <n>`.
- Commit only on `/command-git-push` or explicit approval.

---

## Delivery boundary

Roadmap `[x]` and this command completion mean `DEV_COMPLETE` for the story only.
Do not create release records or deploy from /continue. When the user selects
release work, read the relevant section of
[production lifecycle](../../../docs/production-lifecycle.md); establish release
evidence and reuse matching deployment authorization separately. Push does not
prove production verification.

## Output format

```markdown
🎯 **Story:** <US-ID> — <title>
📌 **Epic / Sprint:** <epic | sprint>
⚡ **Lane:** Fast | Full (<trigger>)
📋 **Effort / Budget:** <S|M|L|XL> · <fast ≤40k | full ≤250k>
🔗 **Dependency gate:** ✅ clear | 🚫 blocked by <US-ID>
📊 **Stage:** <read | red | green | verify | review | docs | done>
🚀 **Next action:** <one concrete step>
```

## Exit checklist

- [ ] BA checkpoint established; confirmed AC reused and material gaps answered
- [ ] Lane announced with its trigger (or "no trigger")
- [ ] Fast lane: no feature folder, no subagents, AC covered by tests
- [ ] Full lane: Gate 1 and Gate 2 approved before code
- [ ] Roadmap checkbox updated
- [ ] No git mutation beyond what the user approved
