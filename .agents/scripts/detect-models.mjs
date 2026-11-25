#!/usr/bin/env node
/**
 * detect-models — best-effort discovery of which models each harness exposes,
 * then a proposed model assignment per subagent role.
 *
 * What this can and cannot do (read before trusting the output):
 *
 *   CAN  : read local config files and env vars, and report the models a harness
 *          has *declared*.
 *   CANNOT: verify entitlement. A model can be listed in config and still be
 *          unavailable to the account. Detection is therefore reported with a
 *          confidence level, and the skill that calls this MUST ask the user to
 *          confirm before anything is written.
 *
 * Usage:
 *   node .agents/scripts/detect-models.mjs                 # human report
 *   node .agents/scripts/detect-models.mjs --json          # machine output
 *   node .agents/scripts/detect-models.mjs --models "opus,sonnet,haiku"
 *   node .agents/scripts/detect-models.mjs --harness claude-code
 *   node .agents/scripts/detect-models.mjs --write         # save profiles.json
 *   node .agents/scripts/detect-models.mjs --target <dir>
 *
 * Exit codes: 0 = proposals produced, 2 = nothing detectable (user input needed).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const HOME = os.homedir();
const args = process.argv.slice(2);
const opt = { json: false, models: null, harness: null, write: false, target: process.cwd() };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--json") opt.json = true;
  else if (a === "--models") opt.models = args[++i];
  else if (a === "--harness") opt.harness = args[++i];
  else if (a === "--write") opt.write = true;
  else if (a === "--target") opt.target = path.resolve(args[++i]);
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
    process.exit(0);
  }
}

const capsPath = path.join(opt.target, ".agents", "models", "capabilities.json");
if (!fs.existsSync(capsPath)) {
  console.error(`error: ${capsPath} not found — run from a UAW project root`);
  process.exit(1);
}
const caps = JSON.parse(fs.readFileSync(capsPath, "utf8"));

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
};

const firstExisting = (list) => list.find((p) => fs.existsSync(p)) || null;

function classify(id) {
  const low = String(id).toLowerCase();
  // Declared ≠ suitable. A 2B local model is in the config because someone
  // experimented with it, not because it can drive a tool-calling agent. Sizes are
  // split so these never win an automatic proposal.
  const size = low.match(/(\d+(?:\.\d+)?)b\b/);
  if (size) {
    const b = parseFloat(size[1]);
    if (b < 8) return "tiny";
    if (b < 30) return "fast";
  }
  for (const k of caps.knownModels) if (low.includes(k.match.toLowerCase())) return k.class;
  for (const [cls, hints] of Object.entries(caps.heuristics)) {
    if (cls.startsWith("_")) continue;
    if (hints.some((h) => low.includes(h))) return cls;
  }
  return "unknown";
}

const CONF_RANK = { config: 3, env: 2, documented: 2, alias: 1, manual: 3, unverified: 0 };

function model(id, confidence, source) {
  return { id: String(id).trim(), class: classify(id), confidence, source };
}

function dedupe(models) {
  const seen = new Map();
  for (const m of models) {
    if (!m.id) continue;
    const prev = seen.get(m.id.toLowerCase());
    if (!prev || CONF_RANK[m.confidence] > CONF_RANK[prev.confidence]) {
      seen.set(m.id.toLowerCase(), m);
    }
  }
  return [...seen.values()].sort(
    (a, b) => CONF_RANK[b.confidence] - CONF_RANK[a.confidence] || a.id.localeCompare(b.id),
  );
}

// ---------------------------------------------------------------------------
// detectors
// ---------------------------------------------------------------------------

function detectClaudeCode() {
  const cfgPath = firstExisting([
    path.join(HOME, ".claude", "settings.json"),
    path.join(HOME, ".claude.json"),
    path.join(HOME, ".config", "claude", "settings.json"),
  ]);
  const models = [];
  const notes = [];

  if (cfgPath) {
    const cfg = readJson(cfgPath) || {};
    const declared = [cfg.model, cfg.env?.ANTHROPIC_MODEL, cfg.env?.ANTHROPIC_DEFAULT_SONNET_MODEL]
      .filter(Boolean)
      .flatMap((v) => String(v).split(/[,\s]+/));
    for (const d of declared) models.push(model(d, "config", path.basename(cfgPath)));
  }
  for (const key of ["ANTHROPIC_MODEL", "CLAUDE_CODE_MODEL"]) {
    if (process.env[key]) models.push(model(process.env[key], "env", key));
  }
  // Documented CLI aliases. They resolve on a valid subscription but we cannot
  // prove entitlement — hence "alias", the lowest usable confidence.
  for (const alias of ["opus", "sonnet", "haiku"]) {
    models.push(model(alias, "alias", "documented CLI alias"));
  }
  if (!cfgPath) notes.push("Không thấy ~/.claude/settings.json — chỉ suy ra từ alias.");

  return {
    id: "claude-code",
    label: "Claude Code",
    present: Boolean(cfgPath) || Boolean(process.env.ANTHROPIC_API_KEY) || fs.existsSync(path.join(opt.target, ".claude")),
    evidence: cfgPath || (process.env.ANTHROPIC_API_KEY ? "env ANTHROPIC_API_KEY" : null),
    models: dedupe(models),
    notes,
  };
}

function detectAntigravity() {
  const geminiDir = path.join(HOME, ".gemini");
  const cfgPath = firstExisting([
    path.join(geminiDir, "settings.json"),
    path.join(geminiDir, "config", "settings.json"),
    path.join(geminiDir, "config.json"),
  ]);
  const models = [];
  const notes = [];

  if (cfgPath) {
    // Only read values that sit under a model-ish key. Harvesting every string in
    // the config picks up things like "gemini-api-key" — a credential name, not a
    // model — and then proposes it as an assignment.
    const cfg = readJson(cfgPath) || {};
    const harvest = (node, keyHint) => {
      if (Array.isArray(node)) return node.forEach((v) => harvest(v, keyHint));
      if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) harvest(v, k);
        return;
      }
      if (typeof node !== "string") return;
      if (!/model/i.test(keyHint || "")) return;
      if (!/^[\w.:-]{3,60}$/.test(node)) return;
      if (/key|token|url|path|secret|endpoint/i.test(node)) return;
      models.push(model(node, "config", path.basename(cfgPath)));
    };
    harvest(cfg, "");
  }
  if (process.env.GEMINI_MODEL) models.push(model(process.env.GEMINI_MODEL, "env", "GEMINI_MODEL"));
  if (models.length === 0) {
    notes.push("Không đọc được danh sách model từ cấu hình Antigravity/Gemini.");
  }

  return {
    id: "antigravity",
    label: "Antigravity / Gemini CLI",
    present: fs.existsSync(geminiDir),
    evidence: cfgPath || (fs.existsSync(geminiDir) ? "~/.gemini/" : null),
    models: dedupe(models),
    notes,
  };
}

function detectWorkbuddy() {
  const dir = path.join(HOME, ".workbuddy-ai");
  const present = fs.existsSync(dir);
  // Routing values are part of the documented Agent tool contract, so they are
  // safe to propose even without reading a config file.
  const models = ["reasoning", "default", "lite"].map((id) => model(id, "documented", "Agent tool routing"));
  return {
    id: "workbuddy",
    label: "WorkBuddy",
    present,
    evidence: present ? "~/.workbuddy-ai/" : null,
    models: dedupe(models),
    notes: ["Routing value (reasoning/default/lite) do harness resolve sang model thật."],
  };
}

function detectGuiOnly(id, label, markers) {
  const hit = markers.find((m) => fs.existsSync(path.join(opt.target, m)));
  return {
    id,
    label,
    present: Boolean(hit),
    evidence: hit || null,
    models: [],
    notes: [
      "Chọn model trong GUI; không có file cấu hình đọc được từ CLI.",
      "Cần người dùng cung cấp danh sách model thực tế.",
    ],
    restricted: true,
  };
}

// ---------------------------------------------------------------------------
// detection run
// ---------------------------------------------------------------------------

let harnesses = [
  detectClaudeCode(),
  detectAntigravity(),
  detectWorkbuddy(),
  detectGuiOnly("cursor", "Cursor", [".cursor", ".cursorrules"]),
  detectGuiOnly("windsurf", "Windsurf", [".windsurf", ".windsurfrules"]),
  detectGuiOnly("copilot", "GitHub Copilot", [".github/copilot-instructions.md"]),
];

if (opt.harness) harnesses = harnesses.filter((h) => h.id === opt.harness);

// Manual override: the escape hatch for restricted or undetectable access.
if (opt.models) {
  const manual = opt.models
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => model(id, "manual", "--models"));
  const primary =
    harnesses.find((h) => h.id === opt.harness) ||
    harnesses.find((h) => h.present) ||
    harnesses[0];
  primary.models = dedupe([...manual, ...primary.models]);
  primary.notes.push("Danh sách do người dùng cung cấp qua --models.");
}

for (const h of harnesses) {
  if (h.restricted === undefined) h.restricted = h.models.length === 0;
}

// ---------------------------------------------------------------------------
// proposal
// ---------------------------------------------------------------------------

// Tier is the role's intent; class is what a model can do. They are not the same
// vocabulary — "standard" work is served by a "balanced" model.
const TIER_CLASS = { reasoning: "reasoning", standard: "balanced", fast: "fast" };
const TIER_FALLBACK = {
  reasoning: ["reasoning", "balanced", "fast", "unknown"],
  standard: ["balanced", "reasoning", "fast", "unknown"],
  fast: ["fast", "balanced", "reasoning", "unknown"],
};

function proposeFor(harness) {
  const out = [];
  // `tiny` models are detected and reported, but never auto-assigned: they cannot
  // reliably drive a multi-step tool-calling agent. The user can still force one
  // by declaring it explicitly in an agent's frontmatter.
  const usable = harness.models.filter((m) => m.class !== "tiny");
  if (usable.length === 0) return out;
  for (const [agent, meta] of Object.entries(caps.roles)) {
    const expected = TIER_CLASS[meta.tier];
    let chosen = null;
    let usedClass = null;
    for (const cls of TIER_FALLBACK[meta.tier]) {
      const hit = usable.find((m) => m.class === cls);
      if (hit) {
        chosen = hit;
        usedClass = cls;
        break;
      }
    }
    if (!chosen) continue;
    const degraded = usedClass !== expected;
    const modelNote =
      caps.knownModels.find((k) => chosen.id.toLowerCase().includes(k.match.toLowerCase()))?.notes || "";
    out.push({
      harness: harness.id,
      agent,
      role: meta.role,
      tier: meta.tier,
      model: chosen.id,
      modelClass: usedClass,
      confidence: chosen.confidence,
      degraded,
      why: degraded
        ? `${meta.why} Không có model nhóm ${expected} → tạm dùng ${usedClass} (\`${chosen.id}\`).`
        : `${meta.why}${modelNote ? " " + modelNote : ""}`,
    });
  }
  return out;
}

const proposals = harnesses.flatMap(proposeFor);
const warnings = [];
for (const h of harnesses) {
  if (h.present && h.models.length === 0) {
    warnings.push(`${h.label}: có mặt nhưng không đọc được model nào → cần người dùng nhập tay.`);
  }
  const tiny = h.models.filter((m) => m.class === "tiny");
  if (tiny.length) {
    warnings.push(
      `${h.label}: phát hiện model rất nhỏ (${tiny.map((m) => m.id).join(", ")}) — không đề xuất cho agent nào vì không đủ khả năng tool-calling nhiều bước.`,
    );
  }
  if (!h.present) warnings.push(`${h.label}: không phát hiện trong project này.`);
}

const result = {
  generatedAt: new Date().toISOString(),
  projectRoot: opt.target,
  capabilitiesVerifiedAt: caps.verifiedAt,
  harnesses: harnesses.map(({ id, label, present, evidence, models, notes, restricted }) => ({
    id, label, present, evidence, restricted, notes,
    models: models.map(({ id: mid, class: cls, confidence, source }) => ({ id: mid, class: cls, confidence, source })),
  })),
  proposals,
  warnings,
};

// ---------------------------------------------------------------------------
// output
// ---------------------------------------------------------------------------

if (opt.write) {
  const profiles = { version: 1, verifiedAt: new Date().toISOString().slice(0, 10), harnesses: {} };
  for (const p of proposals) {
    const h = (profiles.harnesses[p.harness] ||= { reasoning: [], standard: [], fast: [] });
    if (!h[p.tier].includes(p.model)) h[p.tier].push(p.model);
  }
  const dest = path.join(opt.target, ".agents", "models", "profiles.json");
  fs.writeFileSync(dest, JSON.stringify(profiles, null, 2) + "\n", "utf8");
  if (!opt.json) console.log(`\nĐã ghi ${path.relative(opt.target, dest)}`);
}

if (opt.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`\n# Đề xuất model cho subagent`);
  console.log(`\nPhát hiện lúc: ${result.generatedAt}`);
  console.log(`Bảng năng lực: verified ${caps.verifiedAt}\n`);

  const withModels = harnesses.filter((h) => h.models.length > 0);
  if (withModels.length === 0) {
    console.log("## Không phát hiện model nào\n");
    console.log("Không harness nào cho biết danh sách model. Cách xử lý:");
    console.log("  1. Chạy lại với danh sách bạn biết chắc là dùng được:");
    console.log('     node .agents/scripts/detect-models.mjs --models "opus,sonnet,haiku"');
    console.log("  2. Hoặc mở GUI của harness, xem dropdown model, rồi nhập tay.");
    console.log("  3. Không có model nào → giữ `model: inherit` cho toàn bộ agent (mặc định an toàn).\n");
  }

  for (const h of withModels) {
    console.log(`## ${h.label}\n`);
    console.log("| Agent | Vai trò | Tier | Model | Vì sao |");
    console.log("| --- | --- | --- | --- | --- |");
    for (const p of proposals.filter((x) => x.harness === h.id)) {
      const mark = p.degraded ? "⚠ " : "";
      console.log(`| \`${p.agent}\` | ${p.role} | ${p.tier} | ${mark}\`${p.model}\` | ${p.why} |`);
    }
    console.log("");
    if (h.notes.length) for (const n of h.notes) console.log(`> ${n}`);
    console.log("");
  }

  if (warnings.length) {
    console.log("## Cần bạn xác nhận\n");
    for (const w of warnings) console.log(`- ${w}`);
    console.log("");
  }

  console.log("## Bước tiếp theo\n");
  console.log("1. Xem lại bảng trên; sửa chỗ nào bạn biết là sai.");
  console.log("2. Xác nhận với tôi trước khi áp dụng — chưa có gì được ghi.");
  console.log("3. Sau khi xác nhận: `node .agents/scripts/detect-models.mjs --write`");
  console.log("4. Rồi: `node .agents/scripts/sync-harnesses.mjs` để sinh adapter.\n");
}

process.exit(proposals.length === 0 ? 2 : 0);
