---
name: technical-spec
description: Design UAW technical spec.md from a signed-off Full-lane baseline; return unresolved business decisions to BA.
metadata:
  origin: universal-agents-workflow
  plane: engineering
---

# Technical specification

Use only in Full-lane Step 3 after baseline.md is SIGNED-OFF. Fast work keeps its concise checkpoint and plan in chat; invoking this skill does not create a second planning process.

Read the feature context-pack.md, the relevant signed-off requirements.md sections and domain/risk evidence, project rules, and the existing code surfaces being changed. Reuse confirmed answers. If the baseline is missing or unsigned, stop technical planning and return to the BA checkpoint. Record material business gaps as ASM- ids and return them to elicitation-interview; never invent a rule, default, error behavior, or performance target.

Write .specify/features/<slug>/spec.md using .specify/templates/spec-template.md. requirements.md owns intent and acceptance criteria; reference its BR-/REQ-/US- ids rather than authoring a competing business specification. Describe the applicable component boundaries, data flow, contracts/DTO validation, state or schema changes, failure/recovery behavior, and security/operational constraints supported by those requirements. Include exact existing surfaces where known. Mark irrelevant sections not applicable with a reason. Supporting contracts/ or data-model.md are optional, only when their reader and use are clear.

Resolve material technical choices against repository conventions and evidence. Ask only unresolved questions that affect the contract; recommendations are proposals until accepted. Preserve signed-off content: scope changes require a versioned change record and renewed approval, not an in-place rewrite.

Self-check that each technical decision traces to approved intent and each applicable requirement has a design surface and verification approach. Report artifacts and remaining questions; hand off to implementation-plan when the design is coherent. Do not run upstream CLIs, create branches, or implement code.
