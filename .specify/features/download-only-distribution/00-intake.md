# Intake: Download-only distribution

- Date: 2026-11-26
- Requested by: repository owner, current chat
- Lane: Full
- Escalation trigger: T1, removing the MCP package exceeds 250 changed lines and 8 files.
- Status: implemented and reviewed on 2026-11-26; acceptance evidence and runtime limits recorded in acceptance-report.md.

## Problem

The owner requests validator/init corrections and removal of the UAW MCP distribution,
retaining download/file-based installation. Existing uncommitted changes must be preserved
except UAW MCP files explicitly approved for removal by this request.
