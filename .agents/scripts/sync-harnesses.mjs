#!/usr/bin/env node
/**
 * sync-harnesses — generate per-harness adapter files from ONE source.
 *
 * Model: hub and spoke.
 *   Hub   : AGENTS.md + .agents/ (skills, agents, rules, docs)
 *   Spoke : a thin pointer file per harness, plus a fan-out of skills into the
 *           directory that harness actually scans.
 *
 * Why not copy content into every spoke: duplicated instructions drift, and a
 * model follows whichever copy it read last. Spokes stay 3-6 lines and point at
 * the hub.
 *
 * Usage:
 *   node .agents/scripts/sync-harnesses.mjs [options]
 *
 * Options:
 *   --target <dir>        project to write into (default: cwd)
 *   --harnesses <list>    comma list: claude,cursor,windsurf,copilot,gemini,workbuddy
 *                         (default: all). "antigravity" needs no files — it reads
 *                         AGENTS.md and .agents/ natively.
 *   --mode <link|copy>    how skills are exposed (default: link, falls back to copy)
 *   --dry-run             print planned actions, write nothing
 *   --clean               remove everything previously generated (uses manifest)
 *   --quiet               only errors
 *
 * Safety: only verified last-written outputs are overwritten or removed.
 * Markers and legacy path lists do not establish ownership.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ownership from "./derived-state.cjs";

const MARKER_TOKEN = "universal-agents-workflow sync-harnesses";
const MARKER = `<!-- ${MARKER_TOKEN} — do not edit -->`;
const MARKER_TOML = `# ${MARKER_TOKEN} — do not edit`;
const MANIFEST_REL = ".agents/harness-manifest.json";

const args = process.argv.slice(2);
const opt = {
  target: process.cwd(),
  harnesses: null,
  mode: "link",
  dryRun: false,
  clean: false,
  quiet: false,
};

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--target") opt.target = path.resolve(args[++i]);
  else if (a === "--harnesses") opt.harnesses = args[++i].split(",").map((s) => s.trim());
  else if (a === "--mode") opt.mode = args[++i];
  else if (a === "--dry-run") opt.dryRun = true;
  else if (a === "--clean") opt.clean = true;
  else if (a === "--quiet") opt.quiet = true;
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
    process.exit(0);
  }
}

const ALL = ["claude", "cursor", "windsurf", "copilot", "gemini", "workbuddy"];
let selected = opt.harnesses ?? ALL;
const log = (...m) => (opt.quiet ? null : console.log(...m));
const warn = (...m) => console.warn(...m);

const created = [];
const skipped = [];

let state;
const pending = [];
const allowed = rel => /^(CLAUDE\.md|GEMINI\.md|\.cursorrules|\.windsurfrules|\.github\/copilot-instructions\.md|\.workbuddy-ai\/harness-note\.md)$/.test(rel)
  || [".claude/skills/", ".claude/agents/", ".claude/commands/", ".cursor/rules/", ".cursor/commands/",
    ".windsurf/rules/", ".windsurf/workflows/", ".github/prompts/", ".gemini/commands/", ".workbuddy-ai/skills/"].some(prefix => rel.startsWith(prefix));
function abs(rel) { return ownership.resolve(opt.target, rel, false); }
function writeGenerated(rel, content, source = "AGENTS.md") {
  if (!allowed(rel)) throw new Error(`Invalid adapter path: ${rel}`);
  abs(rel);
  const prior = pending.find(task => task.rel === rel);
  if (prior) {
    if (prior.source !== source || String(prior.content) !== String(content)) throw new Error(`Conflicting adapter outputs: ${rel}`);
    return true;
  }
  pending.push({rel,content,source});
  return true;
}
function copyFiles(rel, source) {
  const src = ownership.resolve(opt.target, source);
  if (fs.statSync(src).isDirectory()) {
    for (const name of fs.readdirSync(src)) copyFiles(`${rel}/${name}`, `${source}/${name}`);
    return;
  }
  writeGenerated(rel, fs.readFileSync(src), source);
}
function linkOrCopy(rel, source) {
  ownership.resolve(opt.target,source);
  abs(rel);
  const previous = state.outputs[rel];
  const copying = opt.mode === "copy" || Object.keys(state.outputs).some(file => file.startsWith(`${rel}/`));
  if (copying) {
    if (ownership.exists(abs(rel)) && !fs.lstatSync(abs(rel)).isDirectory()) {
      skipped.push(`${rel} (conflict: expected directory)`);
      return;
    }
    copyFiles(rel,source);
  } else {
    pending.push({rel,source,linkTarget:path.relative(path.dirname(abs(rel)),abs(source)), previous});
  }
}
function execute() {
  for (const task of pending) {
    const {rel,content,source,linkTarget} = task;
    if (content !== undefined) {
      if (!ownership.write(opt.target,rel,content,source,state,opt.dryRun)) {
        skipped.push(`${rel} (conflict: edited or unverified)`);
        continue;
      }
    } else {
      const dest = abs(rel);
      if (ownership.exists(dest) && (!ownership.matches(opt.target,rel,state.outputs[rel]) || state.outputs[rel]?.source !== source)) {
        skipped.push(`${rel} (conflict: edited or unverified link)`);
        continue;
      }
      if (!opt.dryRun) {
        fs.mkdirSync(path.dirname(dest),{recursive:true});
        if (ownership.exists(dest)) fs.unlinkSync(dest);
        try { fs.symlinkSync(linkTarget,dest,"dir"); }
        catch (error) {
          if (!["EPERM","EACCES","ENOTSUP"].includes(error.code)) throw error;
          copyFiles(rel,source);
          continue;
        }
        state.outputs = {...state.outputs,[rel]:{kind:"symlink",source,linkTarget}};
      }
    }
    created.push(rel);
    if (!opt.dryRun) ownership.store(opt.target,MANIFEST_REL,state);
  }
}

/** Pointer body shared by every harness that reads a root instruction file. */
function pointerBody({ title, tool, extra = "" }) {
  return `${MARKER}
# ${title}

This project is governed by the **Universal Agent Development Workflow**.
The single source of truth is [\`AGENTS.md\`](AGENTS.md) — read it before acting.

${extra}## Where the rest lives (read on demand, never preload)

| Need | Path |
| --- | --- |
| Non-negotiables, pipeline, gates | \`AGENTS.md\` |
| Step detail for the phase you are in | \`.agents/docs/pipeline-detail.md\` |
| Skill catalog (pick one, then open it) | \`.agents/SKILLS.md\` |
| "Which skill do I need?" | \`.agents/docs/failure-modes.md\` |
| Large file → which section | \`.agents/docs/reading-map.md\` |
| Skills | \`.agents/skills/\` (hot) + \`.agents/skill-library/\` (cold) |
| Subagent personas | \`.agents/agents/\` |
| Shared language / decisions | \`CONTEXT.md\`, \`adr/\` |

Do not duplicate rules from \`AGENTS.md\` into this file. If you need a rule that
is not there, add it to \`AGENTS.md\` so every ${tool} sees it too.
`;
}

// ---------------------------------------------------------------------------
// Per-harness adapters
// ---------------------------------------------------------------------------

const adapters = {
  claude() {
    // Claude Code reads CLAUDE.md and resolves @path imports.
    writeGenerated(
      "CLAUDE.md",
      `${MARKER}
# CLAUDE.md

@AGENTS.md

Behavioural deltas that are specific to Claude-family models live in
\`GEMINI.md\`-style delta docs only when they differ; the pipeline, gates, Fast/Full
lanes and delegation contract are all in \`AGENTS.md\` — read that first.

Subagents: \`.claude/agents/\` (generated from \`.agents/agents/\`).
Skills: \`.claude/skills/\` (hot set, linked to \`.agents/skills/\`). The cold
library stays at \`.agents/skill-library/\` — pick from \`.agents/SKILLS.md\` and
read the file directly.
`,
    );
    fanOutSkills(".claude/skills");
    convertAgents(".claude/agents", "claude-code");
    fanOutCommands("claude");
  },

  cursor() {
    // Cursor: .cursor/rules/*.mdc (alwaysApply) + legacy .cursorrules
    writeGenerated(
      ".cursor/rules/00-uaw.mdc",
      `---
description: Universal Agent Development Workflow — entry point
alwaysApply: true
---
${MARKER}

Read \`AGENTS.md\` at the repository root before acting. It holds the
non-negotiables, the 7-step pipeline, the Fast/Full lanes and the gates.

On-demand references: \`.agents/docs/pipeline-detail.md\` (step detail),
\`.agents/docs/skill-matrix.md\` (skill lookup), \`.agents/docs/failure-modes.md\`
(symptom index), \`.agents/docs/reading-map.md\` (which section of a large file).

Do not restate these rules here — edit \`AGENTS.md\` instead.
`,
    );
    writeGenerated(
      ".cursorrules",
      `${MARKER}
# Cursor rules (legacy path — kept for older Cursor builds)

Single source of truth: AGENTS.md
On-demand: .agents/docs/{pipeline-detail,skill-matrix,failure-modes,reading-map}.md
`,
    );
    fanOutCommands("cursor");
  },

  windsurf() {
    writeGenerated(
      ".windsurf/rules/uaw.md",
      `---
trigger: always_on
description: Universal Agent Development Workflow — entry point
---
${MARKER}

Read \`AGENTS.md\` at the repository root before acting.

On-demand: \`.agents/docs/pipeline-detail.md\`, \`.agents/docs/skill-matrix.md\`,
\`.agents/docs/failure-modes.md\`, \`.agents/docs/reading-map.md\`.

Do not restate these rules here — edit \`AGENTS.md\` instead.
`,
    );
    writeGenerated(
      ".windsurfrules",
      `${MARKER}
# Windsurf rules (legacy path — kept for older Windsurf builds)

Single source of truth: AGENTS.md
On-demand: .agents/docs/{pipeline-detail,skill-matrix,failure-modes,reading-map}.md
`,
    );
    fanOutCommands("windsurf");
  },

  copilot() {
    writeGenerated(
      ".github/copilot-instructions.md",
      `${MARKER}
# GitHub Copilot instructions

Follow [\`AGENTS.md\`](../AGENTS.md) — it is the single source of truth for the
pipeline, gates, Fast/Full lanes and code standards.

On-demand references: [\`pipeline-detail.md\`](../.agents/docs/pipeline-detail.md),
[\`skill-matrix.md\`](../.agents/docs/skill-matrix.md),
[\`failure-modes.md\`](../.agents/docs/failure-modes.md).

Do not add rules here that are missing from \`AGENTS.md\`; add them there.
`,
    );
    fanOutCommands("copilot");
  },

  gemini() {
    // Commands first: the GEMINI.md branch below may bail out early on a
    // hand-written file, and skipping command generation because of that would be
    // a silent hole.
    fanOutCommands("gemini");
    // Gemini CLI and Antigravity read GEMINI.md. Keep model-specific deltas only.
    writeGenerated(
      "GEMINI.md",
      `${MARKER}
# GEMINI.md

Pipeline, gates and delegation: see [\`AGENTS.md\`](AGENTS.md).

Gemini-specific deltas are intentionally absent — the framework does not fork
behaviour per model family. If a real delta is needed, add it here and say which
model it applies to; never restate the pipeline.
`,
    );
  },

  workbuddy() {
    // WorkBuddy reads AGENTS.md as project guidance and scans a skills dir.
    fanOutSkills(".workbuddy-ai/skills");
    writeGenerated(
      ".workbuddy-ai/harness-note.md",
      `${MARKER}
# WorkBuddy

Project guidance is \`AGENTS.md\` (auto-injected). Skills are exposed through
\`.workbuddy-ai/skills/\`, which links to \`.agents/skills/\` (hot set only).
The cold library at \`.agents/skill-library/\` is read by path from
\`.agents/SKILLS.md\`.

Commands come from the skills themselves: \`/command-git-push\`,
\`/command-skill-setup\`, \`/setup-subagents\`, … — the skill directory name is the
command name. **Aliases are not created here** (\`/push\`, \`/ship\`); use the full
skill name. Antigravity works the same way since it retired \`.agents/workflows\`.

Install framework files with \`install.sh\` or \`install.ps1\`. Read skills and
artifacts locally; validation uses the \`spec-validator\` skill from
\`.agents/SKILLS.md\`.
`,
    );
  },
};

// ---------------------------------------------------------------------------
// Fan-out helpers
// ---------------------------------------------------------------------------

function listSkills() {
  const root = abs(".agents/skills");
  if (!fs.existsSync(root)) return [];
  const out = [];
  for (const group of fs.readdirSync(root)) {
    const groupDir = ownership.resolve(opt.target, `.agents/skills/${group}`);
    if (!fs.statSync(groupDir).isDirectory()) continue;
    for (const name of fs.readdirSync(groupDir)) {
      const dir = ownership.resolve(opt.target, `.agents/skills/${group}/${name}`);
      if (!fs.statSync(dir).isDirectory()) continue;
      if (!fs.existsSync(path.resolve(dir, "SKILL.md"))) continue;
      out.push({ name, rel: path.posix.join(".agents", "skills", group, name) });
    }
  }
  return out;
}

function fanOutSkills(destDir) {
  const skills = listSkills();
  if (skills.length === 0) {
    warn("  no skills found under .agents/skills — skipping fan-out");
    return;
  }
  log(`  skills → ${destDir} (${skills.length})`);
  for (const s of skills) {
    linkOrCopy(path.posix.join(destDir, s.name), s.rel);
  }
}

// ---------------------------------------------------------------------------
// Command surface
//
// A skill with `invocation: user` is not automatically a slash command: the
// harness has to find a file in *its* command directory. These wrappers are
// 5 lines each and point back at the skill, so there is still one source.
//
// Harness notes (verified 2026-11):
//   Antigravity — dropped `.agents/workflows/*.md` in Oct 2026; Agent Skills are
//                 now the command surface. Nothing to generate: the skill
//                 fan-out already exposes `/skill-name`.
//   WorkBuddy   — same model; `/skill-name` comes from the skills dir.
//   Claude Code — `.claude/commands/*.md`
//   Cursor      — `.cursor/commands/*.md`
//   Windsurf    — `.windsurf/workflows/*.md`
//   Copilot     — `.github/prompts/*.prompt.md`
//   Gemini CLI  — `.gemini/commands/*.toml`
// ---------------------------------------------------------------------------

const COMMAND_SURFACES = {
  claude: { dir: ".claude/commands", suffix: ".md", kind: "md", args: "$ARGUMENTS" },
  cursor: { dir: ".cursor/commands", suffix: ".md", kind: "md", args: "" },
  windsurf: { dir: ".windsurf/workflows", suffix: ".md", kind: "workflow", args: "" },
  copilot: { dir: ".github/prompts", suffix: ".prompt.md", kind: "prompt", args: "" },
  gemini: { dir: ".gemini/commands", suffix: ".toml", kind: "toml", args: "{{args}}" },
};

/** Minimal frontmatter reader for the fields commands need. */
function readSkillMeta(file) {
  let raw = "";
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = m[1];
  const name = (fm.match(/^name:[ \t]*["']?([^"'\n]+?)["']?[ \t]*$/m) || [, ""])[1].trim();

  // description may be inline, or a >- / | block.
  // `[ \t]` not `\s`: `\s*` also matches newlines, so it backtracks to zero and
  // lets the next class swallow the newline — which is how ">-" ends up captured
  // as the description.
  let description = "";
  const inline = fm.match(/^description:[ \t]+([^>|\s].*)$/m);
  if (inline) description = inline[1].trim().replace(/^["']|["']$/g, "");
  else {
    const block = fm.match(/^description:[ \t]*[>|][-+]?[ \t]*\n((?:[ \t]+.+\n)+)/m);
    if (block) description = block[1].split("\n").map((l) => l.trim()).filter(Boolean)[0] || "";
  }

  // triggers: a YAML list of quoted strings.
  const triggers = [];
  const tBlock = fm.match(/^triggers:[ \t]*\n((?:[ \t]*-[ \t]*.+\n?)+)/m);
  if (tBlock) {
    for (const line of tBlock[1].split("\n")) {
      const v = line.replace(/^[ \t]*-[ \t]*/, "").trim().replace(/^["']|["']$/g, "");
      if (v) triggers.push(v);
    }
  }
  return { name, description, triggers };
}

function listCommands() {
  const out = [];
  for (const s of listSkills()) {
    const meta = readSkillMeta(abs(path.posix.join(s.rel, "SKILL.md")));
    if (!meta) continue;
    const names = meta.triggers.filter((t) => t.startsWith("/")).map((t) => t.slice(1).trim());
    if (names.length === 0) continue;
    out.push({
      skill: s.rel,
      name: meta.name || s.name,
      description: meta.description || `${meta.name || s.name} command`,
      names,
    });
  }
  return out;
}

function commandBody(kind, c, argsPlaceholder) {
  const pointer = `Read \`.agents/${c.skill.split(".agents/").pop()}/SKILL.md\` and follow it exactly.`;
  const argLine = argsPlaceholder ? `User arguments: ${argsPlaceholder}` : "Apply any user-provided arguments to its inputs.";
  if (kind === "toml") {
    const esc = (x) => x.replace(/"""/g, '\\"\\"\\"');
    return `${MARKER_TOML}
description = "${esc(c.description)}"
prompt = """
${pointer}
${argLine}
Do not restate the skill here — the file above is the single source.
"""
`;
  }
  if (kind === "workflow") {
    return `---
description: ${c.description}
---
${MARKER}

1. ${pointer}
2. ${argLine}
3. Report what changed, with file paths.
`;
  }
  if (kind === "prompt") {
    return `---
mode: agent
description: ${c.description}
---
${MARKER}

${pointer}
${argLine}
`;
  }
  return `---
description: ${c.description}
---
${MARKER}

${pointer}
${argLine}
`;
}

function fanOutCommands(harnessKey) {
  const surface = COMMAND_SURFACES[harnessKey];
  if (!surface) return;
  const cmds = listCommands();
  if (cmds.length === 0) return;
  let count = 0;
  for (const c of cmds) {
    for (const alias of c.names) {
      const rel = path.posix.join(surface.dir, alias + surface.suffix);
      writeGenerated(rel, commandBody(surface.kind, c, surface.args), `${c.skill}/SKILL.md`);
      count++;
    }
  }
  log(`  commands → ${surface.dir} (${count})`);
}

/**
 * Model resolution: agent role → tier (capabilities.json) → concrete id
 * (profiles.json, written by setup-subagents after user confirmation).
 *
 * Both files are optional. Absent profiles.json means every agent keeps
 * `model: inherit`, which is the safe default — never a hard failure.
 */
function loadModelData() {
  const read = (rel) => {
    const p = abs(rel);
    try {
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
    } catch {
      return null;
    }
  };
  return {
    caps: read(path.posix.join(".agents", "models", "capabilities.json")),
    profiles: read(path.posix.join(".agents", "models", "profiles.json")),
  };
}

function resolveModel(harnessId, agentName, data) {
  const tier = data.caps?.roles?.[agentName]?.tier;
  if (!tier) return null;
  const list = data.profiles?.harnesses?.[harnessId]?.[tier];
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0];
}

/** Convert .agents/agents/*.md into a harness agent file with a minimal frontmatter. */
function convertAgents(destDir, harnessId) {
  const srcDir = abs(".agents/agents");
  if (!fs.existsSync(srcDir)) return;
  const data = loadModelData();
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".md"));
  log(`  agents → ${destDir} (${files.length})`);
  let resolved = 0;
  for (const file of files) {
    const raw = fs.readFileSync(ownership.resolve(opt.target, `.agents/agents/${file}`), "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) {
      skipped.push(`${destDir}/${file} (no frontmatter)`);
      continue;
    }
    const fm = m[1];
    const body = raw.slice(m[0].length);
    const name = (fm.match(/^name:\s*(.+)$/m) || [, path.basename(file, ".md")])[1].trim();
    const desc = (fm.match(/^description:\s*(.+)$/m) || [, `Subagent ${name}`])[1]
      .trim()
      .replace(/^["']|["']$/g, "");
    const tools = (fm.match(/^tools:\s*(.+)$/m) || [, ""])[1].trim();
    const declared = (fm.match(/^model:\s*(.+)$/m) || [, ""])[1].trim();

    // Precedence: explicit id in the source agent > resolved profile > inherit.
    // `inherit` is a framework concept, not a harness value, so it is omitted and
    // the harness uses the session default.
    let modelId = null;
    if (declared && declared !== "inherit") modelId = declared;
    else modelId = resolveModel(harnessId, name, data);
    if (modelId) resolved++;

    const lines = ["---", `name: ${name}`, `description: ${desc}`];
    if (tools) lines.push(`tools: ${tools}`);
    if (modelId) lines.push(`model: ${modelId}`);
    lines.push("---", "");
    lines.push(MARKER, "");
    writeGenerated(path.posix.join(destDir, file), lines.join("\n") + body, `.agents/agents/${file}`);
  }
  if (resolved > 0) log(`  models resolved: ${resolved}/${files.length} (rest inherit)`);
  else if (files.length) log(`  models: all inherit (no profiles.json entry for ${harnessId})`);
}

// ---------------------------------------------------------------------------
// Clean
// ---------------------------------------------------------------------------

function clean() {
  for (const [rel, record] of Object.entries(state.outputs)) {
    if (!ownership.exists(abs(rel))) continue;
    if (!ownership.matches(opt.target,rel,record)) {
      skipped.push(`${rel} (conflict: edited)`);
      continue;
    }
    if (!opt.dryRun) {
      fs.unlinkSync(abs(rel));
      const outputs = {...state.outputs};
      delete outputs[rel];
      state = {...state,outputs};
      ownership.store(opt.target,MANIFEST_REL,state);
    }
    created.push(rel);
  }
  for (const rel of state.generated || []) {
    if (!state.outputs[rel] && ownership.exists(abs(rel))) skipped.push(`${rel} (legacy unverified)`);
  }
}

function validateOutputParents() {
  const surfaces = {
    claude: [".claude/skills", ".claude/agents", ".claude/commands"],
    cursor: [".cursor/rules", ".cursor/commands"],
    windsurf: [".windsurf/rules", ".windsurf/workflows"],
    copilot: [".github/prompts"],
    gemini: [".gemini/commands"],
    workbuddy: [".workbuddy-ai/skills"],
  };
  for (const harness of selected) {
    for (const rel of surfaces[harness]) {
      const dir = ownership.resolve(opt.target,rel);
      if (ownership.exists(dir) && !fs.statSync(dir).isDirectory()) throw new Error(`Adapter output parent is not a directory: ${rel}`);
    }
  }
}

function main() {
  opt.target = fs.realpathSync(opt.target);

  state = ownership.load(opt.target,MANIFEST_REL,allowed,true);
  if (!args.includes("--mode") && state.mode) opt.mode = state.mode;
  if (!opt.harnesses && Array.isArray(state.harnesses)) selected = state.harnesses;
  if (!["copy","link"].includes(opt.mode)) throw new Error("Invalid adapter mode");
  if (selected.some(h => !ALL.includes(h))) throw new Error("Unknown harness");
  if (state.mode !== undefined && !["copy","link"].includes(state.mode)) throw new Error("Invalid recorded adapter mode");
  if (state.harnesses !== undefined && (!Array.isArray(state.harnesses) || state.harnesses.some(h => !ALL.includes(h)))) throw new Error("Invalid recorded harnesses");
  if (!opt.clean) validateOutputParents();
  if (args.includes("--validate-only")) return;
  if (!fs.existsSync(abs("AGENTS.md"))) throw new Error(`No AGENTS.md in ${opt.target}`);
  if (opt.clean) clean();
  else {
    for (const h of selected) adapters[h]();
    execute();
    if (!opt.dryRun) ownership.store(opt.target,MANIFEST_REL,{...state,mode:opt.mode,harnesses:selected});
  }
  for (const message of skipped) console.log(`Kept: ${message}`);
  ownership.summary("adapters",created.length,skipped.length);
}
try { main(); }
catch (error) { console.error(`sync-harnesses: ${error.message}`); ownership.summary("adapters",created.length,skipped.length,1); process.exitCode=1; }
