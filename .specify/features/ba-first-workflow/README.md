# BA-first UAW workflow

**Status:** Implemented and reviewed. **Updated:** 2026-11-26.
Documentation type: feature reference.

UAW now owns its file-based planning workflow. Every implementation request
starts by establishing outcome, affected behavior, scope, existing evidence,
material unknowns and observable acceptance expectations.

## How the lanes work

- **Fast:** clear bounded work on confirmed existing behavior, no risk trigger;
  checkpoint/plan in chat, one context, focused verification and self-check.
- **Full:** existing T1-T6 risks or T7 new/unresolved business behavior; reuse
  confirmed evidence, complete BA, obtain baseline and plan/tasks approvals,
  then scoped implementation and independent review.
- Roadmap effort does not grant an exemption. Its stories/AC come from confirmed
  domain decisions; blockers/dependencies and risk triggers still apply.

See the canonical [contract](../../../AGENTS.md), [intake](../../../.agents/skills/engineering/intake-classifier/SKILL.md)
and [continuation command](../../../.agents/skills/engineering/command-continue-project/SKILL.md).

## Native planning

After the signed-off Full baseline, use these cold, on-demand skills:

1. [technical-spec](../../../.agents/skill-library/engineering/technical-spec/SKILL.md)
   writes technical spec.md from approved business intent.
2. [implementation-plan](../../../.agents/skill-library/engineering/implementation-plan/SKILL.md)
   scopes files, dependencies, risks and verification.
3. [task-breakdown](../../../.agents/skill-library/engineering/task-breakdown/SKILL.md)
   creates ordered tasks and parallel ownership boundaries.
4. [technical-consistency-review](../../../.agents/skill-library/engineering/technical-consistency-review/SKILL.md)
   reviews actual spec/plan/tasks before Gate 2 and implementation.

Business consistency remains before baseline sign-off. requirements.md owns
business intent; spec.md owns technical design. Ten old SpecKit names are small
migration/retirement stubs, with no upstream runtime or executable workflow.
See the [migration mapping](plan.md) and [ADR 0004](../../../adr/0004-ba-first-uaw-workflow.md).
Customer-modified files and accepted history remain protected on upgrade.

## Verification and cost limits

- 12 acceptance situations reviewed, with semantic checks identified as such.
- 3 structural workflow tests, 21 hook tests and 7 available installer tests passed;
  3 PowerShell cases skipped because pwsh is unavailable.
- Four native skill validators, catalog/agent checks and local fresh/reinstall
  smoke checks passed. An independent synthetic planning exercise produced drafts
  on complete evidence and stopped on contradictory unresolved business evidence.
- Independent Round 2 review approved the changes after fixing two roadmap-template
  findings. No open Critical finding remains.
- The hot set stays at 9; native planning/aliases remain cold. Context-text
  measurements are not billed tokens or monetary savings; actual cost is unmeasured.

Run `python3 .agents/scripts/test/test-workflow.py`,
`node .agents/scripts/test/test-hooks.js`,
`python3 .agents/scripts/test/test-installers.py` and
`node .agents/scripts/build-skill-index.mjs --check` from the repository root.

Details: [acceptance evidence](acceptance-report.md), [test plan](test-plan.md),
[review](review-report.md), [forward exercise](implementation/forward-test-report.md).
No runtime installation, remote deployment, Git staging, commit or push was performed.
