# Risk register: Download-only distribution

## Contradiction scan

- Resolved: the request retains validation, but removes the MCP validator.
  ASM-DOWNLOAD-002 confirms retention through the existing local skill.
- Resolved: init corrections do not require a new CLI; installers are the entry points.
- Resolved: removal covers UAW MCP only, not third-party integrations.

## Risks

| ID | Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| RISK-DOWNLOAD-001 | Removal leaves active instructions pointing to absent tools | Medium | High | Scan active references and inspect generated adapter output |
| RISK-DOWNLOAD-002 | Cleanup discards existing unrelated changes | Medium | High | Limit deletion to the approved package and use surgical document edits |
| RISK-DOWNLOAD-003 | Skill implies automatic certification or permits false PASS | Medium | High | Explicit prerequisite/failure rules and semantic negative-scenario review |
| RISK-DOWNLOAD-004 | PowerShell cannot be executed on this host | Known | Medium | Run available checks and report pwsh skips explicitly |

## Assumptions

ASM-DOWNLOAD-001, ASM-DOWNLOAD-002 and ASM-DOWNLOAD-003 are confirmed by the
owner's approval on 2026-11-26; see 01-elicitation.md. No open assumptions.

## MoSCoW

- Must: remove UAW MCP, retain download initialization, correct validation,
  preserve installer safety and unrelated data, align active documentation.
- Should: leave clear historical ADR succession and reproducible acceptance evidence.
- Could: none requested.
- Won't: new validator/init CLI, unrelated workflow cleanup, removing third-party
  MCP integrations, publishing/unpublishing packages, or autonomous Git operations.
