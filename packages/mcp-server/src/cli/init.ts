import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { safeWriteFileWithDiff } from "../workspace/safety.js";
import {
  getContextPath,
  getAgentsPath,
  getAdrDir,
  fileExists,
} from "../workspace/resolver.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runInit(targetDir: string = process.cwd()) {
  console.log(
    `\n🚀 Initializing Universal Agents Workflow (MCP) in: ${targetDir}\n`,
  );

  // 1. Create minimal AGENTS.md router
  const agentsPath = path.resolve(targetDir, "AGENTS.md");
  if (!(await fileExists(agentsPath))) {
    const templatePath = path.resolve(
      __dirname,
      "../../templates/AGENTS.minimal.md",
    );
    let templateContent = "";
    try {
      templateContent = await fs.readFile(templatePath, "utf-8");
    } catch {
      // Fallback in case path differs in dist
      templateContent = `# Universal Agents Workflow — MCP Router

This project is governed by **Universal Agents Workflow** via Model Context Protocol (MCP).

## AI Agent Instructions:
1. Run MCP Prompt \`uaw_intake_classifier\` or \`uaw_grilling\` before coding.
2. Read MCP Resource \`uaw://context\` for ubiquitous domain language.
3. Read MCP Resource \`uaw://adr\` and record decisions using MCP Tool \`uaw_record_adr\`.
4. Scaffold and validate specifications via \`uaw_scaffold_feature\` & \`uaw_validate_spec\`.
5. Run \`uaw_ponytail_scan\` to eliminate over-engineering bloat.
6. Verify \`uaw_check_git_locks\` to ensure commits are on feature branches.
`;
    }

    const res = await safeWriteFileWithDiff(agentsPath, templateContent, {
      createBackup: false,
    });
    if (res.success) {
      console.log(`  ✅ Created router: AGENTS.md (~20 lines)`);
    }
  } else {
    console.log(`  ℹ️ AGENTS.md already exists, skipping.`);
  }

  // 2. Initialize CONTEXT.md if not present
  const contextPath = path.resolve(targetDir, "CONTEXT.md");
  if (!(await fileExists(contextPath))) {
    const defaultContext = `# CONTEXT.md — Shared Language (Ubiquitous Language)

## Glossary

| Term | Short definition | Before (verbose) | After (concise) | Notes |
| :--- | :--- | :--- | :--- | :--- |
`;
    await safeWriteFileWithDiff(contextPath, defaultContext, {
      createBackup: false,
    });
    console.log(`  ✅ Initialized Data Plane: CONTEXT.md`);
  } else {
    console.log(`  ℹ️ CONTEXT.md already exists, skipping.`);
  }

  // 3. Initialize adr/ directory
  const adrDir = path.resolve(targetDir, "adr");
  await fs.mkdir(adrDir, { recursive: true });
  const adrReadme = path.resolve(adrDir, "README.md");
  if (!(await fileExists(adrReadme))) {
    const readmeContent = `# Architectural Decision Records (ADRs)

| Number | Title | Status | Date |
| :--- | :--- | :--- | :--- |
| [0001](./0001-record-architecture-decisions.md) | Record Architectural Decisions | ACCEPTED | ${new Date().toISOString().split("T")[0]} |
`;
    const adr0001 = path.resolve(
      adrDir,
      "0001-record-architecture-decisions.md",
    );
    const adr0001Content = `# 0001. Record Architectural Decisions

- **Date:** ${new Date().toISOString().split("T")[0]}
- **Status:** ACCEPTED

## Context & Problem Statement
We need to record significant architectural decisions so the team and AI agents maintain long-term alignment.

## Decision
We will use Architectural Decision Records (ADRs) in this directory managed via MCP Tool \`uaw_record_adr\`.

## Consequences
Every architectural choice becomes searchable, immutable, and visible to agents.
`;
    await safeWriteFileWithDiff(adrReadme, readmeContent, {
      createBackup: false,
    });
    await safeWriteFileWithDiff(adr0001, adr0001Content, {
      createBackup: false,
    });
    console.log(
      `  ✅ Initialized ADR store: adr/ & 0001-record-architecture-decisions.md`,
    );
  }

  // 4. Print MCP Client Configuration Guide
  console.log(
    `\n🎉 Project setup complete! Add this to your AI Editor's MCP config:\n`,
  );
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          "universal-agents": {
            command: "npx",
            args: ["-y", "@universal-agents/mcp-server@latest"],
          },
        },
      },
      null,
      2,
    ),
  );

  console.log(`\nLocations for MCP configuration:`);
  console.log(`- **Antigravity IDE**: App Data > mcp_config.json`);
  console.log(`- **Cursor**: .cursor/mcp.json or Settings > MCP`);
  console.log(`- **Claude Code / Desktop**: claude_desktop_config.json\n`);
}
