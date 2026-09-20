# Universal Agents Workflow — MCP Router

This project is governed by **Universal Agents Workflow** powered by Model Context Protocol (MCP).

## AI Agent Operational Instructions:

1. **Before Any Coding or Implementation:**
   - Always run MCP Prompt \`uaw_intake_classifier\` or \`uaw_grilling\` to align scope and eliminate silent assumptions.
   - Do NOT invent unconfirmed business rules or edge cases.

2. **Ubiquitous Language & Terminology:**
   - Read MCP Resource \`uaw://context\` (or local \`CONTEXT.md\`).
   - Use MCP Tool \`uaw_update_context\` whenever new domain terms surface during elicitation.

3. **Architectural Decisions & Seams:**
   - Read MCP Resource \`uaw://adr\` (or local \`adr/\`) before proposing new architectures.
   - Record significant decisions using MCP Tool \`uaw_record_adr\`.

4. **Specification & Quality Gates:**
   - Scaffold feature lifecycles using MCP Tool \`uaw_scaffold_feature\`.
   - Validate specifications with MCP Tool \`uaw_validate_spec\` against IEEE 29148 before coding.

5. **Simplicity First (The Ladder):**
   - Apply Ponytail anti-overengineering: Stdlib > Native Platform > One-liner > Dependency.
   - Scan for complexity bloat using MCP Tool \`uaw_ponytail_scan\`.

6. **Hardware Git Locks:**
   - Run MCP Tool \`uaw_check_git_locks\` to ensure development occurs on feature branches (\`feat/_\`, \`fix/_\`).
