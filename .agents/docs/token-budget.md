# Token Budget — what costs money before you type

Every harness injects some context on **every request** and on **every subagent**.
This page records what that costs here and how to keep it small. Numbers are
chars ÷ 4; measure your own tree with:

```bash
node .agents/scripts/measure-skill-index.mjs
```

## The two-tier skill model

| Tier | Path | Cost | Rule |
| --- | --- | --- | --- |
| Hot | `.agents/skills/` | name + description in every system prompt | only entry points and slash commands |
| Cold | `.agents/skill-library/` | zero until read | everything else |

`AGENTS.md` §3 states the rule; `.agents/SKILLS.md` is the catalog that replaces
auto-discovery for the cold tier. A cold skill has no `skill` tool entry —
reading its `SKILL.md` **is** the load.

**Why:** 65 auto-discovered skills cost ~7,000 tokens per request. With 9 hot
skills the same tree costs ~360. That is paid again for every subagent, so a
20-agent pipeline saved ~130k tokens.

## Fixed cost per request (OpenCode, this repo)

| Component | Approx tokens | How to cut it |
| --- | --- | --- |
| Skill index | ~360 | keep the hot set ≤ 12 skills; `--check` fails above that |
| `AGENTS.md` | ~2,000 | already a summary; detail lives in `.agents/docs/` |
| `~/AGENTS.md` (global) | ~500 | keep it a pointer, not a second contract |
| MCP tool schemas | 3,000–12,000 | enable MCP per project, not globally |

## MCP servers are the other big lever

Tool schemas are injected like skills, and subagents inherit them. Rules:

- **Do not enable a server globally** unless every project uses it.
  `StitchMCP` (18 tools) is disabled in `~/.config/opencode/opencode.jsonc`;
  set `"enabled": true` only in a project that actually calls it.
- `inheritMcp: false` on read-only subagents (`code-reviewer`, `ui-ux-reviewer`,
  `code-explorer`, `agent-evaluator`, `business-analyst`, `system-architect`,
  `tech-doc-architect`, `user-guide-creator`, `build-resolver`). Only agents
  that drive a browser or a live service inherit MCP.
- Prefer one server with few tools over three with overlapping ones.

## Hook latency

Hooks spawn a process per matching tool call. On `run_command`, six separate
`node` processes start before the command does (~300–400 ms). Keep hook matchers
as narrow as the harness allows, and never let a hook reach the network —
`auto-format-on-edit.js` uses the local `prettier` binary or `npx --no-install`,
never a registry fetch.

## Keeping it honest

```bash
node .agents/scripts/build-skill-index.mjs          # regenerate the catalog
node .agents/scripts/build-skill-index.mjs --check  # fails on drift or hot-set bloat
node .agents/scripts/measure-skill-index.mjs        # print the current cost
```

Wire `--check` into the pre-commit hook if the skill tree changes often.
