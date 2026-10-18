---
invocation: user
name: implementation-orchestrator
description: >
  Use once handover has signed off a WordStreak feature's baseline and spec
  (Phase 3 complete) and it's time to write the actual code. Reads the
  signed-off spec, decomposes it into independent vertical slices, delegates
  each slice to a scoped subagent (or an isolated session when subagents
  aren't available), and routes review to a separate context with no
  visibility into the implementer's own reasoning. Trigger this whenever the
  user says "let's implement this", "start coding the feature", "build what
  we speced", or once baseline.md shows Status: SIGNED-OFF. Do not implement
  directly from the full spec inside one continuous context — decompose and
  delegate, or context bloats exactly the way splitting BA from code was
  meant to prevent. Do not begin implementation at all if the baseline is
  still DRAFT — that's handover's gate, not this skill's to override.
---

# Implementation Orchestrator

Phase 4, Stage 9 — bridges the signed-off Domain Decision Baseline to actual
code, without dragging the full BA history or the full spec into one coding
context. The orchestrator's own context should stay thin throughout: it
decomposes, delegates, and collects short result summaries — it never
re-reads a subagent's full working transcript, and it never implements more
than one slice itself in the same context.

See `/README.md` for the pipeline this stage extends and the shared file
conventions it reuses.

## 1. Confirm the requirements baseline (Tier-Aware Gate)

- **Tier 3 (Full Feature / Epic)**: Read `baseline.md`. If `Status` is not `SIGNED-OFF`, stop and send the user back to `handover`.
- **Tier 1 (Fast-Track) & Tier 2 (Roadmap US)**: Verify that the task's Acceptance Criteria (AC) are defined in `PRODUCT_BACKLOG_ROADMAP.md` or `test-plan.md`. Bypasses `baseline.md` requirement entirely to prevent ceremony overhead.

## 2. Decompose into slices (Calibrated by Task Tier)

- **Tier 1 (< 80 lines)**: **Zero Slicing**. Implement directly via single developer turn using TDD.
- **Tier 2 (80–250 lines)**: **Cohesive Slicing**. Merge adjacent layers into a single end-to-end slice (Data + Logic + API handled by one developer subagent, UI by frontend subagent). **Do NOT split into 4 micro-subagents.**
- **Tier 3 (> 250 lines)**: Read `spec/SRS.md` and `spec/user-stories.md`. Group `REQ-`/`US-` items into slices by **dependency layer**, not by file or by feature area:
  - **Data layer** — schema/migration, `BR-` validations
  - **Domain/business logic** — algorithms, state machine transitions
  - **API/interface layer** — endpoints, contracts
  - **UI layer** — screens and states from `03-domain-model.md`

Record in `implementation/slice-plan.md` (Tier 3 only):

```markdown
# Slice Plan: <Feature Title>

| Slice           | Layer        | REQ/BR covered                    | Depends on | Parallel-safe with |
| --------------- | ------------ | --------------------------------- | ---------- | ------------------ |
| SLICE-STREAK-01 | Data         | REQ-STREAK-001, BR-STREAK-004     | —          | none               |
| SLICE-STREAK-02 | Domain logic | REQ-STREAK-001, BR-STREAK-004/005 | SLICE-01   | SLICE-03           |
| SLICE-STREAK-03 | API          | REQ-STREAK-002                    | SLICE-01   | SLICE-02           |
```

## 3. Delegate each slice to a scoped subagent

If an isolated-context mechanism is available in this environment (e.g. a
subagent/task tool), spawn one per slice. Never implement multiple slices
back-to-back in the orchestrator's own context — that reproduces the exact
bloat this skill exists to avoid. Give each subagent **only**:

- the `REQ-`/`BR-`/`US-` excerpts it covers, not the full spec
- the matching acceptance criteria from `spec/user-stories.md`
- the existing code it needs to touch, scoped — not the whole repo

Instruct each subagent to return a short result, not a transcript:

```markdown
### Slice result: SLICE-STREAK-01

**Files changed**: <list>
**REQ/BR implemented**: REQ-STREAK-001, BR-STREAK-004
**Deviations from spec, if any**: <none | describe + why>
**Tests added**: <list, or "none — flagged for review">
```

If no isolation mechanism exists in this environment, run slices in
separate, explicitly reset sessions instead — the isolation matters more
than the specific mechanism. Either way, the orchestrator writes only the
short result block above into `implementation/slice-<n>-report.md`, never
the subagent's full working log.

## 4. Independent review — fresh context, adversarial

Once slices land, review runs in its own subagent (`code-reviewer`) or fresh session that
receives **only**:

- **Round 1**: the full diff (or changed-file list) the slices produced against base branch
- **Rounds 2 & 3**: **incremental diff only** (`git diff HEAD~1` or fix commit diff) plus previous open finding IDs
- `spec/user-stories.md` acceptance criteria
- the relevant `BR-` rules from `03-domain-model.md`

It must **not** receive the implementer's reasoning, chat history, or
"deviations" explanations — reviewing with that context present just
reproduces the implementer's own blind spots. Prompt the reviewer to be
adversarial: assume something is wrong and look for it, the same posture
`spec-validator` takes toward the spec itself. Enforce the 4 stopping rules:

1. **Round Cap**: Track review iteration count (`Round 1`, `Round 2`, `Round 3`).
2. **Incremental Scope (Rounds 2+)**: Inspect only the newly touched diff — never re-audit untouched code.
3. **Grouped Findings**: Categorize by Security, Spec Fidelity, Reliability, Architecture, and Lean.
4. **Resolution Tracking**: Deduplicate and classify previous items as `[RESOLVED]`, `[STILL OPEN]`, `[NEW]`, or `[ACCEPTED]`. Never re-report closed bugs.

- **UI-layer slices**: invoke `ui-design-review` to audit rendered visual hierarchy, UX states (empty/loading/error), a11y, i18n resilience, and anti-slop rules, recording into `implementation/ui-review-report.md` (a FAIL here blocks overall slice approval).

Record in `implementation/review-report.md`:

```markdown
# Review Report: <Feature Title> (Round: [1/3 | 2/3 | 3/3])

**Result**: PASS | CONDITIONAL PASS | FAIL | ESCALATE
**Scope**: [Full Changeset | Incremental Diff since HEAD~1]

### Resolution Tracker (Rounds 2 & 3)

| ID  | Category | Previous Issue | Status (`RESOLVED` / `STILL OPEN` / `ACCEPTED`) | Note |
| :-- | :------- | :------------- | :---------------------------------------------- | :--- |

### Open Findings Grouped by Category

| REQ/US | ID  | Category | Pattern / Issue | Severity |
| :----- | :-- | :------- | :-------------- | :------- |
```

## 5. Scoped fix loop (Hard 3-Round Cap)

For each failing test or review finding, delegate a **new, narrowly scoped**
subagent with just that finding and the specific file(s) involved — not the
whole codebase, not the full review report.

**Strict Termination Invariants (The 3-Round Cap)**:

- **Round 1**: Initial review → Scoped fix.
- **Round 2**: Incremental diff review → Scoped fix for any remaining items.
- **Round 3**: Final verification pass.
- **Termination Gates at Round 3**:
  - If **CRITICAL** issues remain after Round 3: **HALT & ESCALATE** directly to user. **Zero Round 4 permitted.**
  - If only **HIGH / MEDIUM / LOW** issues remain: Issue **CONDITIONAL PASS**, log the items in `CHANGELOG.md` under `Deferred Technical Debt`, and proceed to closeout.

Log each pass briefly in `implementation/test-fix-log.md`
(pass number, what failed, what changed) — not the full output of each
attempt.

## 6. Record and close out

Append a dated note to `baseline.md` (never edit the signed-off content in
place) and to `CHANGELOG.md`:

```markdown
- v1.1 — <date> — Implementation complete via implementation-orchestrator.
  Slices: <n>. Review: PASS after <n> fix iteration(s).
```

## Exit checklist

- [ ] Baseline confirmed `SIGNED-OFF` before any implementation began
- [ ] Spec decomposed into vertical slices by dependency layer, not by file
- [ ] Each slice ran in an isolated context (subagent or reset session)
      with only its own scoped spec excerpt, not the full spec
- [ ] Review ran in a fresh context with no visibility into the
      implementer's reasoning, and was adversarial rather than confirmatory
- [ ] Every acceptance criterion and every relevant `BR-` rule checked, not
      just the happy path
- [ ] Fix loop used narrowly scoped subagents per finding, not full-context
      re-implementation
- [ ] `implementation/` files and `CHANGELOG.md` updated; the orchestrator's
      own context holds only short summaries, never full subagent
      transcripts
