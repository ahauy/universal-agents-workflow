#!/usr/bin/env node
"use strict";

/**
 * install-hooks.js - Materialize `.agents/hooks.json` for the active harness.
 *
 * `.agents/hooks.json` is the single source of truth and is written in the
 * Google Antigravity dialect (PreInvocation / PreToolUse / PostToolUse /
 * PostInvocation, with Antigravity tool names). Claude Code needs the same
 * hooks registered in `.claude/settings.json` with its own event names and
 * native tool matchers.
 *
 * Usage:
 *   node .agents/scripts/install-hooks.js [--target DIR] [--harness auto|claude-code|antigravity]
 *                                         [--check] [--dry-run]
 *
 * The generator is idempotent and never overwrites hooks the user added by
 * hand: entries are merged by (event, matcher) and only workflow-owned hooks
 * (those whose command references `.agents/scripts/hooks/`) are replaced.
 */

const fs = require("fs");
const path = require("path");

const WORKFLOW_MARKER = ".agents/scripts/hooks/";

// Antigravity event -> Claude Code event
const EVENT_MAP = {
  PreToolUse: "PreToolUse",
  PostToolUse: "PostToolUse",
  PreInvocation: "SessionStart",
  PostInvocation: "Stop",
};

// Antigravity tool matcher -> Claude Code tool matcher (regex alternation)
const MATCHER_MAP = {
  run_command: "Bash",
  write_to_file: "Write|Edit|MultiEdit|NotebookEdit",
  replace_file_content: "Write|Edit|MultiEdit|NotebookEdit",
  multi_replace_file_content: "Write|Edit|MultiEdit|NotebookEdit",
};

function parseArgs(argv) {
  const opts = { target: process.cwd(), harness: "auto", check: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target") opts.target = path.resolve(argv[++i]);
    else if (a === "--harness") opts.harness = argv[++i];
    else if (a === "--check") opts.check = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--help" || a === "-h") opts.help = true;
  }
  return opts;
}

function detectHarness(target, requested) {
  if (requested && requested !== "auto") return requested;
  if (fs.existsSync(path.join(target, ".claude"))) return "claude-code";
  if (fs.existsSync(path.join(target, "CLAUDE.md"))) return "claude-code";
  return "antigravity";
}

/**
 * Rewrite an Antigravity-relative hook command into a project-root-relative one.
 */
function toProjectCommand(command) {
  return command.replace(/(^|\s)scripts\/hooks\//, "$1" + WORKFLOW_MARKER);
}

/**
 * Map an Antigravity matcher string onto Claude Code tool names.
 * Unknown matchers are passed through unchanged.
 */
function mapMatcher(matcher) {
  if (!matcher) return "";
  const parts = matcher
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  const mapped = new Set();
  for (const p of parts) {
    if (MATCHER_MAP[p]) mapped.add(MATCHER_MAP[p]);
    else mapped.add(p);
  }
  // Collapse duplicate alternatives (Write|Edit appears once after dedupe)
  const alts = [];
  for (const m of mapped) {
    for (const a of m.split("|")) {
      if (!alts.includes(a)) alts.push(a);
    }
  }
  return alts.join("|");
}

/**
 * Build the Claude Code `hooks` object from the Antigravity source.
 *
 * `.agents/hooks.json` mixes two entry shapes:
 *   flat   : { type, command, timeout }
 *   grouped: { matcher, hooks: [ { type, command, timeout } ] }
 * Both are normalized here.
 */
function buildClaudeHooks(source) {
  const out = {};

  const push = (event, matcher, hookDef) => {
    const groups = (out[event] = out[event] || []);
    const key = matcher || "";
    const group = groups.find((g) => (g.matcher || "") === key);
    if (group) {
      group.hooks.push(hookDef);
      return;
    }
    groups.push(matcher ? { matcher, hooks: [hookDef] } : { hooks: [hookDef] });
  };

  for (const [name, events] of Object.entries(source)) {
    for (const [event, entries] of Object.entries(events)) {
      const target = EVENT_MAP[event];
      if (!target) continue;

      for (const entry of entries) {
        const defs = Array.isArray(entry.hooks) ? entry.hooks : [entry];
        const matcher = entry.matcher ? mapMatcher(entry.matcher) : defaultMatcher(target);

        for (const def of defs) {
          if (!def || typeof def.command !== "string") continue;
          const hookDef = { type: "command", command: toProjectCommand(def.command) };
          if (def.timeout) hookDef.timeout = def.timeout;
          push(target, matcher, hookDef);
        }
      }
    }
  }
  return out;
}

/**
 * Session-level events: SessionStart accepts a matcher, Stop does not.
 */
function defaultMatcher(target) {
  if (target === "SessionStart") return "startup|resume";
  return "";
}

/**
 * Merge generated hooks into existing settings without clobbering user hooks.
 */
function mergeHooks(existing, generated) {
  const result = JSON.parse(JSON.stringify(existing || {}));
  const isWorkflow = (h) => typeof h.command === "string" && h.command.includes(WORKFLOW_MARKER);

  for (const [event, groups] of Object.entries(generated)) {
    const cur = result[event] || [];
    // Drop workflow-owned groups, keep everything the user authored.
    const kept = cur.filter((g) => !g.hooks.every(isWorkflow));
    result[event] = [...kept, ...groups];
  }
  return result;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(
      "Usage: node .agents/scripts/install-hooks.js [--target DIR] [--harness auto|claude-code|antigravity] [--check] [--dry-run]\n",
    );
    return 0;
  }

  const sourcePath = path.join(opts.target, ".agents", "hooks.json");
  if (!fs.existsSync(sourcePath)) {
    process.stderr.write(`[install-hooks] missing ${sourcePath}\n`);
    return 1;
  }
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const harness = detectHarness(opts.target, opts.harness);

  if (harness !== "claude-code") {
    process.stdout.write(
      `[install-hooks] harness=${harness}; .agents/hooks.json is already the native format. Nothing to generate.\n`,
    );
    return 0;
  }

  const generated = buildClaudeHooks(source);
  const settingsPath = path.join(opts.target, ".claude", "settings.json");
  const existing = fs.existsSync(settingsPath)
    ? JSON.parse(fs.readFileSync(settingsPath, "utf8"))
    : {};
  const merged = mergeHooks(existing, generated);
  const next = JSON.stringify(merged, null, 2) + "\n";
  const prev = fs.existsSync(settingsPath) ? fs.readFileSync(settingsPath, "utf8") : "";

  const count = Object.values(generated).reduce((n, g) => n + g.reduce((m, x) => m + x.hooks.length, 0), 0);

  if (opts.check) {
    if (next === prev) {
      process.stdout.write(`[install-hooks] OK: .claude/settings.json is in sync (${count} hooks).\n`);
      return 0;
    }
    process.stdout.write(
      `[install-hooks] OUTDATED: .claude/settings.json does not match .agents/hooks.json.\n` +
        `              Run: node .agents/scripts/install-hooks.js --harness claude-code\n`,
    );
    return 1;
  }

  if (opts.dryRun) {
    process.stdout.write(next);
    return 0;
  }

  if (next === prev) {
    process.stdout.write(`[install-hooks] unchanged: .claude/settings.json (${count} hooks).\n`);
    return 0;
  }

  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, next);
  process.stdout.write(
    `[install-hooks] wrote .claude/settings.json with ${count} workflow hooks across ${Object.keys(generated).length} events.\n`,
  );
  return 0;
}

process.exit(main());
