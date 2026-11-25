---
name: skills-index
description: "Skill catalog router. Read .agents/SKILLS.md, pick the one row that matches the situation, then open that SKILL.md. Use when unsure which skill or process applies."
invocation: model
---

# Skills Index — the catalog router

Most framework skills are not pre-loaded. They live in `.agents/skill-library/`
and cost nothing until read. This skill is the entry point to that library.

## Do this

1. Read `.agents/SKILLS.md` (the catalog). It has a **Pick fast** table
   (symptom → skill) and one row per skill with its path.
2. Pick **one** row that matches the current situation.
3. Read that one `SKILL.md` and follow it.
4. Stop there. Do not preload sibling skills "just in case".

## Rules

- A cold skill has no `skill` tool entry. Reading its file **is** the load.
- Never read the whole library. Never read `.agents/SKILLS.md` at session start.
- If two rows look equally right, prefer the earlier pipeline phase
  (intake → domain → spec → plan → implement → review → docs).
- If nothing matches, use `route` (`.agents/skill-library/productivity/route/SKILL.md`).

## Layout

| Path | What | Cost |
| --- | --- | --- |
| `.agents/SKILLS.md` | The catalog (single source of truth) | read on demand |
| `.agents/skills/` | Hot set: entry points and slash commands | indexed every request |
| `.agents/skill-library/` | Cold set: everything else | zero until read |

Regenerate the catalog with `node .agents/scripts/build-skill-index.mjs`;
verify it is in sync with `--check`. The generator fails when a skill is added
or moved without updating the group map, so the catalog cannot silently rot.
