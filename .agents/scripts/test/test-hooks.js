#!/usr/bin/env node
"use strict";

/**
 * Harness compatibility tests.
 *
 * Runs each guard hook twice - once with an Antigravity payload, once with the
 * equivalent Claude Code payload - and asserts both agree on allow/deny. This
 * is the regression test for "hooks silently do nothing on a non-Antigravity
 * harness".
 *
 * Usage: node .agents/scripts/test/test-hooks.js
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const HOOKS = path.join(ROOT, ".agents", "scripts", "hooks");

let passed = 0;
let failed = 0;

function check(label, cond) {
  if (cond) {
    passed++;
    console.log(`  ok   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}`);
  }
}

function execHook(hook, payload, cwd = ROOT) {
  let stdout = "";
  let exitCode = 0;
  try {
    stdout = execFileSync("node", [path.join(HOOKS, hook)], {
      input: JSON.stringify(payload),
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (err) {
    stdout = err.stdout || "";
    exitCode = typeof err.status === "number" ? err.status : 1;
  }
  let parsed = {};
  try {
    parsed = JSON.parse(stdout || "{}");
  } catch {
    parsed = { _unparsed: stdout };
  }
  const denied =
    exitCode === 2 ||
    parsed.decision === "deny" ||
    (parsed.hookSpecificOutput &&
      parsed.hookSpecificOutput.permissionDecision === "deny");
  return { parsed, exitCode, denied };
}

function runAntigravity(hook, toolName, args, cwd) {
  return execHook(hook, { toolCall: { name: toolName, args } }, cwd);
}

function runClaude(hook, event, toolName, toolInput, cwd) {
  return execHook(
    hook,
    { hook_event_name: event, tool_name: toolName, tool_input: toolInput, cwd: cwd || ROOT },
    cwd,
  );
}

// A scratch workspace so config-protection can assert against a file that
// really exists on disk, without touching the repo.
const SANDBOX = fs.mkdtempSync(path.join(os.tmpdir(), "bai-hooks-"));
fs.writeFileSync(path.join(SANDBOX, "biome.json"), "{}\n");

console.log("\n# secret-leak-blocker.js");
{
  // Matches the hook's real "AWS Access Key ID" detector.
  const secret = "const awsKey = 'AKIAABCDEFGHIJKLMNOP';\n";
  const clean = "# just a comment\n";

  check(
    "antigravity blocks hardcoded secret",
    runAntigravity("secret-leak-blocker.js", "write_to_file", {
      target_file: "src/config.js",
      code_content: secret,
    }).denied,
  );
  check(
    "claude-code blocks hardcoded secret",
    runClaude("secret-leak-blocker.js", "PreToolUse", "Write", {
      file_path: "src/config.js",
      content: secret,
    }).denied,
  );
  check(
    "claude-code allows clean content",
    !runClaude("secret-leak-blocker.js", "PreToolUse", "Write", {
      file_path: "src/config.js",
      content: clean,
    }).denied,
  );
  check(
    "antigravity allows clean content",
    !runAntigravity("secret-leak-blocker.js", "write_to_file", {
      target_file: "src/config.js",
      code_content: clean,
    }).denied,
  );
}

console.log("\n# block-no-verify.js");
{
  check(
    "antigravity blocks --no-verify",
    runAntigravity("block-no-verify.js", "run_command", {
      command: "git commit --no-verify -m x",
    }).denied,
  );
  check(
    "claude-code blocks --no-verify",
    runClaude("block-no-verify.js", "PreToolUse", "Bash", {
      command: "git commit --no-verify -m x",
    }).denied,
  );
  check(
    "claude-code allows normal commit",
    !runClaude("block-no-verify.js", "PreToolUse", "Bash", {
      command: "git commit -m x",
    }).denied,
  );
}

console.log("\n# git-guardrails.js");
{
  check(
    "antigravity blocks force push to main",
    runAntigravity("git-guardrails.js", "run_command", {
      command: "git push --force origin main",
    }).denied,
  );
  check(
    "claude-code blocks force push to main",
    runClaude("git-guardrails.js", "PreToolUse", "Bash", {
      command: "git push --force origin main",
    }).denied,
  );
  check(
    "claude-code allows git status",
    !runClaude("git-guardrails.js", "PreToolUse", "Bash", { command: "git status" }).denied,
  );
}

console.log("\n# config-protection.js");
{
  check(
    "antigravity blocks protected config",
    runAntigravity(
      "config-protection.js",
      "write_to_file",
      { target_file: "biome.json", code_content: '{"rules":"off"}' },
      SANDBOX,
    ).denied,
  );
  check(
    "claude-code blocks protected config",
    runClaude(
      "config-protection.js",
      "PreToolUse",
      "Write",
      { file_path: "biome.json", content: '{"rules":"off"}' },
      SANDBOX,
    ).denied,
  );
  check(
    "claude-code allows a non-protected file",
    !runClaude(
      "config-protection.js",
      "PreToolUse",
      "Write",
      { file_path: "src/app.ts", content: "export const x = 1;" },
      SANDBOX,
    ).denied,
  );
}

console.log("\n# package-install-guardian.js");
{
  // A pnpm workspace must reject npm installs (lockfile corruption guard).
  const PM_SANDBOX = fs.mkdtempSync(path.join(os.tmpdir(), "bai-pm-"));
  fs.writeFileSync(path.join(PM_SANDBOX, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
  fs.mkdirSync(path.join(PM_SANDBOX, ".agents"), { recursive: true });

  const ag = runAntigravity(
    "package-install-guardian.js",
    "run_command",
    { command: "npm install left-pad --save" },
    PM_SANDBOX,
  );
  const cc = runClaude(
    "package-install-guardian.js",
    "PreToolUse",
    "Bash",
    { command: "npm install left-pad --save" },
    PM_SANDBOX,
  );
  check("antigravity blocks npm install in a pnpm workspace", ag.denied);
  check("claude-code blocks npm install in a pnpm workspace", cc.denied);
  check(
    "claude-code allows pnpm add",
    !runClaude(
      "package-install-guardian.js",
      "PreToolUse",
      "Bash",
      { command: "pnpm add left-pad" },
      PM_SANDBOX,
    ).denied,
  );
  fs.rmSync(PM_SANDBOX, { recursive: true, force: true });
}

console.log("\n# session-context-init.js");
{
  const cc = runClaude("session-context-init.js", "SessionStart", "", {});
  const ctx =
    cc.parsed && cc.parsed.hookSpecificOutput && cc.parsed.hookSpecificOutput.additionalContext;
  check("claude-code SessionStart yields additionalContext", !!ctx);
  check(
    "additionalContext carries the workflow reminder",
    typeof ctx === "string" && ctx.includes("Workflow Reminder"),
  );

  const ag = execHook("session-context-init.js", {});
  check("antigravity SessionStart yields injectSteps", Array.isArray(ag.parsed.injectSteps));
}

console.log("\n# fail-open behavior");
{
  check("empty stdin does not block", !execHook("secret-leak-blocker.js", {}).denied);
  check(
    "unparseable payload does not block",
    !execHook("secret-leak-blocker.js", { _raw: "x", _parseError: "boom" }).denied,
  );
}

fs.rmSync(SANDBOX, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
