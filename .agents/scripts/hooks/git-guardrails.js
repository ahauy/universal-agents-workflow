#!/usr/bin/env node
/**
 * PreToolUse Hook - Hard Git Guardrails
 *
 * Runs before `run_command` in Antigravity.
 * Mechanically intercepts and blocks potentially destructive Git commands before they can execute:
 * - git push --force / git push -f / --force-with-lease
 * - git reset --hard
 * - git clean -f / git clean -fd / git clean -fx
 * - git branch -D
 * - git checkout . / git restore . (sweeping working tree wipe)
 *
 * Safe Override: Set ALLOW_DESTRUCTIVE_GIT=1 in environment if user explicitly approves.
 */

"use strict";

const {
  readStdinJson,
  outputJson,
  extractCommandLine,
  log,
} = require("../lib/utils");

const DESTRUCTIVE_GIT_RULES = [
  {
    name: "Force Push",
    pattern:
      /(?:^|[;&|`]\s*)git(?:\.exe)?\s+push\b.*(?:\s+-f\b|\s+--force\b|\s+--force-with-lease\b)/i,
    description:
      "git push --force rewrites remote history and can destroy collaborators work.",
  },
  {
    name: "Hard Reset",
    pattern: /(?:^|[;&|`]\s*)git(?:\.exe)?\s+reset\b.*(?:\s+--hard\b)/i,
    description:
      "git reset --hard permanently destroys uncommitted local changes and commits.",
  },
  {
    name: "Force Clean",
    pattern: /(?:^|[;&|`]\s*)git(?:\.exe)?\s+clean\b.*(?:\s+-[a-zA-Z]*f)/i,
    description:
      "git clean -f deletes untracked files permanently from workspace.",
  },
  {
    name: "Force Delete Branch",
    pattern: /(?:^|[;&|`]\s*)git(?:\.exe)?\s+branch\b.*(?:\s+-D\b)/i,
    description:
      "git branch -D force-deletes branches even if they contain unmerged work.",
  },
  {
    name: "Sweeping Working Tree Revert",
    pattern: /(?:^|[;&|`]\s*)git(?:\.exe)?\s+(?:checkout|restore)\b\s+\.\s*$/i,
    description:
      'Sweeping checkout/restore on "." discards all uncommitted modifications across the repository.',
  },
];

async function main() {
  const input = await readStdinJson();
  const toolName = input?.toolCall?.name || "";
  const commandLine = extractCommandLine(input);

  if (toolName !== "run_command" || !commandLine) {
    return outputJson({ decision: "allow" });
  }

  for (const rule of DESTRUCTIVE_GIT_RULES) {
    if (rule.pattern.test(commandLine)) {
      if (process.env.ALLOW_DESTRUCTIVE_GIT === "1") {
        log(
          `ALLOW_DESTRUCTIVE_GIT=1 active. Bypassing guardrail for [${rule.name}]: "${commandLine}"`,
        );
        return outputJson({ decision: "allow" });
      }

      const reason = [
        `🛑 BLOCKED BY GIT GUARDRAILS: Detected potentially destructive operation [${rule.name}].`,
        `Command: "${commandLine}"`,
        `Why it is blocked: ${rule.description}`,
        "",
        "To prevent catastrophic data loss, AI agents are prohibited from executing destructive Git operations.",
        "If this operation is truly necessary and confirmed by human, rerun with ALLOW_DESTRUCTIVE_GIT=1 or run manually in terminal.",
      ].join("\n");

      log(`Blocked destructive git command [${rule.name}]: ${commandLine}`);
      return outputJson({
        decision: "deny",
        reason,
      });
    }
  }

  outputJson({ decision: "allow" });
}

main().catch((err) => {
  log(`Error in git-guardrails hook: ${err.message}`);
  outputJson({ decision: "allow" });
});
