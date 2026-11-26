# 0003. Download-only framework distribution

- **Date:** 2026-11-26
- **Status:** ACCEPTED
- **Supersedes:** [0002. Hybrid MCP Server Architecture](0002-hybrid-mcp-server-architecture.md)
- **Approval:** Owner approved baseline v1.0 and technical plan for `download-only-distribution`.

## Context

The owner chose to remove the UAW MCP distribution and retain download-based
initialization, local skills and installer protections. Maintaining a separate
server package and npm setup path adds a second runtime and distribution model.
The signed-off feature requirements are recorded in
[requirements.md](../.specify/features/download-only-distribution/requirements.md).

## Decision

- Remove `packages/mcp-server/`, its runtime, package tests and setup instructions.
- Use the existing `install.sh` and `install.ps1` download/file-based entry points.
- Keep skills and domain artifacts local. Preserve existing user content and
  installer safety behavior during initialization and updates.
- Use the existing `spec-validator` agent skill to review evidence and traceability.
  It must not claim deterministic execution or certification.
- Do not introduce a replacement server, initialization CLI or validation CLI.
- Keep third-party MCP integrations outside this removal scope.

## Consequences

The framework no longer requires UAW MCP registration or its Node/npm runtime.
Existing installer prerequisites remain unchanged. Agents read local skills and
edit artifacts under the repository's sign-off and immutability rules. Validation
requires explicit evidence and agent review rather than a server response.
Existing clients configured for the removed UAW server must stop using that
registration; this decision does not remove unrelated client configuration.

The accepted ADR 0002 is preserved unchanged as historical context. Its UAW MCP
architecture is superseded by this decision.
