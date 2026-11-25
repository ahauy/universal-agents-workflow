# Universal Agent Development Workflow

Unified pipeline: **BA Skill Pack** (analysis) → **Speckit** (planning) → **Superpowers** (execution).

This file is the **core contract**. It is deliberately short so it is never truncated.
Deep detail lives in `.agents/docs/` and is read on demand, not at session start.

---

## 0. Non-negotiables (read first, always apply)

1. **Zero autonomous git.** Never run `git add`, `git commit`, or `git push` unless
   the user explicitly ran `/command-git-push`, or you proposed the exact changes
   and received explicit approval. Never auto-rebase or auto-resolve conflicts.
2. **Zero code before a signed-off baseline.** Tier 3 work starts only after
   `baseline.md` reads `SIGNED-OFF`. Tier 1/2 bypass this and go straight to TDD.
3. **Zero `Critical` bugs.** A branch with an unresolved `Critical` finding is not
   complete. No exceptions.
4. **Zero silent assumptions.** Never invent a business rule, formula, default,
   error behaviour, or edge case. Ask the user. Record unknowns as `ASM-` ids.
5. **Minimal code first.** Walk the ladder: does it need to exist → already in
   repo → stdlib → native platform → installed dependency → one line → minimum.
6. **Immutability.** Return new copies; never mutate state in place.

---

## 1. Pipeline at a glance

| # | Step | Entry skill | Exit gate |
| --- | --- | --- | --- |
| 1 | Intake & tier classification | `intake-classifier` | tier assigned |
| 2 | Domain baseline (Tier 3) | `elicitation-interview` → `domain-modeling` → `consistency-scan` → `spec-writer` → `spec-validator` → `handover` | **Gate 1**: baseline SIGNED-OFF |
| 3 | Technical plan | `speckit-specify` → `speckit-plan` → `speckit-tasks` | **Gate 2**: plan + tasks approved |
| 3.5 | Scaffold (greenfield only) | `scaffold-architecture` | blueprint ADR |
| 4 | TDD implementation | `implementation-orchestrator` | tests green |
| 5 | Review | `code-reviewer` (+ `ui-ux-reviewer` if UI changed) | **Gate 3**: zero Critical |
| 6 | Docs | `technical-documentation` | feature README indexed |
| 7 | Ship (user-triggered) | `/command-git-push` | commits pushed |

Full stage detail: **`.agents/docs/pipeline-detail.md`** — read only the step you are on.

Two names that are easy to confuse:

- `requirements.md` — **what and why**. Written once in Step 2, four sections.
  Audience documents (BRD / PRD / SRS / user stories) are **rendered** from it only
  when a real external audience exists — never authored separately.
- `spec.md` — **how** (DTOs, contracts, schema). Written in Step 3 by
  `speckit-specify`. Never write it from Step 2.

Note: `handover` (BA exit gate) ≠ `handoff` (session compaction).

---

## 2. Three-tier speed lanes

`intake-classifier` assigns the lane from measurable signals.

| Tier | Signal | Ceremony | Token budget |
| --- | --- | --- | --- |
| 1 | < 80 lines, bug fix, typo, single config | none — reproduce → failing test → fix → verify → one commit | ≤ 20k |
| 2 | 80–250 lines, roadmap story with AC, not `[!]` | `test-plan.md` → TDD → review | ≤ 80k |
| 3 | > 250 lines, new core entity, auth/billing, or `[!]` | full domain baseline + plan | ≤ 250k |
| Spike | research question | note only, no feature folder | ≤ 15k |

**Roadmap bypass:** a planned story from `docs/PRODUCT_BACKLOG_ROADMAP.md` that is
not marked `[!]` never re-enters BA ceremony. Go straight to Tier 1 or Tier 2 TDD.

**Budget discipline:** if a run exceeds its lane budget by more than 50 %, stop and
report before continuing. Silent overrun is a process bug.

---

## 3. Context discipline

This is the highest-leverage rule in the framework. Context is the scarce resource.

- **Read on demand, never eagerly.** Do not preload skills "just in case". Open a
  skill only when the current step needs it, and open only the section you need.
- **Never read a whole artifact when a section will do.** Use targeted reads
  (`offset` / `limit`) on large specs, templates, and references.
- **Context Pack between phases.** Before delegating or starting a new phase, write
  `.specify/features/<slug>/context-pack.md` (≤ 150 lines) from
  `.specify/templates/context-pack.md`. It carries only: scope, the `BR-`/`REQ-`
  ids in play, acceptance criteria, contracts, and the exact files to touch.
  Downstream agents read the pack, not the full spec chain.
- **Large skills are routers.** When a `SKILL.md` points at `references/*.md`, read
  the router first and open one reference file at a time.

Reference index (consult by situation, not by reading all of it):

- Skill → path lookup: `.agents/docs/skill-matrix.md`
- "Which skill do I need?" symptom index: `.agents/docs/failure-modes.md`
- Large file → which section to jump to: `.agents/docs/reading-map.md`
- Using this template in another agent/IDE: `.agents/docs/harness-compatibility.md`
- Step-by-step walkthrough: `.agents/docs/workflow-step-by-step.md`

---

## 4. Delegation contract

Delegation is encouraged, not mandatory at every step. Match the mechanism to the
work size.

- **Tier 1 / Tier 2**: the orchestrator may implement directly. Do not fan out into
  micro-subagents for a two-file change.
- **Tier 3**: delegate slices. Pass **scoped excerpts** (via the context pack), never
  the full spec chain.
- **Subagents return summaries**, not transcripts: what changed, which files, which
  findings. Never paste file contents back.

Dispatch hygiene:

- Keep the `task` string short (< 400 chars), single-line, plain ASCII. No quotes,
  emoji, LaTeX, Markdown tables, or pasted file contents inside it.
- Reference artifacts by path and let the subagent read them.
- The persona already lives in the agent file — never re-inject it.

**Two-strike fallback (prevents deadlock):** if a dispatch fails twice with a syntax
error, or returns without its declared artifacts, stop retrying. Execute the stage
inline, verify the artifacts exist and are non-empty, then tell the user which
subagent was bypassed and why.

**Transparency:** when a subagent is dispatched or finishes, announce in chat:
name & role, active model, task scope, output artifact path.

---

## 5. Gates

| Gate | Condition | Blocks |
| --- | --- | --- |
| 1 | `baseline.md` = `SIGNED-OFF v1.0` | Steps 3–7 |
| 2 | `plan.md` + `tasks.md` approved by user | Steps 3.5–7 |
| 3 | Zero unresolved `Critical` findings | merge / delivery |
| 4 | Feature README exists and is indexed | delivery |

Post-sign-off scope changes bump a version in `CHANGELOG.md`. Never edit
signed-off content in place.

---

## 6. Code & review standards

- File < 800 lines, function < 50 lines, nesting < 3 levels.
- Validate all inputs at boundaries via DTOs and schema validators.
- Handle errors explicitly; never swallow silently.
- No unrequested abstractions: no single-implementation interface, no one-product
  factory, no config for a constant.
- Mark deliberate simplifications with a `ponytail:` comment naming the ceiling and
  the upgrade path.

Review runs dual-pass by default (A: standards & security, B: spec fidelity).
Pass C (lean) only for diffs over 300 lines. Full protocol and the 4 stopping
rules: `.agents/agents/code-reviewer.md`.

UI work additionally requires: no unrequested gradients, no glassmorphism, 1px
hairline borders, explicit type hierarchy, stable outer anchor for hover physics.

---

## 7. Data plane

| Artifact | Purpose |
| --- | --- |
| `CONTEXT.md` | Ubiquitous language. Update inline when terminology is clarified. |
| `adr/` | Immutable architectural decisions. Never edit an accepted ADR; supersede it. |
| `.specify/features/<slug>/` | Working files for one feature. |
| `.specify/features/<slug>/exports/` | Rendered audience documents (BRD/PRD/SRS/US). Derived from `requirements.md` — never hand-edited. |
| `.specify/templates/` | Templates for spec, plan, tasks, test-plan, context-pack. |

MCP server (`packages/mcp-server`) exposes safe writes for these artifacts:
`uaw_update_context`, `uaw_record_adr`, `uaw_scaffold_feature`, `uaw_validate_spec`,
`uaw_ponytail_scan`, `uaw_check_git_locks`.
