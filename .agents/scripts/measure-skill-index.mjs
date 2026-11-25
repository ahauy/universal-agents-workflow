#!/usr/bin/env node
/**
 * Measures the token cost of the always-on skill index.
 *
 * Harnesses inject every `SKILL.md` frontmatter (name + description) into the
 * system prompt on every request. This script prints that cost per skill root,
 * so "did the catalog change actually save anything?" is answered with a number
 * instead of a feeling.
 *
 * Usage: node .agents/scripts/measure-skill-index.mjs [--root .]
 */

"use strict";

import fs from "node:fs";
import path from "node:path";

const CHARS_PER_TOKEN = 4;

function parseFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  return match ? match[1] : "";
}

/**
 * Reads a top-level YAML key, including folded (`>`) and literal (`|`) blocks.
 * A line-based scan is used because a lazy regex stops at the first newline and
 * silently reports a fraction of the real description.
 */
function readField(frontmatter, field) {
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`${field}:`));
  if (start === -1) return "";

  const collected = [lines[start].slice(field.length + 1)];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const isTopLevelKey = /^[a-zA-Z_-]+:/.test(line);
    if (isTopLevelKey) break;
    collected.push(line);
  }

  return collected
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[>|]-?\s*/, "")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
}

function walkSkillFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const group of fs.readdirSync(dir)) {
    const groupDir = path.join(dir, group);
    if (!fs.statSync(groupDir).isDirectory()) continue;
    for (const name of fs.readdirSync(groupDir)) {
      const skillFile = path.join(groupDir, name, "SKILL.md");
      if (fs.existsSync(skillFile)) out.push(skillFile);
    }
  }
  return out;
}

function measure(root, label) {
  const dir = path.join(root, label);
  const files = walkSkillFiles(dir);
  let descChars = 0;
  const rows = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const fm = parseFrontmatter(text);
    const name = readField(fm, "name") || path.basename(path.dirname(file));
    const desc = readField(fm, "description");
    descChars += name.length + desc.length;
    rows.push({ name, chars: desc.length });
  }
  rows.sort((a, b) => b.chars - a.chars);
  return { label, count: files.length, chars: descChars, rows };
}

const rootArg = process.argv.indexOf("--root");
const root = rootArg > -1 ? process.argv[rootArg + 1] : ".";

const hot = measure(root, ".agents/skills");
const cold = measure(root, ".agents/skill-library");

for (const r of [hot, cold]) {
  const tokens = Math.round(r.chars / CHARS_PER_TOKEN);
  console.log(`${r.label}: ${r.count} skills, ${r.chars} chars (~${tokens} tokens)`);
  for (const row of r.rows.slice(0, 5)) {
    console.log(`    ${String(row.chars).padStart(5)}  ${row.name}`);
  }
}

const hotTokens = Math.round(hot.chars / CHARS_PER_TOKEN);
const coldTokens = Math.round(cold.chars / CHARS_PER_TOKEN);
console.log(
  `\nALWAYS-ON (hot): ${hot.chars} chars (~${hotTokens} tokens) per request, per agent.`,
);
console.log(`ON DEMAND (cold): ${cold.chars} chars (~${coldTokens} tokens), paid only when a skill is read.`);
