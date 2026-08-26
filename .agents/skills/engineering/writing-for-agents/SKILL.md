---
name: writing-for-agents
invocation: model
description: >
  Guidelines and standards for authoring documentation, skill descriptions, agent prompts,
  and architecture guides intended for AI agents to read. Focuses on high token efficiency,
  unambiguous failure modes, pointer-based architecture, and executable invariants rather
  than prose meant for human leisure reading. Model-invoked when creating or editing skills,
  AGENTS.md sections, rules, or system documentation.
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Writing for Agents — High-Leverage Documentation

## Purpose

Documentation for humans prioritizes gentle onboarding, narrative flow, and persuasion.
Documentation for AI agents prioritizes **low token cost, zero ambiguity, fast retrieval,
and verifiable invariants**. Writing agent-readable documentation maximizes model adherence
and prevents hallucinated shortcuts.

---

## Core Rules for Agent Documentation

### 1. Pointers Over Prose

- **Do not** replicate full API schemas, configs, or rules across multiple files.
- **Do** link to the authoritative source file (e.g. `See [CONTEXT.md](file:///path/to/CONTEXT.md)`).
- If an agent needs a snippet, provide the exact line reference or file path rather than paraphrasing.

### 2. High Information Density (Anti-Fluff)

- Cut polite preamble ("In this section, we will explore...", "It is important to remember that...").
- Replace multi-sentence explanations with concise tables, structured lists, or Mermaid diagrams.
- Write direct imperative instructions: _"Run X before Y"_, not _"You may want to consider running X"_.

### 3. Lead With Concrete Failure Modes

- Models respond significantly better to negative constraints and explicit failure modes than to abstract ideals.
- Instead of: _"Write clean, maintainable error handling."_
- Write:
  - ❌ _Silent swallowing of catch errors (`catch (e) {}`)_
  - ❌ _Returning raw database stack traces to HTTP clients_
  - ✅ _Catch, wrap in domain `AppException`, log with trace ID, return sanitized error DTO._

### 4. Anchored Vocabulary

- Strictly use the project's canonical terms from `CONTEXT.md`.
- Never introduce synonyms for existing domain concepts. If the project calls it a `seam`, do not switch between `boundary`, `adapter-zone`, and `junction` arbitrarily.

### 5. Deterministic Gates & Checklists

- Format verification requirements as binary checkboxes `[ ]` that can be audited.
- Define exact inputs, preconditions, tool invocation order, and explicit exit criteria.

---

## Template for Agent Skills (`SKILL.md`)

```markdown
---
name: <kebab-case-name>
invocation: user | model
description: >
  <One-paragraph active description stating when to invoke, what problem it solves,
  and the exact trigger phrases or preconditions.>
metadata:
  plane: control | data
---

# <Title>

## Purpose

<1-2 sentences on what failure mode this skill prevents>

## Protocol / Loop

1. **Pre-check:** <what must exist before running>
2. **Action sequence:** <exact steps with minimal prose>
3. **Verification:** <how to prove it succeeded>

## Boundaries & Non-Goals

- ❌ <Anti-pattern 1>
- ❌ <Anti-pattern 2>
- ✅ <Required invariant>

## Output Format

<Exact markdown template or schema expected>
```
