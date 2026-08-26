#!/usr/bin/env node
/**
 * PostToolUse Hook - Polyglot Auto-Format on Edit
 *
 * Runs after `write_to_file`, `replace_file_content`, `multi_replace_file_content`.
 * Automatically formats the modified file with the appropriate language formatter
 * (Prettier, Ruff/Black, Gofmt, Rustfmt) if installed.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  readStdinJson,
  outputJson,
  extractTargetFilePath,
  resolveWorkspaceRoot,
  log,
} = require("../lib/utils");

function formatFile(filePath, workspaceRoot) {
  const ext = path.extname(filePath).toLowerCase();

  // Python: ruff format or black
  if (ext === ".py") {
    try {
      execSync(`ruff format "${filePath}"`, {
        cwd: workspaceRoot,
        stdio: "pipe",
        timeout: 10000,
      });
      return "ruff format";
    } catch {
      try {
        execSync(`black -q "${filePath}"`, {
          cwd: workspaceRoot,
          stdio: "pipe",
          timeout: 10000,
        });
        return "black";
      } catch {
        return null;
      }
    }
  }

  // Go: gofmt
  if (ext === ".go") {
    try {
      execSync(`gofmt -w "${filePath}"`, {
        cwd: workspaceRoot,
        stdio: "pipe",
        timeout: 10000,
      });
      return "gofmt";
    } catch {
      return null;
    }
  }

  // Rust: rustfmt
  if (ext === ".rs") {
    try {
      execSync(`rustfmt "${filePath}"`, {
        cwd: workspaceRoot,
        stdio: "pipe",
        timeout: 10000,
      });
      return "rustfmt";
    } catch {
      return null;
    }
  }

  // Web & Config: Prettier
  if (/\.(tsx?|jsx?|json|css|scss|md|html|yaml|yml)$/i.test(filePath)) {
    try {
      execSync(`npx prettier --write "${filePath}"`, {
        cwd: workspaceRoot,
        stdio: "pipe",
        timeout: 15000,
      });
      return "prettier";
    } catch {
      return null;
    }
  }

  return null;
}

async function main() {
  const input = await readStdinJson();
  const filePath = extractTargetFilePath(input);

  if (filePath && fs.existsSync(filePath)) {
    const workspaceRoot = resolveWorkspaceRoot();
    const formattedWith = formatFile(filePath, workspaceRoot);
    if (formattedWith) {
      const relPath = path.relative(workspaceRoot, filePath);
      log(`Auto-formatted [${relPath}] with ${formattedWith}.`);
    }
  }

  outputJson({});
}

main().catch((err) => {
  log(`Error in auto-format-on-edit: ${err.message}`);
  outputJson({});
});
