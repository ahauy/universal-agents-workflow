# Skill & Reference Matrix

> This file used to hold the full skill lookup table. That table now lives in
> **[`.agents/SKILLS.md`](../SKILLS.md)** and is generated from skill frontmatter,
> so it cannot drift. Read it when you need to pick a skill; do not read it at
> session start.

## Project-wide references (not skills)

| Context / Area                                | Reference                   | Location       |
| --------------------------------------------- | --------------------------- | -------------- |
| Project shared language (ubiquitous language) | `CONTEXT.md`                | Root           |
| Architecture decisions & enduring constraints | `adr/`                      | Root           |
| Project design system & tokens                | `DESIGN.md` / design tokens | Target UI root |

## Skill lookup

| Need | Go to |
| --- | --- |
| Which skill for this situation | [`.agents/SKILLS.md`](../SKILLS.md) — *Pick fast* table |
| A skill's full instructions | path in the catalog's last column |
| Hot vs cold set, why it matters | `.agents/skills/engineering/skills-index/SKILL.md` |
| Symptom-driven routing | [`failure-modes.md`](failure-modes.md) |

## Adding or moving a skill

1. Put it in `.agents/skill-library/<group>/<name>/SKILL.md` (cold) or
   `.agents/skills/<group>/<name>/SKILL.md` (hot — only entry points and slash
   commands belong here).
2. Add its name to `GROUPS` in `.agents/scripts/build-skill-index.mjs`.
3. Run `node .agents/scripts/build-skill-index.mjs` then `--check`.

The `--check` gate fails when a skill is unmapped or a mapped path is missing.
