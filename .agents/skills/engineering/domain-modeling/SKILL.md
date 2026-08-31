---
invocation: model
name: domain-modeling
description: >
  Use for Bounded Task or Full Feature work, after elicitation (and
  gap-analysis, if run) to turn interview answers into concrete domain
  artifacts — RBAC matrix, entity state machines, business rules/algorithms
  with assigned IDs, ERD, non-functional requirements, inline `CONTEXT.md`
  shared language updates, and ADR proposals. Trigger this whenever a feature
  needs its access rules, entity lifecycle, core formulas, or data model made
  explicit and unambiguous before writing a spec.
metadata:
  stage: "BA Pipeline — Stage 4 of 8"
  phase: "Phase 1: Business Analysis"
  plane: "data / control bridge"
  model_recommendation: "Extended thinking preferred — complex state machine and business rule formalization"
  prev_skill: "gap-analysis (Full Feature) or elicitation-interview (Bounded Task)"
  next_skill: "risk-contradiction-scanner"
---

# Domain Modeling

Phase 1, Stage 4. Converts elicitation answers (and gap analysis, if
present) into structured, checkable models. This is where ambiguity dies —
if a rule can't be stated precisely enough to put in this document, it isn't
ready for a spec yet; go back to `elicitation-interview` for that piece.

For Bounded Task protocol, only build the sub-sections that are actually
relevant to the change (check `00-intake.md`); skip the rest rather than
padding them out.

## 1. RBAC matrix

Table of role × (Create/View/Edit/Delete/Share), for every role touched in the target project
(e.g., `Guest`, `Member`, `Admin`, `Billing Owner` or domain-specific personas).
Explicitly state resource ownership boundaries (can users access or mutate resources owned by other tenants?) and unauthenticated/guest preview limits.

## 2. State machine & entity lifecycle

For every entity whose lifecycle changes or is introduced, draw the finite
state machine as a Mermaid `stateDiagram-v2` block or compile an interactive
lifecycle map using [`archify`](file:///Users/vutuanhau/Documents/PROJECT/Universal-Agents-Workflow/.agents/skills/engineering/archify/SKILL.md) (`diagram_type: "lifecycle"`), including:

- Every named state and its exact transition triggers (user action,
  scheduled job, webhook, etc.)
- Terminal states
- Rollback / cancellation recovery states

## 3. Business rules & algorithms

Every formula, threshold, or validation gets a `BR-<SLUG>-###` ID so
`spec-writer` and `spec-validator` can trace it later:

```markdown
**BR-AUTH-004**: Session tokens expire after 24 hours of inactivity; refresh
tokens are single-use with automatic family invalidation upon reuse detection.
```

Cover at minimum: field validations (length, charset, uniqueness, limits),
core algorithms/formulas with explicit variables, state calculation,
and rate limits per tier.

**Anti-abuse pass (mandatory whenever a rule affects credits, scores, XP, or rewards):**
For each such rule, explicitly note how it resists gaming (clock manipulation,
replay attacks, automated scripts). If a rule has no abuse resistance noted,
ask the user whether that's acceptable before moving on.

## 4. Workflows & edge cases

Restate the happy path from elicitation as a numbered sequence, then confirm
each negative/resiliency scenario has a concrete resolution (not just "TBD"):
offline/sync conflict resolution strategy, concurrency handling, idempotency
mechanism, session-expiry behavior, cancel/abandon cleanup.

## 5. Entities, data boundaries & privacy

- Entity/attribute/relation sketch as a Mermaid `erDiagram` block.
- Deletion policy per entity: hard delete vs soft delete (`deletedAt`),
  cascade behavior.
- Data retention/purge schedule if the entity holds user content.
- Compliance constraints (GDPR, HIPAA, minor protection if flagged in Pillar 5).

## 6. UX states & non-functional requirements

- UX states: empty, loading (skeleton vs spinner, optimistic UI), error
  (inline vs toast vs modal), feedback/recovery (undo windows).
- Performance targets (P95 latency, load time).
- Security: input sanitization, injection protection, auth mechanism.
- **i18n/l10n**: which languages this feature must support at launch, RTL handling.
- **Accessibility**: target conformance level (e.g. WCAG 2.1 AA) for any new UI surface.
- **Observability**: what gets logged/monitored/alerted for critical paths.

## 7. Sync Shared Language (`CONTEXT.md`) & ADRs (`adr/`)

Domain modeling is the bridge between business elicitation and technical design:

1. **Update `CONTEXT.md` inline**:
   - For every new entity name, lifecycle status, shorthand, or domain acronym coined during modeling, immediately add or update an entry in `CONTEXT.md` using the Before (verbose) → After (concise) format.
   - Ensure all downstream specs and code adhere strictly to this nomenclature.
2. **Propose Architecture Decision Records (`adr/`)**:
   - When modeling requires a significant architectural choice (e.g. state storage engine, eventual consistency vs two-phase commit, boundary partitioning between services), draft an ADR in `adr/` using `adr/adr-template.md`.

## 8. Record & Hand off

Append all of the above to `03-domain-model.md`, and link (don't duplicate)
a summary into `baseline.md`'s Stage 4 section.
Proceed to `risk-contradiction-scanner`. Append one line to `CHANGELOG.md`.

## Exit checklist

- [ ] RBAC matrix covers every role touched, ownership rules explicit
- [ ] Every entity with a lifecycle has a state diagram with named triggers
- [ ] Every business rule has a `BR-` ID and, if reward-related, an anti-abuse note
- [ ] Every edge case from elicitation has a concrete resolution, not "TBD"
- [ ] ERD covers deletion policy and retention for every entity
- [ ] i18n, accessibility, and observability addressed (or explicitly N/A with reason)
- [ ] `CONTEXT.md` updated inline with new domain terms and canonical shorthands
- [ ] Architectural trade-offs recorded in `adr/` if applicable
- [ ] `03-domain-model.md`, `baseline.md`, `CHANGELOG.md` updated
