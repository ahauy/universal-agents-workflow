#!/usr/bin/env node
/**
 * PreToolUse Hook - Pre-Push Verification Check
 *
 * Runs before `run_command` in Antigravity.
 * If the command is a `git push`, runs automated project build/test checks first.
 * If checks fail, blocks the command and prompts the agent to fix errors before pushing.
 */

"use strict";

const { execSync } = require("child_process");
const {
  readStdinJson,
  outputJson,
  log,
  resolveWorkspaceRoot,
} = require("../lib/utils");

function isGitPushCommand(cmd) {
  if (!cmd || typeof cmd !== "string") return false;
  // Match `git push`, `git.exe push`, ignoring leading whitespace or chaining
  const trimmed = cmd.trim();
  const pushRegex = /(?:^|[;&|`]\s*)(?:git(?:\.exe)?)\s+push\b/i;
  return pushRegex.test(trimmed);
}

const fs = require("fs");
const path = require("path");

function detectProjectChecks(workspaceRoot) {
  const checks = [];

  // 1. Rust
  if (fs.existsSync(path.join(workspaceRoot, "Cargo.toml"))) {
    checks.push({ name: "Cargo Check", command: "cargo check" });
    checks.push({ name: "Cargo Test", command: "cargo test" });
    return checks;
  }

  // 2. Go
  if (fs.existsSync(path.join(workspaceRoot, "go.mod"))) {
    checks.push({ name: "Go Test", command: "go test ./..." });
    return checks;
  }

  // 3. Python
  if (
    fs.existsSync(path.join(workspaceRoot, "pyproject.toml")) ||
    fs.existsSync(path.join(workspaceRoot, "requirements.txt")) ||
    fs.existsSync(path.join(workspaceRoot, "Pipfile"))
  ) {
    if (fs.existsSync(path.join(workspaceRoot, "poetry.lock"))) {
      checks.push({
        name: "Python Pytest (Poetry)",
        command: "poetry run pytest",
      });
    } else {
      checks.push({ name: "Python Pytest", command: "pytest" });
    }
    return checks;
  }

  // 4. Java / Kotlin
  if (
    fs.existsSync(path.join(workspaceRoot, "build.gradle")) ||
    fs.existsSync(path.join(workspaceRoot, "build.gradle.kts"))
  ) {
    const gradleCmd = fs.existsSync(path.join(workspaceRoot, "gradlew"))
      ? "./gradlew"
      : "gradle";
    checks.push({ name: "Gradle Test", command: `${gradleCmd} test` });
    return checks;
  }
  if (fs.existsSync(path.join(workspaceRoot, "pom.xml"))) {
    const mvnCmd = fs.existsSync(path.join(workspaceRoot, "mvnw"))
      ? "./mvnw"
      : "mvn";
    checks.push({ name: "Maven Test", command: `${mvnCmd} test` });
    return checks;
  }

  // 5. Node / TypeScript
  const pkgJsonPath = path.join(workspaceRoot, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    let pm = "npm";
    if (fs.existsSync(path.join(workspaceRoot, "pnpm-lock.yaml"))) pm = "pnpm";
    else if (fs.existsSync(path.join(workspaceRoot, "yarn.lock"))) pm = "yarn";
    else if (fs.existsSync(path.join(workspaceRoot, "bun.lockb"))) pm = "bun";

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      const scripts = pkg.scripts || {};
      if (scripts.build) {
        checks.push({ name: "Node Build", command: `${pm} run build` });
      }
      if (
        scripts.test &&
        scripts.test !== 'echo "Error: no test specified" && exit 1'
      ) {
        checks.push({ name: "Node Test", command: `${pm} test` });
      } else if (scripts.lint) {
        checks.push({ name: "Node Lint", command: `${pm} run lint` });
      }
    } catch (e) {
      // ignore
    }
    return checks;
  }

  return checks;
}

function runVerificationChecks(workspaceRoot) {
  if (process.env.SKIP_PRE_PUSH_CHECK === "1") {
    log("SKIP_PRE_PUSH_CHECK=1 is set. Skipping pre-push checks.");
    return { passed: true };
  }

  const checks = detectProjectChecks(workspaceRoot);
  if (checks.length === 0) {
    log(
      "No automated test/build checks detected for current project. Skipping pre-push verification.",
    );
    return { passed: true };
  }

  for (const check of checks) {
    try {
      log(`Running pre-push check: [${check.name}] (${check.command})...`);
      execSync(check.command, {
        cwd: workspaceRoot,
        encoding: "utf8",
        stdio: "pipe",
        timeout: 120000, // 2 minutes timeout
      });
      log(`Check passed: [${check.name}]`);
    } catch (err) {
      const stdout = err.stdout ? String(err.stdout).slice(-1500) : "";
      const stderr = err.stderr ? String(err.stderr).slice(-1500) : "";
      const outputSnippet = (stderr || stdout || err.message).trim();
      return {
        passed: false,
        failedCheck: check.name,
        details: outputSnippet,
      };
    }
  }

  return { passed: true };
}

async function main() {
  const input = await readStdinJson();
  const toolCall = input.toolCall || {};
  const toolName = toolCall.name || "";
  const args = toolCall.args || {};
  const commandLine = args.CommandLine || args.command || "";

  if (toolName !== "run_command" || !isGitPushCommand(commandLine)) {
    return outputJson({ decision: "allow" });
  }

  log(
    `Detected 'git push' command: "${commandLine}". Triggering pre-push verification...`,
  );
  const workspaceRoot = resolveWorkspaceRoot();
  const result = runVerificationChecks(workspaceRoot);

  if (!result.passed) {
    log(
      `Pre-push verification FAILED on [${result.failedCheck}]. Blocking git push.`,
    );
    return outputJson({
      decision: "deny",
      reason: [
        `BLOCKED: Pre-push verification check failed on [${result.failedCheck}].`,
        "You must ensure the codebase builds, typechecks, and passes linters before pushing to remote repository.",
        "",
        "Error details:",
        result.details,
      ].join("\n"),
    });
  }

  log("Pre-push verification succeeded. Allowing git push.");
  outputJson({
    decision: "allow",
    reason:
      "Pre-push verification checks (build, typecheck, lint) passed successfully.",
  });
}

main().catch((err) => {
  log(`Pre-push hook encountered unexpected error: ${err.message}`);
  // In case of unexpected script crash, allow command but warn
  outputJson({ decision: "allow" });
});
