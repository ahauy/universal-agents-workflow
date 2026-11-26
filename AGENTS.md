# Universal Agent Development Workflow

Unified pipeline with two lanes: **Fast** (default, one context) and **Full**
(BA baseline → UAW native planning → scoped TDD). Lane rules in §2.

This file is the **core contract**. It is deliberately short so it is never truncated.
Deep detail lives in `.agents/docs/` and is read on demand, not at session start.

---

## 0. Non-negotiables (read first, always apply)

1. **Zero autonomous git.** Never run `git add`, `git commit`, or `git push` unless
   the user explicitly ran `/command-git-push`, or you proposed the exact changes
   and received explicit approval. Never auto-rebase or auto-resolve conflicts.
2. **Zero code before a signed-off baseline — in the Full lane.** Full-lane work
   starts only after `baseline.md` reads `SIGNED-OFF`. The Fast lane (the default)
   uses a concise BA checkpoint in chat before TDD; it creates no baseline artifact.
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
| 1 | BA checkpoint → pick lane | `intake-classifier` | Fast (default) or Full (trigger) |
| 2 | Domain baseline — **Full lane only** | `elicitation-interview` → `domain-modeling` → `risk-contradiction-scanner` → `spec-writer` → `spec-validator` → `handover` | **Gate 1**: baseline SIGNED-OFF |
| 3 | Technical plan — **Full lane only** | `technical-spec` → `implementation-plan` → `task-breakdown` → `technical-consistency-review` | **Gate 2**: plan + tasks approved |
| 3.5 | Scaffold — Full lane, greenfield only | `scaffold-architecture` | blueprint ADR |
| 4 | TDD implementation | Fast: one context. Full: `implementation-orchestrator` + scoped slices | tests green |
| 5 | Review | Fast: self-check. Full: `code-reviewer` (+ `ui-ux-reviewer` if UI changed) | **Gate 3**: zero Critical |
| 6 | Docs — **Full lane only** | `technical-documentation` | feature README indexed |
| 7 | Ship (user-triggered) | `/command-git-push` | commits pushed |

Fast lane is steps **1 → 4 → 5 (self-check) → 7**. Full lane is all seven.
Full detail: **`.agents/docs/pipeline-detail.md`**.

Two names that are easy to confuse:

- `requirements.md` — **what and why**. Written once in Step 2, four sections.
  Audience documents (BRD / PRD / SRS / user stories) are **rendered** from it only
  when a real external audience exists — never authored separately.
- `spec.md` — **how** (DTOs, contracts, schema). Written in Step 3 by
  `technical-spec`. Never write it from Step 2.

Note: `handover` (BA exit gate) ≠ `handoff` (session compaction).

---

## 2. Two lanes: Fast by default, Full on trigger

Before implementation, establish the outcome, affected behavior, scope, existing
evidence, material unknowns and observable acceptance expectations. Reuse answered
questions and confirmed requirements; ask only for missing material decisions.
Keep this checkpoint in chat for clear bounded work. Read-only research does not
start a recursive BA implementation process.

Default is **Fast** for bounded work with confirmed existing behavior and no
trigger. Escalate the moment a trigger fires. Sizing labels (Tier 1/2/3, roadmap S/M/L/XL) describe
**scope only** — the lane decides ceremony.

| Lane | Entry | Ceremony | Token budget |
| --- | --- | --- | --- |
| **Fast** (default) | bounded, confirmed behavior; no trigger | one context: BA checkpoint + target/AC → 5-line plan → failing test → code → verify → self-check → done (commit only on request) | ≤ 40k |
| **Full** (triggered or requested) | any escalation trigger, or the user says `/full` | domain baseline (Gate 1) → plan + tasks (Gate 2) → slices → dual-pass review → docs | ≤ 250k |

### Escalation triggers — any one is enough

| # | Trigger |
| --- | --- |
| T1 | Expected diff > 250 lines or > 8 files |
| T2 | Breaking/structural DB schema change, or a migration with data-loss risk |
| T3 | Auth, permissions/RBAC, billing/payments, or PII |
| T4 | A new core domain entity, service, or public API contract |
| T5 | Roadmap story marked `[!]` |
| T6 | The user asks for `/full`, enterprise re-elicitation, or audit-grade artifacts |
| T7 | New or unresolved business behavior, rules, defaults or material acceptance decisions |

Escalation is **one-way for that task**: announce it once
(`Escalating to Full lane: T3 auth`), create `.specify/features/<slug>/`, and
continue from Step 2. Never downgrade mid-task. Never run Full-lane ceremony
"just in case".

Fast lane never creates a feature folder. It writes `test-plan.md` only when the
task needs more than three test cases.

**Roadmap evidence:** reuse confirmed story AC and dependencies in the checkpoint.
An unblocked S/M label never exempts a story from T1–T7. Minor resolved technical
questions alone do not require Full. Full reuses signed-off evidence and fills
only material gaps; never repeat an answered interview.

**Budget discipline:** if a run exceeds its lane budget by more than 50 %, stop and
report before continuing. Silent overrun is a process bug.

**Evidence:** when the lane is announced run
`node .agents/scripts/metrics.mjs start --lane <fast|full> --story <id>`, and when the
task closes run `node .agents/scripts/metrics.mjs end`. `... report` prints medians per
lane. Do this for the first 10 tasks after any workflow change — "feels faster" is
not evidence.

---

## 3. Context discipline

This is the highest-leverage rule in the framework. Context is the scarce resource.

- **Read on demand, never eagerly.** Do not preload skills "just in case". Open a
  skill only when the current step needs it, and open only the section you need.
- **Never read a whole artifact when a section will do.** Use targeted reads
  (`offset` / `limit`) on large specs, templates, and references.
- **Context Pack between phases (Full lane only).** Before delegating a Full-lane
  slice or starting a new Full-lane phase, write
  `.specify/features/<slug>/context-pack.md` (≤ 150 lines) from
  `.specify/templates/context-pack.md`. It carries only: scope, the `BR-`/`REQ-`
  ids in play, acceptance criteria, contracts, and the exact files to touch.
  Downstream agents read the pack, not the full spec chain. The Fast lane delegates
  nothing, so it writes no pack.
- **Skills are cold by default.** `.agents/skills/` holds only entry points and
  slash commands — that is the set every harness indexes on every request.
  Everything else lives in `.agents/skill-library/` and costs nothing until read.
  To use one: read `.agents/SKILLS.md`, pick one row, open one `SKILL.md`.
  Never preload the library.
- **Large skills are routers.** When a `SKILL.md` points at `references/*.md`, read
  the router first and open one reference file at a time.

Reference index (consult by situation, not by reading all of it):

- Skill catalog → `.agents/SKILLS.md`
- Skill → path lookup: `.agents/docs/skill-matrix.md`
- Token cost of context, skills, MCP, hooks: `.agents/docs/token-budget.md`
- "Which skill do I need?" symptom index: `.agents/docs/failure-modes.md`
- Large file → which section to jump to: `.agents/docs/reading-map.md`
- Using this template in another agent/IDE: `.agents/docs/harness-compatibility.md`
- Step-by-step walkthrough: `.agents/docs/workflow-step-by-step.md`

---

## 4. Delegation contract

Delegation is a **Full-lane** tool. The Fast lane runs in one context.

- **Fast lane**: no subagents. Implement, verify, and self-check in the same
  context. A two-file change never fans out.
- **Full lane**: delegate slices. Pass **scoped excerpts** (via the context pack),
  never the full spec chain. Dispatch independent slices in parallel; serialize
  only when one slice consumes another's output.
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
| 1 | `baseline.md` = `SIGNED-OFF v1.0` | Full lane, Steps 3–7 |
| 2 | `plan.md` + `tasks.md` approved by user | Full lane, Steps 3.5–7 |
| 3 | Zero unresolved `Critical` findings | merge / delivery (both lanes) |
| 4 | Feature README exists and is indexed | Full-lane delivery |

Fast lane closes on: tests green + self-check clean + (if requested) one commit.

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

**Full lane**: dual-pass review (A: standards & security, B: spec fidelity). Pass C
(lean) only for diffs over 300 lines. Full protocol and the 4 stopping rules:
`.agents/agents/code-reviewer.md`.

**Fast lane**: a self-check against the same buckets (security, spec fidelity,
reliability), no separate reviewer context. Escalate to `code-reviewer` only when
the diff touches auth/payments/PII or exceeds 300 lines.

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

Distribution uses `install.sh` or `install.ps1` to download local framework files.
Read and edit artifacts directly, following their immutability and sign-off rules.
Use the `spec-validator` skill from `.agents/SKILLS.md` for evidence-based review;
it is an agent workflow, not an executable compliance certification.
