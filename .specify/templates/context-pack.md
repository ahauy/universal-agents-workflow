# Context Pack — `<feature-slug>`

> Written at the end of each phase, read by every downstream agent **instead of**
> the full artifact chain. Hard limit: 150 lines. If it does not fit, the scope is
> too large — split the feature, do not grow the pack.

**Phase written:** `<1 | 2 | 3 | 4 | 5>` · **Updated:** `<YYYY-MM-DD>` · **Lane:** `Full`

---

## 1. Scope (one paragraph)

What is being built, for whom, and what is explicitly **out** of scope.

## 2. Ids in play

| Id | Type | One-line meaning |
| --- | --- | --- |
| `BR-<SLUG>-001` | business rule | |
| `REQ-<SLUG>-001` | requirement | |
| `US-<SLUG>-001` | user story | |

Do not list ids that this phase does not touch.

## 3. Acceptance criteria

- [ ] `US-<SLUG>-001` — Given … when … then …
- [ ] …

## 4. Contracts

| Surface | Shape | Notes |
| --- | --- | --- |
| `POST /api/v1/<resource>` | request / response DTO fields | |
| `<Entity>` | key fields + invariants | |

## 5. Files to touch

| Path | Why |
| --- | --- |
| `src/...` | |

If a file is not in this table, the agent must ask before editing it.

## 6. Open questions / assumptions

| Id | Statement | Status |
| --- | --- | --- |
| `ASM-001` | | `open` / `confirmed` / `rejected` |

## 7. Do not re-derive

Decisions already settled that must not be re-litigated in this phase:

- …
