# Implementation slices

Gates 1 and 2 approved by the owner. All agents inherit the parent model.

| Slice | Scope | Requirement | Depends on | Parallel-safe with | Result |
| --- | --- | --- | --- | --- | --- |
| A | UAW package removal, active guidance, successor ADR | REQ-DOWNLOAD-001/002/005 | None | B | slice-a-report.md |
| B | Local validation skill and scenario review | REQ-DOWNLOAD-003 | None | A | slice-b-report.md |
| C | Distribution regression, smoke tests and acceptance report | REQ-DOWNLOAD-001..005 | A and B | None | ../acceptance-report.md |
| Review | Independent standards, fidelity and lean review | REQ-DOWNLOAD-001..005 | C | None | ../review-report.md |

A owns packages/mcp-server/**, README.md, AGENTS.md,
.agents/scripts/sync-harnesses.mjs, root test-plan.md, adr/0003-download-only-distribution.md
and adr/README.md. B owns only spec-validator/SKILL.md and slice-b-report.md.
The coordinator owns test-installers.py, feature completion docs and the feature index.
