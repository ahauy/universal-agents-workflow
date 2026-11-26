# Tasks: <feature>

**Status:** Draft — submit with plan.md for Gate 2 approval.
**Inputs:** signed-off baseline.md, [spec.md](spec.md), [plan.md](plan.md)
**Location:** .specify/features/<slug>/tasks.md

## Ordered work

- [ ] T001 [REQ-/US- ids] <deliverable; files; dependencies; verification>

Add only tasks needed for approved scope. Include meaningful failing-test-first
implementation, verification, review and feature documentation. Prose-only work
uses suitable structural and decision-path checks. Do not prefill platform,
authentication, database or deployment tasks without a requirement.

## Dependencies and parallel boundaries

<Explicit task dependencies. [P] means disjoint file ownership and no unresolved
output dependency. Serialize shared-file edits. Full slices use scoped context
packs of at most 150 lines; Fast never delegates or creates a Full feature folder.>

## Coverage and completion

| Requirement / acceptance id | Tasks | Verification evidence |
| --- | --- | --- |
| <id> | <T ids> | <expected result / evidence path> |

Gate 2 requires approval of plan + tasks after technical-consistency-review.
Critical findings block delivery. Git writes require separate explicit authority.
