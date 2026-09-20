# 0002. Hybrid Model Context Protocol (MCP) Server Architecture

- **Date:** 2026-09-20
- **Status:** ACCEPTED

## Context & Problem Statement

Universal Agents Workflow initially relied entirely on a **File-based distribution model**:

- Over 60 markdown skills (`.agents/skills/`), prompt rules (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`), and subagents were copied directly into each target repository.
- While effective for isolated prompts, this generated significant repository pollution (hundreds of framework files in user workspaces), required complex 3-way hash synchronization algorithms in `install.sh`, and created friction in corporate environments with strict Git hygiene policies.
- Furthermore, modern AI code editors (Antigravity IDE, Cursor, Windsurf, Claude Code, Zed) now support the **Model Context Protocol (MCP)** by Anthropic, enabling dynamic registration of Prompts, Tools, and Resources through standard JSON-RPC over `stdio`.

## Decision

We commit to a **Hybrid Architecture** centered around a dedicated TypeScript MCP Server located in `packages/mcp-server/`:

1. **Target Project Workspaces (Clean Data Plane):**
   - User repositories maintain only living business and architectural artifacts:
     - `CONTEXT.md` (Ubiquitous language & terminology)
     - `adr/` (Architectural Decision Records)
     - `.specify/` (Feature specifications, state machines, and task breakdowns)
     - A minimal `AGENTS.md` (~25 lines) serving as an operational router instructing the AI to use MCP.
2. **Control Plane Centralized in MCP Server:**
   - **MCP Prompts:** Reusable workflow entry points (`uaw_grilling`, `uaw_intake_classifier`, `uaw_speckit_specify`, `uaw_speckit_plan`, `uaw_code_review`, `uaw_ponytail_review`).
   - **MCP Tools:** Automated and deterministic operations with built-in safety guardrails:
     - `uaw_update_context` (Soft-immutability validation)
     - `uaw_record_adr` (Auto-increment and indexing)
     - `uaw_scaffold_feature` (Scaffolds `.specify/features/<slug>/`)
     - `uaw_validate_spec` (IEEE 29148 automated compliance check)
     - `uaw_ponytail_scan` (Detects over-engineering bloat via The Ladder)
     - `uaw_check_git_locks` (Prevents direct commits to protected branches)
   - **MCP Resources:** Dynamic context streaming (`uaw://context`, `uaw://adr`, `uaw://standards/{guide}`).
3. **Distribution & Execution:**
   - Distributed via npm (`@universal-agents/mcp-server`) runnable via `npx -y @universal-agents/mcp-server@latest`.
   - Supports local development mode via CLI flag `--cwd <path>` or local binary `node ./dist/index.js`.
   - CLI setup command: `uaw-mcp init [dir]` to configure target repos with 1 command.

## Consequences

### Positive

- **Zero Repo Pollution:** Repositories no longer require 50+ framework files in `.agents/`.
- **Universal Multi-AI Compatibility:** One single MCP configuration in `mcp_config.json` works identically across Antigravity, Cursor, Windsurf, and Claude Code.
- **Automated Validation:** Rules (like IEEE 29148 compliance and soft-immutability) are enforced by executable TypeScript code rather than relying solely on LLM self-policing.
- **Safe Modifications:** The server automatically generates unified diffs and `.bak` backups before modifying sensitive files.

### Negative / Trade-offs

- Requires a Node.js runtime (v18+) on the developer's machine to execute the MCP server.
- Hybrid mode still maintains living documentation (`CONTEXT.md`, `adr/`) in the target repo (this is intentional, keeping domain knowledge versioned with the product code).
