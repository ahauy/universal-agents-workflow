---
invocation: user
name: intake-classifier
description: "BA checkpoint and lane selector: reuse confirmed evidence; Fast for bounded existing behavior, Full on risk or new/unresolved business behavior."
triggers:
  - "/full"
  - "full lane"
  - "làm full lane"
  - "escalate to full lane"
metadata:
  stage: "Pipeline — Lane selection"
  phase: "Phase 1: Intake"
  model_recommendation: "Any fast model; escalation is a rule lookup, not a judgement call"
  next_skill: "none for Fast lane; elicitation-interview only after Full-lane escalation"
---

# Intake Classifier — Lane Selector

Establish the implementation checkpoint, then select **Fast** for bounded,
confirmed existing behavior or **Full** when a trigger applies. This is the
lightweight BA entry point; it does not require loading the Full BA skills.

Canonical rules live in [AGENTS.md](../../../../AGENTS.md) §2. This skill applies them.

---

## 1. Default: Fast lane

Before implementation, state in chat: outcome, affected behavior, scope, known
evidence, material unknowns and observable acceptance expectations. Read the
request, relevant existing code/tests and confirmed AC first. Reuse answers; ask
only material gaps and record unknowns as ASM- IDs. New or unresolved business
behavior triggers T7; do not silently choose defaults. Resolved minor technical
questions alone do not trigger Full. Read-only research is answered directly.

Fast is the default only when this checkpoint confirms bounded existing behavior
and no trigger in §2 applies.

Fast lane = one context, no feature folder, no subagents:

```
read target + AC → 5-line plan → failing test → code → verify → self-check → done
```

Write `test-plan.md` only when the task needs more than three test cases.

## 2. Escalation triggers — any one is enough

| # | Trigger | Why Full |
| --- | --- | --- |
| T1 | Expected diff > 250 lines or > 8 files | one context will drift |
| T2 | Breaking/structural DB schema change, or migration with data-loss risk | rollback plan needed |
| T3 | Auth, permissions/RBAC, billing/payments, or PII | adversarial review required |
| T4 | New core domain entity, service, or public API contract | decisions must be recorded |
| T5 | Story marked `[!]` in the roadmap | unresolved business decisions |
| T6 | User asks for `/full`, enterprise re-elicitation, or audit-grade artifacts | explicit request |
| T7 | New or unresolved business behavior, rules, defaults or material acceptance decisions | business decisions require baseline |

If no trigger applies, the answer is Fast. Do not escalate "for safety" — that is
the exact behaviour this lane split exists to remove.

## 3. Sizing labels (informative only)

Sizing never selects the lane. It only sets expectations for the plan and the test
count.

| Label | Typical shape | Default lane |
| --- | --- | --- |
| Spike | research question, no product code | none — answer in chat, no folder |
| S | < 80 lines, bug fix, typo, single config | Fast |
| M | 80–250 lines, roadmap story with AC | Fast |
| L / XL | > 250 lines, multi-entity, cross-cutting | Full (T1/T4 usually fires anyway) |

Roadmap effort labels do not bypass triggers. Reuse confirmed AC and check
dependencies; an unblocked S/M story touching auth is Full (T3).

## 4. Escalation procedure

When a trigger fires mid-task, escalate **once** and stay escalated:

1. Announce: `Escalating to Full lane: <T#> <reason>`.
2. Create `.specify/features/<slug>/` with `00-intake.md`, `baseline.md`,
   `CHANGELOG.md`.
3. Record the lane and the trigger in `00-intake.md`.
4. Continue from Step 2 of the pipeline (domain baseline), not from the beginning.

Never downgrade a task back to Fast after escalation.

### `00-intake.md` template (Full lane only)

```markdown
# Intake: <Feature Title>

- **Date**: <date>
- **Requested by**: <persona/stakeholder if known>
- **Lane**: Full
- **Escalation trigger**: <T#> <reason>
- **Override**: <none | explicit user direction and reason; retain safety gates>

## One-line problem statement

<one sentence — expanded in elicitation-interview>
```

## 5. Hand-off

- **Fast lane** → reproduce/read, write the failing test, implement, verify, self-check.
- **Spike** → answer directly in this turn. No folder, no code.
- **Full lane** → announce the trigger and proceed to `elicitation-interview`.

## Exit checklist

- [ ] Checkpoint established with evidence and no invented business decisions
- [ ] Lane announced out loud, with the trigger named (or "no trigger")
- [ ] Fast lane: no feature folder created, no subagent dispatched
- [ ] Full lane: folder created and trigger recorded in `00-intake.md`
- [ ] User override (if any) recorded, not silently applied
