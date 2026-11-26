---
invocation: user
name: command-generate-backlog
description: "Interview the user and render docs/PRODUCT_BACKLOG_ROADMAP.md: MoSCoW, RICE, dependency chain, effort, context budget, tasks. Never invents stories."
triggers:
  - "/generate-backlog"
  - "/create-roadmap"
  - "/plan-backlog"
  - "generate backlog"
  - "tạo roadmap"
  - "tạo backlog"
  - "create product roadmap"
---

# Command: Generate Product Backlog (/generate-backlog)

Render `docs/PRODUCT_BACKLOG_ROADMAP.md` (schema-version 1.2) from confirmed
business evidence. Read the existing roadmap, relevant domain terms and user
answers first; never invent stories, rules, defaults, edge behavior or scope.
Template: [PRODUCT_BACKLOG_ROADMAP-template.md](../../../../.specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md).

## 1. Establish the business checkpoint

Restate the desired outcome and affected behavior. Reuse confirmed evidence and
identify material unknowns as `ASM-BACKLOG-NN`. Establish:

- Goals, users/actors and observable success expectations.
- Current workflow and intended journey, rules/formulas and lifecycle transitions.
- Edge cases, failures, data boundaries, dependencies and affected existing behavior.
- In-scope and Won't-Have boundaries and acceptance expectations.

Batch only unanswered relevant questions, normally 2–3 per turn, with choices
and recommendations when useful. There is no fixed total question count. Wait
for answers to material business questions; repeat only to resolve conflicting
or changed evidence. Platform, auth, monetization and stack questions apply only
when relevant to this product. A generic platform interview is not a substitute
for understanding the domain.

## 2. Confirm the decision summary

Present confirmed goals, actors, journeys/rules, edge behavior, scope and
acceptance evidence, plus remaining ASM- items. Obtain user confirmation before
writing the roadmap. A decision already explicitly approved needs no repeated
approval. Keep material unanswered decisions unresolved; never turn "unknown"
into a recommended default or committed story. Mark affected stories `[!]`.

## 3. Render the roadmap

Use the template and confirmed decisions only:

1. Preserve schema-version and tech-stack frontmatter. Record confirmed stack
   choices or explicitly unresolved/not applicable entries; no mandatory stack.
2. Slice epics/stories by observable user outcome, using only applicable layers.
   Do not force every story through UI + API + database.
3. Give each story Slug, Effort, Context-budget, Priority, Depends-on, Blocks,
   business-level AC and relevant implementation Tasks. Tasks are preliminary
   scope notes and do not approve contracts or missing business decisions.
4. Include MoSCoW, dependency chain, roadmap tree and RICE using evidenced inputs.
   Label unavailable estimates; do not invent scores, metrics or commitments.
5. Effort S/M/L/XL describes scope, not lane permission. Apply `AGENTS.md` T1–T7
   on continuation, including small auth/PII stories and new business behavior.
6. Keep deferred ideas `[~]`, blocked decisions `[!]`, and never mark new work
   `[x]`. Scope sprints and release checks to confirmed priorities and risk;
   include only applicable security, migration, routing and smoke checks.
7. Record Won't-Have as confirmed boundaries or explicitly unresolved. Do not
   derive exclusions from a vague idea. Preserve existing completed stories.

## 4. Close

Report the output path, committed/blocked/deferred scope and `/continue` as the
next action. Roadmap confirmation does not approve future Full baselines or
technical plans. This command creates no feature folder and implements no story.

## Exit checklist

- [ ] Goals, actors, journeys/rules, edge cases, scope and AC traced to evidence
- [ ] Only unanswered relevant questions asked; material gaps remain ASM-/[!]
- [ ] Decision summary confirmed before writing
- [ ] Valid schema, story fields, dependencies and applicable tasks/checks
- [ ] No invented stories, defaults, stack or Won't-Have boundaries
- [ ] Continuation applies the same BA checkpoint and T1–T7
