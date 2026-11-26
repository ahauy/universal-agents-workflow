# Writing for agents

Use for skills, prompts, project rules and other agent-facing documentation.
Keep instructions short, precise and verifiable; read only the needed section.

## Source pointers and density

Link the authoritative file instead of copying schemas, config or policy into
multiple locations. Use valid local Markdown paths and exact section/line pointers
when helpful; remove placeholder links before publishing. Cut preambles and vague
advice. Prefer direct actions, small tables or a diagram only when they improve
understanding. Never duplicate an entire reference in a hot skill.

## Failure modes and shared vocabulary

Name the concrete failure and recovery rather than a slogan. For example, prohibit
silent catch blocks and raw database stack traces in client responses; require an
explicit safe error response and project-appropriate diagnostic evidence instead.
Do not invent an AppException class, logging system or business rule to fit an
example. Use existing CONTEXT.md terms consistently; clarify conflicts instead of
adding synonyms for the same concept.

## Verifiable boundaries

State exact inputs, preconditions, necessary tool order, expected artifacts and
observable exit checks. Use auditable checkboxes for gates. Distinguish always,
ask-first and never boundaries using the actual project contract. Unknowns remain
visible; do not turn a model's suggested default into approved policy. Reuse already
confirmed choices and avoid redundant approval or repeated interviews.

## Skill authoring shape

```markdown
---
name: <kebab-case-name>
invocation: user | model
description: <when to invoke and what failure this prevents>
---

# <Title>

## Purpose
<problem addressed>

## Protocol
1. Check <real prerequisite>.
2. Perform <scoped actions>.
3. Verify <observable result>.

## Boundaries
<prohibited behavior and material unknowns>

## Output
<artifact path and concise result shape>
```

Match frontmatter and invocation behavior to the supported harness. Link larger
references and load one relevant section at a time. Validate names, paths and
checklists against source before publishing; keep custom content and signed
historical artifacts intact.
