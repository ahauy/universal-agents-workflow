# Slice B corrective report — SPEC-001 / SPEC-002

Edited only PRODUCT_BACKLOG_ROADMAP-template.md plus this requested report.
No Git writes, source scripts, generated catalog or signed-off artifacts changed.

## Corrections

**SPEC-001:** Removed effort-based Fast-Track/Bounded/Full algorithms, setup and
deployment exemptions, implicit commit, unconditional subagent dispatch and Full
artifacts/docs. Continuation points to AGENTS.md §2 and the canonical
command-continue-project skill. Blocker/dependency checks remain explicit; effort
and context budget describe scope. Deliverables and review/docs follow the lane.

**SPEC-002:** Replaced product exclusions, stack suggestions, numeric RICE scores,
sprints/status claims, completed setup tasks and JWT/database/platform-specific
release defaults with evidence placeholders. Missing estimates remain unavailable;
missing choices remain unresolved/ASM-. Only applicable task layers and release
checks render. New tasks are unchecked; completed work requires evidence.

## Verification

- Frontmatter parsed with PyYAML: schema-version 1.2 and project/tech-stack/
  git-mode fields preserved, including all six tech-stack keys.
- All story fields retained: Slug, Effort, Context-budget, Priority, Depends-on,
  Blocks, description, AC, applicable Backend/Frontend/other Tasks, deliverables.
- No pre-completed task rows remain.
- python3 .agents/scripts/test/test-workflow.py: 3 tests pass.
- Inspected the actual corrective diff for leftover substantive defaults and
  competing pipeline instructions.

## Decision-path review of rendered-template guidance

| Input scenario | Result required by template guidance |
| --- | --- |
| Small technical story, confirmed existing behavior, no T1–T7 | Canonical checkpoint selects Fast; one context; no Full folder or forced agents/docs. |
| Small auth story with single-session estimate | Effort grants no exemption; canonical T3 selects Full with baseline/plan approvals. |
| Deployment story with structural migration risk | No deployment exemption; canonical T2 selects Full and applicable migration/rollback verification. |
| Product without auth/database and with unresolved estimates | Those stack entries can be not applicable; omit those task/release layers; keep estimates/RICE unavailable and missing material decisions ASM-/[!]. |

These are manual semantic checks of output instructions, not autonomous rendering
or proof of every future agent response. Coordinator/reviewer should recheck the
corrective delta against SPEC-001 and SPEC-002 before closing those findings.
