#!/usr/bin/env node
/**
 * Generates .agents/SKILLS.md — the single skill catalog (mục lục).
 *
 * Why this exists: every `SKILL.md` inside `.agents/skills/` is auto-discovered
 * by the harness and its name + description is injected into the system prompt
 * of every request and every subagent. Sixty-five of those cost ~7k tokens
 * before the model reads the user's first word. Moving the long tail to
 * `.agents/skill-library/` removes that cost, and this catalog replaces the
 * discovery that was lost: one table, read on demand, one skill opened at a time.
 *
 * The group map below is the only curation this file needs. If a skill is added
 * or moved, `--check` fails until the map is updated — the catalog cannot rot
 * silently.
 *
 * Usage:
 *   node .agents/scripts/build-skill-index.mjs           # write SKILLS.md
 *   node .agents/scripts/build-skill-index.mjs --check   # verify, no write
 */

"use strict";

import fs from "node:fs";
import path from "node:path";

const HOT_DIR = ".agents/skills";
const COLD_DIR = ".agents/skill-library";
const OUTPUT = ".agents/SKILLS.md";
const MAX_WHEN_CHARS = 120;

/**
 * Skills allowed to stay in the indexed tier. Everything else belongs in the
 * library. Used by `--prune` to clean up projects that were installed before
 * the two-tier split: their old copies still sit in `.agents/skills/` and would
 * be re-indexed on every request.
 */
const HOT_NAMES = new Set([
  "intake-classifier",
  "ponytail",
  "skills-index",
  "command-continue-project",
  "command-generate-backlog",
  "command-git-push",
  "command-skill-setup",
  "command-update",
  "command-user-guide",
]);

/** Cold skills, grouped by the phase where a developer reaches for them. */
const GROUPS = {
  "Intake & Business Analysis": [
    "elicitation-interview",
    "grilling",
    "to-questionnaire",
    "domain-modeling",
    "gap-analysis",
    "risk-contradiction-scanner",
    "spec-writer",
    "spec-validator",
    "handover",
    "wayfinder",
  ],
  "Spec, Plan & Tasks": [
    "speckit-specify",
    "speckit-plan",
    "speckit-tasks",
    "speckit-analyze",
    "speckit-clarify",
    "speckit-checklist",
    "speckit-constitution",
    "speckit-converge",
    "speckit-implement",
    "speckit-taskstoissues",
    "scaffold-architecture",
    "codebase-design",
    "setup-deep-modules",
    "improve-codebase-architecture",
  ],
  Implementation: [
    "implementation-orchestrator",
    "api-design",
    "diagnosing-bugs",
    "prototype",
    "e2e-testing",
    "git-workflow",
    "resolving-merge-conflicts",
    "wizard",
    "postgres-patterns",
    "docker-patterns",
  ],
  "Review, Docs & Delivery": [
    "ui-design-review",
    "technical-documentation",
    "user-guide-with-screenshots",
    "verification-before-completion",
  ],
  "UI & Design": [
    "frontend-design",
    "design-taste-frontend",
    "design-taste-product",
    "ui-taste-pro",
    "motion-design",
    "frontend-a11y",
    "archify",
  ],
  "Minimal code (ponytail)": [
    "ponytail-review",
    "ponytail-audit",
    "ponytail-debt",
    "ponytail-gain",
    "ponytail-help",
  ],
  "Productivity & meta": [
    "route",
    "wait-what",
    "handoff",
    "retro",
    "setup-workspace",
    "setup-subagents",
    "writing-for-agents",
  ],
};

/** Highest-value rows: symptom first, because that is how a model notices it needs one. */
const PICK_FAST = [
  ["New request, unclear size or scope", "intake-classifier"],
  ["Scope is vague, hidden design branches", "grilling"],
  ["Need AS-IS / TO-BE, RBAC, state machine, ERD", "domain-modeling"],
  ["Turn analysis into requirements.md", "spec-writer"],
  ["Requirements need an IEEE 29148 check", "spec-validator"],
  ["Turn a spec into plan + tasks", "speckit-plan"],
  ["Break a plan into ordered tasks", "speckit-tasks"],
  ["Implement a signed-off feature", "implementation-orchestrator"],
  ["Bug reproduced, root cause unknown", "diagnosing-bugs"],
  ["Over-engineered diff / bloated repo", "ponytail-review"],
  ["Need an architecture or sequence diagram", "archify"],
  ["Feature ships, needs docs + screenshots", "technical-documentation"],
  ["Unsure which skill or phase applies", "route"],
];

function parseFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  return match ? match[1] : "";
}

function readField(frontmatter, field) {
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`${field}:`));
  if (start === -1) return "";
  const collected = [lines[start].slice(field.length + 1)];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^[a-zA-Z_-]+:/.test(lines[i])) break;
    collected.push(lines[i]);
  }
  return collected
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[>|]-?\s*/, "")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
}

function firstSentence(description) {
  const sentence = description.split(/(?<=[.!?])\s/)[0] || description;
  if (sentence.length <= MAX_WHEN_CHARS) return sentence;
  return `${sentence.slice(0, MAX_WHEN_CHARS).replace(/\s+\S*$/, "")}…`;
}

function collectSkills(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const group of fs.readdirSync(dir).sort()) {
    const groupDir = path.join(dir, group);
    if (!fs.statSync(groupDir).isDirectory()) continue;
    for (const name of fs.readdirSync(groupDir).sort()) {
      const skillFile = path.join(groupDir, name, "SKILL.md");
      if (!fs.existsSync(skillFile)) continue;
      const frontmatter = parseFrontmatter(fs.readFileSync(skillFile, "utf8"));
      out.push({
        name,
        group,
        path: skillFile,
        description: readField(frontmatter, "description"),
        invocation: readField(frontmatter, "invocation"),
      });
    }
  }
  return out;
}

function escapeCell(value) {
  return value.replace(/\|/g, "\\|");
}

function render() {
  const hot = collectSkills(HOT_DIR);
  const cold = collectSkills(COLD_DIR);
  const coldByName = new Map(cold.map((skill) => [skill.name, skill]));
  const grouped = new Set(Object.values(GROUPS).flat());

  const errors = [];
  for (const skill of cold) {
    if (!grouped.has(skill.name)) errors.push(`unmapped cold skill: ${skill.name}`);
  }
  for (const name of grouped) {
    if (!coldByName.has(name)) errors.push(`group map points at a missing skill: ${name}`);
  }
  if (errors.length > 0) {
    console.error("Skill catalog is out of sync:");
    for (const error of errors) console.error(`  - ${error}`);
    console.error("\nUpdate GROUPS in .agents/scripts/build-skill-index.mjs.");
    process.exit(1);
  }

  const lines = [];
  lines.push("# Skill Catalog (mục lục)");
  lines.push("");
  lines.push("> Read this file when you need to pick a skill — it is **not** injected into");
  lines.push("> the system prompt. Then open exactly one `SKILL.md` from the path column.");
  lines.push("> Never load the whole library.");
  lines.push("");
  lines.push("| Tier | Location | Cost | Contents |");
  lines.push("| --- | --- | --- | --- |");
  lines.push(
    `| Hot | \`${HOT_DIR}/\` | name + description on every request | ${hot.length} entry points and slash commands |`,
  );
  lines.push(`| Cold | \`${COLD_DIR}/\` | zero until read | ${cold.length} on-demand skills |`);
  lines.push("");
  lines.push(
    `Regenerate with \`node .agents/scripts/build-skill-index.mjs\`; verify with \`--check\`.`,
  );
  lines.push("");

  lines.push("## Pick fast (symptom → skill)");
  lines.push("");
  lines.push("| Symptom | Skill |");
  lines.push("| --- | --- |");
  for (const [symptom, skill] of PICK_FAST) {
    lines.push(`| ${escapeCell(symptom)} | \`${skill}\` |`);
  }
  lines.push("");

  lines.push(`## Hot set — already in the system prompt (${hot.length})`);
  lines.push("");
  lines.push("| Skill | When | Path |");
  lines.push("| --- | --- | --- |");
  for (const skill of hot) {
    lines.push(
      `| \`${skill.name}\` | ${escapeCell(firstSentence(skill.description))} | \`${skill.path}\` |`,
    );
  }
  lines.push("");

  for (const [groupName, names] of Object.entries(GROUPS)) {
    lines.push(`## ${groupName} (${names.length})`);
    lines.push("");
    lines.push("| Skill | When | Path |");
    lines.push("| --- | --- | --- |");
    for (const name of names) {
      const skill = coldByName.get(name);
      lines.push(
        `| \`${name}\` | ${escapeCell(firstSentence(skill.description))} | \`${skill.path}\` |`,
      );
    }
    lines.push("");
  }

  lines.push("## How to use a cold skill");
  lines.push("");
  lines.push("1. Find the row that matches the situation (or the symptom in *Pick fast*).");
  lines.push("2. Read that one `SKILL.md` with the file-read tool.");
  lines.push("3. Follow it. Do not read sibling skills unless it explicitly points at one.");
  lines.push("4. A cold skill has no `skill` tool entry — the file read **is** the load.");
  lines.push("");

  return { content: lines.join("\n"), hot, cold };
}

function findStaleHotCopies() {
  const stale = [];
  if (!fs.existsSync(HOT_DIR) || !fs.existsSync(COLD_DIR)) return stale;

  // Match by name, not by group: a skill may have moved groups between
  // framework versions, and the duplicate is still a duplicate.
  const coldNames = new Set(collectSkills(COLD_DIR).map((skill) => skill.name));

  for (const group of fs.readdirSync(HOT_DIR)) {
    const groupDir = path.join(HOT_DIR, group);
    if (!fs.statSync(groupDir).isDirectory()) continue;
    for (const name of fs.readdirSync(groupDir)) {
      const dir = path.join(groupDir, name);
      if (!fs.statSync(dir).isDirectory()) continue;
      if (!fs.existsSync(path.join(dir, "SKILL.md"))) continue;
      if (HOT_NAMES.has(name)) continue;
      if (coldNames.has(name)) stale.push(dir);
    }
  }
  return stale;
}

function pruneStaleHotCopies(quiet) {
  const stale = findStaleHotCopies();
  for (const dir of stale) {
    fs.rmSync(dir, { recursive: true, force: true });
    if (!quiet) console.log(`  pruned duplicate hot copy: ${dir}`);
  }
  if (!quiet && stale.length > 0) {
    console.log(`Pruned ${stale.length} stale hot copies left by an older install.`);
  }
  return stale.length;
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const prune = process.argv.includes("--prune");
  const quiet = process.argv.includes("--quiet");

  if (prune) {
    const removed = pruneStaleHotCopies(quiet);
    if (removed === 0 && quiet) return;
  }

  const { content, hot, cold } = render();

  if (checkOnly) {
    if (!fs.existsSync(OUTPUT)) {
      console.error(`${OUTPUT} is missing. Run without --check to generate it.`);
      process.exit(1);
    }
    if (fs.readFileSync(OUTPUT, "utf8") !== content) {
      console.error(`${OUTPUT} is stale. Run without --check to regenerate.`);
      process.exit(1);
    }
    // The hot set is the only part that costs tokens on every request and every
    // subagent. Guard it so a new skill cannot quietly join the expensive tier.
    const hotChars = hot.reduce((sum, skill) => sum + skill.name.length + skill.description.length, 0);
    if (hot.length > 12 || hotChars > 2500) {
      console.error(
        `Hot set is too large: ${hot.length} skills, ${hotChars} chars. ` +
          "Move non-command skills to .agents/skill-library/ (limit: 12 skills, 2500 chars).",
      );
      process.exit(1);
    }
    if (!quiet) {
      console.log(`OK: ${OUTPUT} covers ${hot.length} hot + ${cold.length} cold skills.`);
    }
    const stale = findStaleHotCopies();
    if (stale.length > 0) {
      console.error(
        `${stale.length} skill(s) exist in both tiers and are being indexed twice. ` +
          "Run: node .agents/scripts/build-skill-index.mjs --prune",
      );
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(OUTPUT, content);
  if (!quiet) {
    console.log(`Wrote ${OUTPUT} (${hot.length} hot + ${cold.length} cold skills).`);
  }
}

main();
