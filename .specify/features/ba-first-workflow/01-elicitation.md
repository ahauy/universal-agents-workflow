# Elicitation: BA-first UAW workflow

## Confirmed owner intent

- Synchronize Fast/Full, SpecKit integration, roadmap behavior and skill naming.
- First analyze whether SpecKit or UAW better serves the project's main goal:
  AI must analyze business needs thoroughly and understand the user's request
  before proceeding.
- Verify the resulting work and report concisely.

## Repository findings

- AGENTS.md allows Fast to bypass the domain baseline and grants a blanket
  roadmap bypass; command-continue-project still escalates on security/domain triggers.
- The local speckit-specify header assigns it technical-spec responsibility,
  but its inherited instructions/template describe business behavior and permit defaults.
- Ten SpecKit skills are bundled; referenced .specify/scripts are absent.
- The documented consistency-scan skill does not exist. Its claimed merged
  technical analysis requires plan/tasks that do not exist at the BA stage.
- CLAUDE.md and the context hook still carry older mandatory pipeline/Tier language.
- Backlog elicitation's fixed six questions focus on platform/auth/content/team/
  monetization/exclusions, without a required domain workflow/rule interview.

## Confirmed decisions

Owner approval on 2026-11-26: “Mình duyệt hướng UAW tự chủ, BA theo mức Fast/Full để tối ưu chi phí. Bạn tiếp tục sửa phần 3, rồi kiểm tra và báo cáo ngắn gọn cho mình.”

- ASM-BA-001: UAW becomes the sole core workflow; retain useful SDD concepts,
  replace the bundled SpecKit execution path with self-contained UAW skills.
- ASM-BA-002: Every implementation request passes a business-understanding
  checkpoint. Fast uses concise impact/acceptance confirmation against known
  requirements; Full performs deep elicitation for new/ambiguous business behavior
  and existing risk triggers. No lane invents unresolved business decisions.
- ASM-BA-003: Roadmap is an input, not an automatic BA approval. Reuse confirmed
  evidence; resolve missing decisions before implementation, without repeating
  questions already answered or relaxing safety escalation rules.

ASM-BA-001..003 are confirmed by that approval. Cost optimization means matching
depth to uncertainty/risk, reusing confirmed evidence and limiting duplicated
context/artifacts. It is not a guaranteed monetary reduction. Current telemetry
has no measured token/cost values; no saving percentage or new spending limit
has been agreed. No business-scope questions remain.

## Read-only checks

- Skill catalog: 9 hot + 57 cold, --check passes.
- Agent/instruction contract validator: 25 agents + 98 instructions, no findings.
- Those checks validate structure; they do not resolve the semantic conflicts above.

## Primary external sources consulted

- https://github.com/github/spec-kit
- https://github.com/github/spec-kit/blob/main/templates/commands/specify.md
- https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md

External comparison was checked against current upstream files, not inferred
only from this repository's copied prompts.
