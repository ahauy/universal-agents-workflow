---
invocation: user
name: handover
description: >
  Use for Full-lane work as the final step of the domain baseline,
  once spec-validator has returned a clean pass (or explicitly accepted gaps).
  Finalizes and version-locks the Domain Decision Baseline, produces a short
  handover brief for development, and formally hands off to technical planning
  (technical-spec). Do not let code or technical spec drafting begin before this
  skill has signed off the baseline.
metadata:
  stage: "Full lane — baseline stage 2f of 6"
  phase: "Phase 3: Handover"
  plane: "control"
  model_recommendation: "Standard thinking sufficient — gate verification and document finalization"
  prev_skill: "spec-validator"
  next_skill: "technical-spec"
---

# Handover — BA Domain Baseline Sign-Off

Reuse confirmed answers, existing requirements and signed-off evidence within the
current scope. Ask only material gaps; no fixed total interview count and no
invented business defaults. Fast uses the checkpoint in AGENTS.md in one context;
these Full-lane artifacts do not exempt any request from understanding behavior.


> [!NOTE]
> **NOT to be confused with `handoff`:**
>
> - `handover` (this skill) = **Control Plane** (final gate of the Full-lane baseline) formal sign-off gate for the Domain Decision Baseline before coding begins.
> - `handoff` (`.agents/skill-library/productivity/handoff`) = **Data Plane** session compactor for transferring active mental state and next steps to another agent context.

Full lane, final baseline stage — the last gate. Nothing in this pipeline authorizes
writing implementation code. This skill grants Gate 1 only after user sign-off;
Gate 2 approval of plan/tasks is still required before implementation.

## 1. Confirm the exit gate

Before doing anything else, verify against `validation-report.md` and every
upstream file:

- [ ] Problem statement and success metrics clearly defined (Stage 2)
- [ ] AS-IS, GAP, TO-BE documented — Full lane, when relevant (Stage 3)
- [ ] All required pillars modeled without silent assumptions (Stage 4)
- [ ] MoSCoW complete with explicit Won't-Have (Stage 5)
- [ ] Contradiction scan passed with zero unresolved conflicts (Stage 5)
- [ ] Every user story has testable Given-When-Then acceptance criteria
      (Stage 6)
- [ ] Spec validation passed, or failures explicitly accepted (Stage 7)

If any box is unchecked, stop and go back to the owning stage — do not sign
off a baseline with open items, even under time pressure. If the user
insists on proceeding anyway, log it exactly like `spec-validator` does:
an explicit accepted gap with their reasoning, not a silent skip.

## 2. Sign off the baseline

Present the completed baseline and obtain explicit user sign-off. Reuse an
existing approval only when it covers this exact version and scope. Then update
`baseline.md`:

```markdown
**Status**: SIGNED-OFF
**Version**: 1.0
**Signed off by**: <user, date>
```

From this point, `baseline.md` and `requirements.md` are locked as
written. Any further scope change is a **new** version, not an edit to the
signed-off one — see §4.

## 3. Append the handover brief to the baseline

Do **not** create a separate brief file — it duplicates `baseline.md`. Append a
short, dev-facing summary as the final section of `baseline.md` itself. It is a
pointer, not a re-statement of the spec:

```markdown
## Dev Handover Brief

**Baseline version**: 1.0 (signed off <date>)
**Requirements**: requirements.md (single source — `spec.md` is generated later in Step 3)
**Audience exports**: `exports/BRD.md`, `exports/SRS.md` … or `none`
**Exports rendered for**: <client / auditor / requirements tool — or "none, internal only">
**Traceability matrix**: traceability-matrix.md

### What's being built
<2-3 sentences>

### What's explicitly out of scope
<from the MoSCoW Won't-Have list>

### Known accepted risks/gaps
<from validation-report.md and 04-risk-register.md, if any>

### Next step
Invoke `technical-spec` (or hand to the dev team) to generate the technical
plan artifacts.
```

## 4. Change management after sign-off

If new information surfaces after handover that changes scope or a business
rule:

- Don't edit the signed-off `baseline.md` section in place.
- Append a new `CHANGELOG.md` entry (e.g. `v1.1 — <date> — <what changed and
why>`), and route the actual change through whichever upstream stage owns
  it (a new business rule → `domain-modeling`; a new risk →
  `risk-contradiction-scanner`; a requirement wording fix →
  `spec-writer` → `spec-validator` again).
- Bump `baseline.md`'s version once the change is itself validated — the
  baseline is always either the last signed-off version or a draft of the
  next one, never a silently-edited hybrid.

## Exit checklist

- [ ] Full exit gate from §1 confirmed, all boxes checked or explicitly
      accepted
- [ ] `baseline.md` marked `SIGNED-OFF` with a version number
- [ ] Handover brief written and links to the real documents rather than
      duplicating them
- [ ] Audience exports recorded: either `none` (internal only) or the list of
      rendered files with who they were rendered for — and each one carries the
      `GENERATED FROM` header
- [ ] User explicitly told what's next (who/what receives the handoff)
- [ ] `CHANGELOG.md` updated with the sign-off entry
