---
name: wait-what
invocation: user
description: >
  Use immediately when an explanation, architectural rationale, or decision does not
  land or feels confusing. Re-pitches the concept in 2–3 plain-spoken sentences using
  the canonical shorthand defined in `CONTEXT.md`. Strips away corporate buzzwords,
  verbose descriptions, and cognitive fog. Trigger when you say "wait what?", "can you
  rephrase that simply?", or "explain that with our project vocabulary".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Wait What — Re-pitching in Plain Language

## Purpose

When a model or human explanation produces confusion, continuing forward creates debt.
`wait-what` pauses the conversation to reframe the core idea using the **Shared Language**
established in `CONTEXT.md`. It acts as an instant clarifying anchor.

## Protocol

1. **Identify the friction point**: What specifically didn't land? (The state transition? The seam boundary? The business rule?)
2. **Consult `CONTEXT.md`**: Locate the canonical terms, shorthands, and established ADRs related to the topic.
3. **Re-pitch in 3 sentences max**:
   - **Sentence 1 (The Crux):** What problem is actually being solved, stated plainly without jargon.
   - **Sentence 2 (The Shorthand):** How we express this using our `CONTEXT.md` terms (Before vs After format).
   - **Sentence 3 (The Consequence):** What this decision means for the next immediate step.
4. **Offer Vocabulary Sync**:
   - If the confusion stemmed from a brand new term that is missing from `CONTEXT.md`, propose adding it directly:
     > _"Should I add `<term>` ('`<concise definition>`') to `CONTEXT.md` so we both share this shorthand going forward?"_

## Output Format

```markdown
### In plain terms:

- **What this means**: <1 clear sentence>
- **In our project language (`CONTEXT.md`)**: Instead of "<verbose explanation>", this is our **<canonical term>**.
- **Next concrete action**: <what we will do right now>
```

## Boundaries

- **Do not** write long essays or re-explain the entire architecture.
- **Do not** introduce new conflicting jargon.
- **Do** anchor every concept to entries in `CONTEXT.md` or active ADRs in `adr/`.
