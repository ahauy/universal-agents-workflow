---
name: handoff
invocation: user
description: >
  Compact the current session context, in-flight work, decisions made, and immediate next
  actions into a structured handoff document. Allows a fresh agent or the next user session
  to resume execution with zero context loss and zero transcript bloat. Trigger when you
  say "wrap up this session", "create a handoff for the next agent", or "summarize context
  for another window".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Handoff — Session Context Compactor

> [!NOTE]
> **NOT to be confused with `handover`:**
>
> - `handoff` (this skill) = **Data Plane** session compactor for transferring state and immediate next steps to another agent context.
> - `handover` = **Control Plane** (Stage 8 of BA Pipeline) formal sign-off gate for the Domain Decision Baseline before coding begins.

---

## Purpose

Long agent conversations accumulate token bloat, drifting instructions, and obsolete debug noise.
`handoff` distills the active mental model into a clean, dense handoff artifact so work can resume
in a fresh session without archaeology.

---

## Protocol

1. **Audit In-Flight State**:
   - What files were created or modified?
   - What command is currently running or just finished?
   - What tests are passing vs failing?
2. **Extract Settled Decisions**:
   - What design choices were approved by the user during this session?
   - Were any new terms added to `CONTEXT.md`?
   - Were any new ADRs created in `adr/`?
3. **Pinpoint Immediate Next Action**:
   - Exactly what should the next agent do _first_?
   - Specify the exact file, function, or command.
4. **Output Handoff Artifact**:
   - Save to `.agents/handoffs/<date>-<topic>.md` (or output directly in chat if requested).

---

## Output Template

```markdown
# Session Handoff: <Topic / Feature>

- **Date/Time**: <Timestamp>
- **Active Branch**: <branch-name>
- **Status**: IN-PROGRESS / BLOCKED / READY-FOR-VERIFICATION

## 1. What was Accomplished

- [x] <Accomplished item 1 with file link>
- [x] <Accomplished item 2 with file link>

## 2. In-Flight State & Key Files

- Target file: `path/to/file.ts` (current status: ...)
- Test status: <e.g., unit tests green, E2E pending>

## 3. Settled Decisions & Shared Language

- Decisions: <1-2 bullet points>
- `CONTEXT.md`: <any new terms updated>
- `adr/`: <any new ADR created>

## 4. Immediate Next Step (For Next Agent)

1. Run command: `<exact command>`
2. Open file: `<exact file>`
3. Complete task: `<concrete instruction>`

## 5. Potential Pitfalls / Blockers

- <Watch out for X or uncommitted dependency Y>
```
