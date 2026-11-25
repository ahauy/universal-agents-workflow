# GEMINI.md

Behavioural deltas for Gemini-family models. **The pipeline, gates, tier lanes,
token budgets and delegation contract live in [`AGENTS.md`](./AGENTS.md) — read
that first.** This file only adds what is specific to this model family.

**Tradeoff:** these guidelines bias toward caution over speed. For trivial tasks,
use judgment.

## 1. Think before coding

- **Zero speculation.** Never invent a business rule, formula, default parameter,
  error behaviour, or edge case. If something is underspecified, stop and ask.
- State assumptions explicitly. If two interpretations exist, present both — do
  not pick one silently.
- If a simpler approach exists, say so and push back.

Tier classification and token budgets are defined once in `AGENTS.md` §2. Do not
re-derive them here.

## 2. Simplicity — the ladder

Stop at the first rung that holds:

1. Does this need to exist at all? Speculative future need → skip it.
2. Already in this codebase? Reuse the helper, util, type, or pattern.
3. Stdlib does it? Use it (`functools.lru_cache`, `Intl.DateTimeFormat`, `os.path`).
4. Native platform feature covers it? `<input type="date">` over a picker lib, CSS
   over JS, a DB constraint over application code.
5. Already-installed dependency solves it? Use it. Never add one for a few lines.
6. Can it be one line? Write one line.
7. Only then: the minimum code that works and passes the test.

No unrequested abstractions. No scaffolding "for later". If you wrote 200 lines and
it could be 50, rewrite it. Mark deliberate simplifications with a `ponytail:`
comment naming the ceiling and the upgrade path.

## 3. Surgical changes

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor what isn't broken.
- Match existing style even if you'd do it differently.
- Notice unrelated dead code → mention it, don't delete it.
- Remove only the imports/variables your own change orphaned.

The test: every changed line traces directly to the user's request.

## 4. Goal-driven execution

Turn tasks into verifiable goals before starting:

- "Add validation" → "write tests for invalid inputs, then make them pass"
- "Fix the bug" → "write a test that reproduces it, then make it pass"
- "Refactor X" → "tests pass before and after"

For multi-step work, state the plan as `[step] → verify: [check]` lines. Strong
success criteria let you loop without asking.

## 5. Design system & anti-slop

Before touching `.tsx`, `.jsx`, `.css`, or any UI mockup:

1. Read `CONTEXT.md` for canonical terminology and `adr/` for settled decisions.
2. Read the target project's design tokens (`DESIGN.md` or component tokens) to
   match its palette, typography and geometry.

Forbidden: unrequested multi-colour gradients, heavy glassmorphism, floating blurred
neon orbs, fake pricing tiers, mocked CLI output.

Required: clean canvas, 1px hairline borders, explicit type hierarchy
(display / body / mono), and a **stable outer anchor** for hover physics — never
attach hover handlers to elements translating on the Y axis.

Detail: `design-taste-frontend` (public surfaces) or `design-taste-product`
(in-app screens) — read the router section first, then one `references/` file.

## 6. Reporting

When a subagent is dispatched or finishes, announce in chat: name & role, active
model, task scope, output artifact path. Detail in `AGENTS.md` §4.

These guidelines are working if: diffs contain fewer unnecessary changes, fewer
rewrites from overcomplication, zero generic AI slop, and clarifying questions
arrive before implementation rather than after mistakes.
