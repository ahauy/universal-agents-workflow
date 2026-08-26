#!/usr/bin/env node
/**
 * PreInvocation Hook - Universal Project Context Initializer
 *
 * Runs before the model is called in Antigravity.
 * Injects dynamic project context, git status, detected tech stack, and mandatory development
 * guidelines into the conversation turn so the agent aligns with Universal Workflow standards.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const {
  readStdinJson,
  outputJson,
  isGitRepo,
  getGitBranch,
  getGitModifiedFiles,
  log,
} = require("../lib/utils");

async function main() {
  const input = await readStdinJson();
  let workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  if (
    path.basename(workspaceRoot) === "hooks" ||
    path.basename(workspaceRoot) === "scripts"
  ) {
    workspaceRoot = path.resolve(workspaceRoot, "../..");
  }
  if (path.basename(workspaceRoot) === ".agents") {
    workspaceRoot = path.resolve(workspaceRoot, "..");
  }

  const isGit = isGitRepo(workspaceRoot);
  const branch = isGit ? getGitBranch(workspaceRoot) : "N/A";
  const modifiedFiles = isGit ? getGitModifiedFiles([], workspaceRoot) : [];

  const modifiedSummary =
    modifiedFiles.length > 0
      ? `(${modifiedFiles.length} modified/untracked files: ${modifiedFiles.slice(0, 5).join(", ")}${modifiedFiles.length > 5 ? "..." : ""})`
      : "(Working tree clean)";

  // Dynamically inspect project context
  let projectName = path.basename(workspaceRoot);
  let stackDetails = [];

  const pkgJsonPath = path.join(workspaceRoot, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      if (pkg.name) projectName = pkg.name;
      if (pkg.workspaces) {
        stackDetails.push(
          `Monorepo workspaces: ${Array.isArray(pkg.workspaces) ? pkg.workspaces.join(", ") : "configured"}`,
        );
      }
    } catch (e) {
      // ignore
    }
  }

  const hasContextMd = fs.existsSync(path.join(workspaceRoot, "CONTEXT.md"));
  const hasAdr = fs.existsSync(path.join(workspaceRoot, "adr"));

  const ephemeralMessage = [
    `### [${projectName} Project Context]`,
    `- **Branch**: \`${branch}\` ${modifiedSummary}`,
    stackDetails.length > 0 ? `- **Stack**: ${stackDetails.join(" | ")}` : null,
    `- **Shared Language & ADR**: CONTEXT.md (${hasContextMd ? "active" : "missing"}), adr/ (${hasAdr ? "active" : "missing"})`,
    "- **Workflow Reminder** (from `.agents/AGENTS.md`):",
    "  - Pipeline: BA Elicitation (P1) -> Spec & Plan (P2-4) -> TDD Implementation (P5) -> Dual Review & Docs (P6)",
    "  - Mandatory: Consult `.agents/skills/engineering/` and `.agents/skills/productivity/` before writing code.",
    "  - Quality rules: Immutable data patterns, Zero-silent-assumptions, KISS, DRY, YAGNI, File < 800 lines, Function < 50 lines.",
  ]
    .filter(Boolean)
    .join("\n");

  log(
    `Context initialized on branch [${branch}], ${modifiedFiles.length} files active.`,
  );

  outputJson({
    injectSteps: [
      {
        ephemeralMessage,
      },
    ],
  });
}

main().catch((err) => {
  log(`Error initializing session context: ${err.message}`);
  outputJson({ injectSteps: [] });
});
