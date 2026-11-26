#!/usr/bin/env node
/**
 * metrics.mjs - one-line task telemetry for the Fast/Full lane split.
 *
 * Why: the lane change is a hypothesis ("less ceremony = faster"). Without a
 * number per task, "feels faster" is the only evidence we ever get.
 *
 * Usage:
 *   node .agents/scripts/metrics.mjs start --lane fast [--story US-001] [--trigger T3]
 *   node .agents/scripts/metrics.mjs end [--outcome done] [--review-rounds 0] [--questions 0] [--tokens 12000]
 *   node .agents/scripts/metrics.mjs report [--last 20]
 *
 * Storage:
 *   .specify/metrics/active.json   (ephemeral, gitignored)
 *   .specify/metrics/tasks.jsonl   (append-only, tracked)
 *
 * Every command is fail-soft: telemetry never blocks the actual work.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIR = path.join(ROOT, ".specify", "metrics");
const ACTIVE = path.join(DIR, "active.json");
const LOG = path.join(DIR, "tasks.jsonl");

const TEST_FILE = /(^|\/)(tests?|__tests__|spec)\/|\.(test|spec)\.[cm]?[jt]sx?$/i;

function parseArgs(argv) {
  const command = argv[0] || "report";
  const flags = {};
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }
    flags[key] = next;
    i++;
  }
  return { command, flags };
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function ensureDir() {
  fs.mkdirSync(DIR, { recursive: true });
}

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function changedFiles() {
  const out = git("status --porcelain");
  if (!out) return [];
  return out
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter(Boolean);
}

function lineStats() {
  const out = git("diff --numstat HEAD");
  const source = out || git("diff --numstat");
  let added = 0;
  let removed = 0;
  for (const line of source.split("\n")) {
    const [a, r] = line.split("\t");
    if (Number.isInteger(Number(a))) added += Number(a);
    if (Number.isInteger(Number(r))) removed += Number(r);
  }
  return { added, removed };
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function median(values) {
  const nums = values.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function start(flags) {
  ensureDir();
  const entry = {
    started_at: new Date().toISOString(),
    lane: flags.lane === "full" ? "full" : "fast",
    story: flags.story || null,
    trigger: flags.trigger || null,
    branch: git("rev-parse --abbrev-ref HEAD") || null,
  };
  if (readJson(ACTIVE)) {
    console.error("[metrics] warning: an active task already exists; overwriting it.");
  }
  fs.writeFileSync(ACTIVE, JSON.stringify(entry, null, 2) + "\n");
  console.log(`[metrics] started ${entry.lane} lane${entry.story ? ` (${entry.story})` : ""}`);
}

function end(flags) {
  ensureDir();
  const active = readJson(ACTIVE);
  const endedAt = new Date();
  const files = changedFiles();
  const { added, removed } = lineStats();
  const entry = {
    ...(active || { started_at: endedAt.toISOString(), lane: flags.lane === "full" ? "full" : "fast" }),
    ended_at: endedAt.toISOString(),
    outcome: flags.outcome || "done",
    duration_min: active ? Math.round(((endedAt - new Date(active.started_at)) / 60000) * 10) / 10 : null,
    review_rounds: number(flags["review-rounds"], 0),
    questions_to_user: number(flags.questions, 0),
    tokens: flags.tokens ? number(flags.tokens) : null,
    files_changed: files.length,
    test_files_changed: files.filter((f) => TEST_FILE.test(f)).length,
    lines_added: added,
    lines_removed: removed,
    commit: git("rev-parse --short HEAD") || null,
  };
  fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
  if (active) fs.rmSync(ACTIVE, { force: true });
  console.log(
    `[metrics] ${entry.lane} ${entry.outcome} in ${entry.duration_min ?? "?"} min - ` +
      `${entry.files_changed} files, +${entry.lines_added}/-${entry.lines_removed}, ` +
      `${entry.review_rounds} review round(s)`,
  );
}

function readEntries() {
  if (!fs.existsSync(LOG)) return [];
  return fs
    .readFileSync(LOG, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function fmt(value, suffix = "") {
  if (value === null || value === undefined) return "-";
  return `${value}${suffix}`;
}

function report(flags) {
  const all = readEntries();
  if (!all.length) {
    console.log("[metrics] no entries yet. Start one with: metrics.mjs start --lane fast");
    return;
  }
  const limit = flags.last ? number(flags.last, all.length) : all.length;
  const rows = all.slice(-limit);
  const lanes = ["fast", "full"];

  console.log(`| Lane | Tasks | Median min | Median files | Median LOC | Median tokens | Review rounds > 0 | Escalated |`);
  console.log(`| --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const lane of lanes) {
    const group = rows.filter((e) => e.lane === lane);
    if (!group.length) continue;
    const loc = group.map((e) => number(e.lines_added) + number(e.lines_removed));
    const reviews = group.filter((e) => number(e.review_rounds) > 0).length;
    const escalated = group.filter((e) => e.trigger).length;
    console.log(
      `| ${lane} | ${group.length} | ${fmt(median(group.map((e) => e.duration_min)))} | ` +
        `${fmt(median(group.map((e) => number(e.files_changed))))} | ` +
        `${fmt(median(loc))} | ${fmt(median(group.map((e) => (e.tokens == null ? null : number(e.tokens)))))} | ` +
        `${Math.round((reviews / group.length) * 100)}% | ${escalated} |`,
    );
  }
  const outcomes = rows.reduce((acc, e) => {
    acc[e.outcome] = (acc[e.outcome] || 0) + 1;
    return acc;
  }, {});
  console.log(`\nOutcomes: ${Object.entries(outcomes).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  console.log(`Entries: ${all.length} total, ${rows.length} shown (${LOG})`);
}

const { command, flags } = parseArgs(process.argv.slice(2));
try {
  if (command === "start") start(flags);
  else if (command === "end") end(flags);
  else if (command === "report") report(flags);
  else {
    console.error(`[metrics] unknown command: ${command}`);
    console.error("usage: metrics.mjs <start|end|report> [--flags]");
    process.exit(1);
  }
} catch (error) {
  console.error(`[metrics] ${error.message}`);
  process.exit(command === "end" ? 0 : 1);
}
