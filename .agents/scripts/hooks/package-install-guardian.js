#!/usr/bin/env node
/**
 * PreToolUse Hook - Universal Package Manager & Lockfile Guardian
 *
 * Runs before `run_command` in Antigravity.
 * Dynamically detects active project lockfiles (pnpm, npm, yarn, bun, poetry, cargo)
 * and blocks mismatched package managers to prevent lockfile corruption.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const {
  readStdinJson,
  outputJson,
  extractCommandLine,
  resolveWorkspaceRoot,
  log,
} = require("../lib/utils");

function detectActivePackageManager(workspaceRoot) {
  if (fs.existsSync(path.join(workspaceRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(workspaceRoot, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(workspaceRoot, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.join(workspaceRoot, "package-lock.json")))
    return "npm";
  if (fs.existsSync(path.join(workspaceRoot, "poetry.lock"))) return "poetry";
  return null;
}

async function main() {
  const input = await readStdinJson();
  const commandLine = extractCommandLine(input);

  if (!commandLine) {
    return outputJson({ decision: "allow" });
  }

  const workspaceRoot = resolveWorkspaceRoot();
  const activePM = detectActivePackageManager(workspaceRoot);

  // If no lockfile exists yet or unmanaged project, allow command
  if (!activePM) {
    return outputJson({ decision: "allow" });
  }

  const cmd = commandLine.trim();

  // Node ecosystem lockfile conflicts
  if (activePM === "pnpm") {
    if (/(?:^|[;&|`]\s*)(?:npm|yarn|bun)\s+(?:install|i|add)\b/i.test(cmd)) {
      const reason = [
        "BLOCKED: Detected mismatched package manager command in a pnpm workspace.",
        "This repository uses `pnpm-lock.yaml`. Please use `pnpm` to avoid lockfile corruption:",
        "  - To install dependencies: pnpm install",
        "  - To add a dependency: pnpm add <package>",
      ].join("\n");
      log(`Blocked non-pnpm command: "${commandLine}"`);
      return outputJson({ decision: "deny", reason });
    }
  } else if (activePM === "npm") {
    if (/(?:^|[;&|`]\s*)(?:pnpm|yarn|bun)\s+(?:install|i|add)\b/i.test(cmd)) {
      const reason = [
        "BLOCKED: Detected mismatched package manager command in an npm workspace.",
        "This repository uses `package-lock.json`. Please use `npm` to avoid lockfile divergence:",
        "  - To install dependencies: npm install",
        "  - To add a dependency: npm install <package>",
      ].join("\n");
      log(`Blocked non-npm command: "${commandLine}"`);
      return outputJson({ decision: "deny", reason });
    }
  } else if (activePM === "yarn") {
    if (/(?:^|[;&|`]\s*)(?:npm|pnpm|bun)\s+(?:install|i|add)\b/i.test(cmd)) {
      const reason = [
        "BLOCKED: Detected mismatched package manager command in a Yarn workspace.",
        "This repository uses `yarn.lock`. Please use `yarn` to avoid lockfile divergence:",
        "  - To install dependencies: yarn install",
        "  - To add a dependency: yarn add <package>",
      ].join("\n");
      log(`Blocked non-yarn command: "${commandLine}"`);
      return outputJson({ decision: "deny", reason });
    }
  } else if (activePM === "poetry") {
    if (/(?:^|[;&|`]\s*)pip\s+install\b/i.test(cmd)) {
      const reason = [
        "BLOCKED: Detected bare `pip install` in a Poetry-managed Python workspace.",
        "This repository uses `poetry.lock`. Please use `poetry` to manage dependencies:",
        "  - To add a package: poetry add <package>",
        "  - To install existing: poetry install",
      ].join("\n");
      log(`Blocked non-poetry command: "${commandLine}"`);
      return outputJson({ decision: "deny", reason });
    }
  }

  outputJson({ decision: "allow" });
}

main().catch((err) => {
  log(`Error in package-install-guardian: ${err.message}`);
  outputJson({ decision: "allow" });
});
