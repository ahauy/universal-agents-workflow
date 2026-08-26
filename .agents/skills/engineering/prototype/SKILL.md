---
name: prototype
invocation: model
description: >
  Build a throwaway prototype to answer a design question before committing to the
  real implementation. Two modes: (a) a single shareable HTML file for state/logic/
  data-flow questions, or (b) several radically different UI variations toggleable
  from one route. The output is disposable — it exists to make a decision visible,
  not to ship. Model-invoked when a design choice is genuinely open and a prototype
  will settle it faster than prose.
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Prototype — Throwaway Design Exploration

## Purpose

When a design decision is open, arguing about it in chat is slow. A prototype makes
the decision visible. It is **throwaway**: no tests, no build, no integration. Delete
it once the decision is made.

## Two modes

### Mode A — Logic / state prototype (single HTML file)

Use when the question is about **data flow, state machines, or algorithm behavior**.

- One self-contained `prototype-<topic>.html` file.
- Inline JS, no framework, no build.
- Model the exact state/edge cases from `CONTEXT.md` and the current interview.
- Add a "what I'm trying to decide" comment block at the top.

### Mode B — UI variations (multiple directions, one route)

Use when the question is about **layout, structure, or feel**.

- Build 2–4 **radically different** variations (not minor tweaks).
- Toggle between them from one entry point (tabs, a select, or URL hash).
- Keep them shareable and quick to load.

## Rules

- **No production code.** No imports from the real app, no shared types that would
  force refactoring later.
- **Label assumptions.** Put the open question at the top so the next reader knows
  what this prototype is deciding.
- **Time-box.** A prototype should take minutes to hours, not days. If it is taking
  longer, it has stopped being a prototype and started being the feature — stop and
  switch to the real plan.
- **Record the outcome.** When a decision is made, note it in the relevant ADR and,
  if it introduced a shared term, in `CONTEXT.md`.

## When NOT to use

- The decision is already settled → just implement.
- The question is "does the user want X" → use `to-questionnaire` instead.
- It would take real effort to build → prototype the *shape*, not the *whole*.
