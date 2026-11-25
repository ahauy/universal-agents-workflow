# ADR-ARCH-001: Architecture Blueprint Decision

> Template used by `scaffold-architecture` skill. Fill in the placeholders below.

## Status

Accepted

## Date

<YYYY-MM-DD>

## Context

**Project**: <project-name from CONTEXT.md>
**Tech Stack**: <language, backend framework, frontend framework, database>
**Feature / Scope**: <feature slug or "full project initial scaffold">

The project requires a consistent, agreed-upon folder structure and module organization strategy before implementation begins. Without an explicit architecture decision, each developer (or AI subagent) may choose different conventions, leading to inconsistent module boundaries and cross-layer coupling.

The choice was made between three proven patterns:

| Option | Pattern                                        | Characteristic                                       |
| ------ | ---------------------------------------------- | ---------------------------------------------------- |
| A      | C4 Layered (controllers/services/repositories) | Horizontal layers — most familiar for REST APIs      |
| B      | Hexagonal / Ports & Adapters                   | Domain-first, maximum testability via port contracts |
| C      | Feature-Based Modules                          | Vertical slices — colocation of all feature concerns |

## Decision

**Selected Blueprint**: <A — C4 Layered | B — Hexagonal | C — Feature-Based Modules>

**Rationale**: <1–3 sentences explaining why this blueprint best fits the project's tech stack, team size, and domain complexity>

## Folder Root

```
<paste the folder tree from the chosen blueprint template>
```

## Seam Contracts

The following import rules are enforced (and will be verified by `setup-deep-modules` if configured):

<copy the "Seam Rules" from the chosen blueprint template>

## Consequences

### Positive

- Consistent folder structure across all features — subagents follow the same layout.
- Clear seam boundaries reduce accidental coupling.
- New developers (and AI agents) can navigate the project without per-feature orientation.

### Negative / Trade-offs

- <e.g. "C4 Layered can become anemic if service layer is a thin pass-through — mitigated by enforcing business logic in services per `codebase-design` principles.">

### Alternatives Considered

- **<Option not chosen>**: <reason not chosen>
- **<Option not chosen>**: <reason not chosen>

## Enforcement

- [ ] `setup-deep-modules` configured to enforce import boundaries
- [ ] `codebase-design` skill referenced by all backend/frontend subagents
- [ ] Module Map updated in `CONTEXT.md`
