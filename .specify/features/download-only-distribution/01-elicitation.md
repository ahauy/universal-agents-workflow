# Elicitation: Download-only distribution

## Confirmed from the current chat

- Remove the project's MCP implementation and keep download distribution.
- Address validator and initialization inconsistencies as part of this change.
- Preserve the installer data-safety fixes from the previous task.
- Report the result briefly; no commit or push was requested.

## Confirmed interpretations

Confirmed by the owner on 2026-11-26: "duyệt, bạn hãy làm theo đề xuất và phải đảm bảo đáp ứng các tiêu chí nghiệm thu".

- ASM-DOWNLOAD-001: Remove the UAW MCP server only. Third-party MCP integrations
  such as Playwright are outside this removal.
- ASM-DOWNLOAD-002: Reuse the existing file-based spec-validator skill rather than
  introducing a replacement validator CLI. Strengthen prerequisite and traceability
  checks; do not claim automatic IEEE certification.
- ASM-DOWNLOAD-003: Existing Bash/PowerShell installers become the initialization
  entry points; remove the npm MCP init command rather than replacing it with a new CLI.

## Relevant boundaries

No database, auth, billing, PII or UI changes. ASM-DOWNLOAD-001 through
ASM-DOWNLOAD-003 are confirmed. No remaining business-scope questions.
