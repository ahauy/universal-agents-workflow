#!/usr/bin/env node
/**
 * PreInvocation Hook - Universal Project Context Initializer
 *
 * Runs before the model is called. Injects dynamic project context (git state,
 * detected stack, workflow reminder) so the agent aligns with Universal
 * Workflow standards.
 *
 * This hook fires on EVERY turn. Emitting the same block every turn is pure
 * token waste, so the block is fingerprinted and only re-emitted when:
 *   - the branch, HEAD commit, or dirty-file set changed, OR
 *   - the last emission is older than TTL_MS (context may have been compacted).
 *
 * Set UAW_CONTEXT_ALWAYS=1 to force injection on every turn.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {
  readStdinJson,
  outputJson,
  isGitRepo,
  getGitBranch,
  getGitHead,
  getGitModifiedFiles,
  writeFileSafe,
  log,
} = require("../lib/utils");

const TTL_MS = 30 * 60 * 1000;
const CACHE_FILE = path.join(".agents", ".cache", "session-context.json");

function resolveRoot() {
  let root = process.env.WORKSPACE_ROOT || process.cwd();
  const base = path.basename(root);
  if (base === "hooks" || base === "scripts") {
    root = path.resolve(root, "../..");
  }
  if (path.basename(root) === ".agents") {
    root = path.resolve(root, "..");
  }
  return root;
}

function readCache(cachePath) {
  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  await readStdinJson();

  const root = resolveRoot();
  const isGit = isGitRepo(root);
  const branch = isGit ? getGitBranch(root) : "N/A";
  const head = isGit ? getGitHead(root) : "none";
  const modifiedFiles = isGit ? getGitModifiedFiles([], root) : [];

  const fingerprint = crypto
    .createHash("sha1")
    .update([branch, head, modifiedFiles.join("|")].join("::"))
    .digest("hex")
    .slice(0, 16);

  const cachePath = path.join(root, CACHE_FILE);
  const cached = readCache(cachePath);
  const fresh =
    cached &&
    cached.fingerprint === fingerprint &&
    Date.now() - (cached.at || 0) < TTL_MS;

  if (fresh && process.env.UAW_CONTEXT_ALWAYS !== "1") {
    log(`Context unchanged (${fingerprint}), skipping injection.`);
    outputJson({ injectSteps: [] });
    return;
  }

  const modifiedSummary =
    modifiedFiles.length > 0
      ? `(${modifiedFiles.length} modified/untracked: ${modifiedFiles.slice(0, 5).join(", ")}${modifiedFiles.length > 5 ? "..." : ""})`
      : "(clean)";

  let projectName = path.basename(root);
  const stackDetails = [];
  const pkgJsonPath = path.join(root, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      if (pkg.name) projectName = pkg.name;
      if (pkg.workspaces) {
        stackDetails.push(
          `Monorepo: ${Array.isArray(pkg.workspaces) ? pkg.workspaces.join(", ") : "configured"}`,
        );
      }
    } catch {
      // ignore malformed package.json
    }
  }

  const hasContextMd = fs.existsSync(path.join(root, "CONTEXT.md"));
  const hasAdr = fs.existsSync(path.join(root, "adr"));

  const ephemeralMessage = [
    `### [${projectName} Project Context]`,
    `- **Branch**: \`${branch}\` @ \`${head}\` ${modifiedSummary}`,
    stackDetails.length > 0 ? `- **Stack**: ${stackDetails.join(" | ")}` : null,
    `- **Shared language & ADR**: CONTEXT.md (${hasContextMd ? "active" : "missing"}), adr/ (${hasAdr ? "active" : "missing"})`,
    "- **Workflow** (from `AGENTS.md`):",
    "  - Pipeline: Intake BA checkpoint before implementation: outcome, behavior, scope, evidence, unknowns, acceptance. Fast: one context; Full on T1–T7: baseline → native plan → slices → review → docs.",
    "  - Read skills on demand only; step detail in `.agents/docs/pipeline-detail.md`.",
    "  - Invariants: no autonomous git, Full requires signed-off baseline and approved plan/tasks; zero Critical bugs, zero silent assumptions.",
  ]
    .filter(Boolean)
    .join("\n");

  writeFileSafe(
    cachePath,
    JSON.stringify({ fingerprint, at: Date.now(), branch, head }, null, 2),
  );

  log(`Context injected on [${branch}], ${modifiedFiles.length} files active.`);

  outputJson({ injectSteps: [{ ephemeralMessage }] });
}

main().catch((err) => {
  log(`Error initializing session context: ${err.message}`);
  outputJson({ injectSteps: [] });
});
