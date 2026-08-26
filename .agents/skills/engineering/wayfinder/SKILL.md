---
name: wayfinder
invocation: user
description: "Plan large, ambiguous efforts (exceeding a single session) as a shared map of decision tickets on an issue tracker (GitHub, GitLab, Linear, or local markdown), resolving them one by one until the destination is clear. User-invoked."
disable-model-invocation: true
metadata:
  origin: mattpocock/skills (adapted)
  plane: control
---

# Wayfinder — Navigating Ambiguity Across Sessions

A loose, ambitious idea has arrived. It is too big for a single agent session (over 100k tokens), and wrapped in "fog": the exact path from here to the destination is not yet clear.

**Wayfinding is about finding the route, not rushing blindly to code.** This skill charts a **shared map** on the repository's issue tracker (or local markdown), then works through its **decision tickets** (questions whose answers unlock architectural or product choices) one at a time until the route is completely de-risked.

---

## Core Principles

1. **Plan, don't build**:
   - Wayfinder produces **decisions**, not production features.
   - Each ticket resolves an uncertainty (e.g. "Which auth provider?", "Should state be centralized or local?", "How to model multi-tenancy?").
   - The impulse to start coding is the signal that you have reached the edge of the map — time to hand off to the BA/Spec pipeline.

2. **Refer by Name, Never Bare Numbers**:
   - Always refer to tickets by their descriptive title (e.g. `[Decision: Auth Flow Strategy](link)`), never just `#42` or `#43`.

3. **Frontier-Driven Progression**:
   - A ticket is **unblocked** when all dependencies are resolved.
   - The **frontier** consists of all open, unblocked tickets at the edge of the known territory.

---

## Issue Tracker Storage

Wayfinder adapts to whatever issue tracker the project uses:

- **GitHub Issues**: Label `wayfinder:map` on parent epic issue; child issues labeled `wayfinder:<type>`.
- **GitLab / Linear / Jira**: Parent initiative/epic with child sub-issues and native dependency blockers.
- **Local Markdown (Default Fallback)**: Stored in `.specify/wayfinder/<map-slug>/MAP.md` with tickets in `tickets/001-*.md`.

---

## The Map Anatomy

```markdown
# 🗺️ Wayfinder Map: [Destination Title]

## Destination

<What reaching the end looks like: the architecture decision locked, the data migration plan verified, or the spec ready to write. 1-2 sentences.>

## Context & Notes

<Domain vocabulary from CONTEXT.md, relevant ADRs, and standing constraints.>

## Decisions Made So Far

<!-- One line per resolved ticket linking to the resolution detail -->

- [Closed] [Decision: DB Migration Strategy](tickets/001.md): Selected dual-write with background backfill.

## Current Frontier (Takeable Next)

<!-- Open, unblocked tickets ready to tackle -->

- [ ] [Question: Session Management Mechanism](tickets/002.md) (HITL)

## Fog of War (Blocked or Not Yet Sized)

<!-- In-scope questions waiting for upstream decisions -->

- ⏳ [Question: WebSocket Reconnection Architecture](tickets/003.md) — blocked by ticket 002.

## Out of Scope

<!-- Ideas considered and deliberately rejected for this effort -->

- Mobile app offline sync (deferred to Phase 2).
```

---

## Ticket Types

Every decision ticket falls into one of two operational modes:

| Type                | Mode                         | Description                                                                                 | Typical Skills Invoked        |
| :------------------ | :--------------------------- | :------------------------------------------------------------------------------------------ | :---------------------------- |
| **`grilling`**      | **HITL** (Human in the loop) | Resolving product preferences, business rules, or user experience trade-offs with the user. | `grilling`, `wait-what`       |
| **`prototype`**     | **AFK** / **HITL**           | Building a throwaway spike or UI variant to see and feel the decision before committing.    | `prototype`                   |
| **`research`**      | **AFK** (Autonomous)         | Inspecting libraries, benchmarks, API limits, or legacy code.                               | `codebase-design`, web search |
| **`questionnaire`** | **Async**                    | Drafting a markdown questionnaire for external teams or stakeholders.                       | `to-questionnaire`            |

---

## Wayfinding Execution Loop

1. **Orientation**: Read the Map's **Destination** and **Decisions so far**.
2. **Claim Ticket**: Pick an unblocked ticket from the **Frontier**. Assign it or mark active.
3. **Resolve Uncertainty**:
   - Run the appropriate skill (`grilling`, `prototype`, or research).
   - Arrive at a crisp, definitive answer.
4. **Record & Update Map**:
   - Record the decision on the ticket.
   - Close the ticket.
   - Move it to "Decisions Made So Far" on the Map.
   - Check if downstream tickets in "Fog of War" are now unblocked; promote them to the Frontier.
5. **Handoff**: When the Frontier is empty and the path to Destination is 100% clear, close the map and hand off to `intake-classifier` or `speckit-specify`.
