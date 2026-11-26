# Independent review input — Round 1

Read .agents/agents/code-reviewer.md for the read-only reviewer protocol.
Review current files against the requirements using the changed-file list below.
Do not rely on implementer explanations or slice reports. Report only concrete,
scoped findings and retain unrelated pre-existing work.

## Acceptance scope

- REQ-DOWNLOAD-001: no UAW MCP package/runtime remains; third-party integrations retained.
- REQ-DOWNLOAD-002: installers initialize local skills without UAW MCP or a new CLI.
- REQ-DOWNLOAD-003: local validator must not PASS missing/unreadable/empty/placeholder
  business evidence, unconfirmed ASM, absent acceptance coverage or broken BR/REQ/US links.
  Distinguish semantic review from executable checks/certification.
- REQ-DOWNLOAD-004: preserve part-1 installer safeguards and unrelated user data/changes.
- REQ-DOWNLOAD-005: active guidance/adapter output uses file-based setup;
  old accepted ADR is unchanged and explicitly superseded.

Full scenarios: requirements.md section 4 and test-plan.md in this directory.
No business assumptions remain open. Gates 1 and 2 were approved by the owner.

## Changed-file list

- Deleted packages/mcp-server/** including source, templates, tests, dependencies and dist.
- README.md: only the download/file-based quickstart change is in this request.
- AGENTS.md: only section 7's UAW MCP paragraph replacement is in this request.
- .agents/scripts/sync-harnesses.mjs: WorkBuddy local-file guidance.
- .agents/skill-library/engineering/spec-validator/SKILL.md: evidence/failure rules.
- .agents/scripts/test/test-installers.py: download-distribution installation regression.
- test-plan.md: current verification guidance.
- adr/0003-download-only-distribution.md and adr/README.md: successor/index.
- This feature's artifacts and planned README/index: completion evidence.

install.sh/install.ps1 contain prior-task safety fixes and are unchanged in this
request. Do not reopen unrelated existing lane/adapter issues in this review.
The accepted adr/0002-hybrid-mcp-server-architecture.md must remain unchanged.

## Passes and output

Pass A: standards/security/reliability. Pass B: spec fidelity. Pass C: lean,
required for the large deletion diff. No runtime UI/security/API is added.
Write only this feature's review-report.md with verdict and findings, including
exact file/line, severity and execution limits. Do not edit code, Git state,
baseline, requirements or other reports. Later rounds inspect only corrections
and previously open finding IDs, with no more than three rounds in total.
