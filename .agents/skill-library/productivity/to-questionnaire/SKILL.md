---
name: to-questionnaire
invocation: user
description: >
  Turn a decision you cannot answer alone into a Markdown questionnaire for the one
  person who CAN answer it. Fill it in async, or go through it together over a
  meeting. It grills the SEND (who it's for, what you need back, deadline, format),
  not the subject — the subject is left to the recipient. Trigger when you say
  "I need to ask the product owner about X", "turn this into questions for the team",
  or "write up the open decisions for review".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# to-questionnaire — Decide Across People

## Purpose

Sometimes the blocker is not your knowledge — it is someone else's. A questionnaire
is the cleanest way to move a decision from "stuck in my head / in chat" to "answered
by the right person".

## Scope: grill the SEND, not the subject

Do NOT pre-write answers. Do NOT opine on the domain. Do:

1. Identify the recipient (role, not name unless you know it).
2. State what you are deciding and why you are asking.
3. List the open questions — each as one clear question, each with:
   - a short "why it matters" line
   - an example of a good answer (to guide granularity, not to bias)
   - any constraints / deadlines / format preferences
4. Add a compact "context" block so the recipient doesn't have to archaeologize.
5. Provide the return format: fill-in-the-blank table, or free-form, with a suggested deadline.

## Output shape

```markdown
# Questionnaire: <decision title>
- **Recipient:** <role>
- **Asker:** <you>
- **Deadline:** <date>
- **Return format:** <table / free-form / meeting>

## Context
<2–5 sentences: what we're deciding, what's already known, what's open>

## Questions
1. <Q1>
   - Why it matters: …
   - Good answer looks like: …
   - Answer: …
2. <Q2>
   …

## Constraints / non-goals
<scope fences so the recipient doesn't wander>

## ADR / traceability
- Related ADR: <link>
- Will feed: `CONTEXT.md` entry `<term>` / feature `.specify/features/<slug>/`
```

## Boundaries

- **No silent assumptions.** Every open item is a question, not a guess.
- **Trace it.** Note which feature/ADR the answers will feed so the recipient's effort
  is visible.
- **Update on return.** When answers come back, reflect confirmed terms into
  `CONTEXT.md` and any ADRs.
