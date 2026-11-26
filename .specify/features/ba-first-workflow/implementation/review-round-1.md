# Adversarial Code Review Report — Round 1/3

**Verdict: WARNING — corrective changes requested.** Zero Critical findings; one High and one Medium spec-fidelity finding remain. Gate 3's zero-Critical condition alone does not establish complete acceptance coverage.

**Scope:** Current source in review-files.json compared with the supplied before-task snapshot, plus PRODUCT_BACKLOG_ROADMAP-template.md explicitly added to review scope by the coordinator. Requirements §4 and review-scope.md supplied acceptance expectations. Implementer slice reports and prior conclusions were not read. No source or Git mutations were performed.

## Pass results

| Severity | A: standards/security/reliability | B: fidelity | C: lean | Open |
| --- | ---: | ---: | ---: | ---: |
| Critical | 0 | 0 | 0 | 0 |
| High | 0 | 1 | 0 | 1 |
| Medium | 0 | 1 | 0 | 1 |

## Findings grouped by category

### [SECURITY]

No concrete security defect identified in the scoped executable deltas. The lane-bypass consequence below is reported once under fidelity.

### [SPEC_FIDELITY]

**[HIGH] [SPEC-001] [PASS B] The roadmap template still teaches an incompatible execution pipeline.**

Locations:
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:86–87
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:101
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:114–117
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:261–273

Issue: The template consumed by command-generate-backlog still instructs setup to bypass BA, routes S/M/L by effort into legacy Fast-Track/Bounded/Full Feature stages, dispatches subagents without a lane check, requires Full artifacts for small stories, and exempts deployment stories from the normal BA pipeline.

Why: A generated roadmap carries these explicit, retained AI instructions into /continue. An S auth story can follow Fast-Track instead of escalating T3, while an M change to confirmed behavior can acquire a baseline and multiple agents despite meeting Fast conditions. Deployment auth/schema work has a separate bypass. These contradict REQ-BA-001/002/004/007 and US-BA-002/004/007 even though the command skill itself now states T1–T7 correctly. This template is active output, not an immutable historical feature record. The structural tests do not exercise its decision paths.

Fix: Replace the embedded continuation algorithm with a pointer to the canonical checkpoint/T1–T7 and command-continue-project flow. Keep effort descriptive only, lane-condition artifacts/delegation/docs, remove setup/deployment exemptions and the implicit Commit instruction, and retain dependency/blocker checks. Review a small known technical story, a small auth story and a deployment migration story through the rendered output.

**[MEDIUM] [SPEC-002] [PASS B] The roadmap template supplies unconfirmed product exclusions and completed work.**

Locations:
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:32–40
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:49–53
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:60–63
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:89–91
- .specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md:215–250

Issue: The template contains affirmative Web-only/no-offline/no-billing/etc. scope decisions, numeric RICE scores, pre-completed setup/CI/Docker work, and platform-specific release obligations and token lifetimes instead of evidence placeholders or explicitly optional examples.

Why: The new generation skill instructs the agent to use this template but prohibits invented exclusions, estimates, completed work and inapplicable stack requirements. Keeping these defaults creates a second competing instruction source: copying the structure can record unevidenced scope/priority/progress or require JWT/PostgreSQL/Prisma/SPA operations for a product that has none. That leaves REQ-BA-003/004 and US-BA-004 acceptance incomplete. The instruction to delete inapplicable exclusions does not establish that the retained exclusions were confirmed.

Fix: Replace substantive defaults with neutral placeholders and evidence/unknown fields; mark any examples clearly non-operative. New setup work starts unchecked unless completion evidence is present. Render only confirmed exclusions, evidenced RICE inputs and applicable release checks. Verify rendering from a product with no auth/database and unresolved estimates.

### [RELIABILITY]

No concrete reliability defect identified in the scoped executable deltas. Checks below passed; PowerShell execution remains unverified.

### [ARCHITECTURE]

No actionable architecture finding. The four native skills have distinct inputs/outputs, enforce stage ordering and both approvals, and stay in the cold library. Ten legacy paths resolve to local replacements or explicit retirement notices without requiring upstream runtime execution.

### [LEAN]

Lean already. Ship after the fidelity corrections above. No separate speculative abstraction or dependency was identified; replacing stale embedded roadmap policy with canonical pointers is covered by SPEC-001 rather than duplicated as a lean finding.

## Verification and limits

Executed independently:

- python3 .agents/scripts/test/test-workflow.py: 3 passed.
- node .agents/scripts/build-skill-index.mjs --check: passed; 9 hot + 61 cold skills.
- node .agents/scripts/test/test-hooks.js: 21 passed, including actual Claude/Antigravity SessionStart payloads.
- python3 .agents/scripts/test/test-installers.py: 7 passed, 3 PowerShell cases skipped because pwsh is unavailable.

Inspected current scoped source and before-task deltas, native/legacy skill contracts, templates, personas, governance/adapters, generated catalog mapping, hook changes and documentation. Existing installers and update engine were not changed; their regression fixtures test protection/failure paths, not a live network download or exhaustive end-to-end installation of every native skill. No live harness session or autonomous agent execution was run, so prose decision-path review is evidence of consistency rather than a runtime guarantee. Existing signed feature artifacts/ADRs and unrelated user changes were outside corrective scope. Estimated context text size is not measured billing/cost savings; no financial savings conclusion is supported.

Round 2 must inspect only the actual corrective deltas and verify SPEC-001/SPEC-002; do not reopen untouched files.
