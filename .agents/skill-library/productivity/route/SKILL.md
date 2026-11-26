---
name: route
invocation: user
description: >
  Intelligent workflow router (replacing `ask-matt`). Quickly guides the user to the exact
  skill, lifecycle phase, subagent, or failure-mode resolution needed for their current
  situation. Trigger when you say "which skill should I use?", "what's the best workflow for X?",
  "how do I do Y in this framework?", or "/route".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Route — Framework Navigation & Skill Selector

## Purpose

With over 40 specialized skills and a multi-agent lifecycle, choosing the right entry point
can cause hesitation. `route` acts as a fast dispatcher: it takes your immediate goal or
symptom and points you directly to the correct skill and invocation command.

---

For implementation requests, route through the BA checkpoint and lane rules in
AGENTS.md before downstream work. Fast remains one context without a feature
folder; native planning requires a signed-off Full baseline, and implementation
requires Gate 2 approval of plan + tasks. Read-only navigation needs no BA ceremony.

## Routing Matrix

### 1. By Lifecycle Phase (Control Plane)

| You want to...                         | Recommended Entry Point                                   | Next Step                                                              |
| -------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| Start a brand new feature or idea      | `intake-classifier`                                       | Establishes intent/evidence and lane; only Full creates a feature folder          |
| Explore open business/domain questions | `grilling` / `elicitation-interview`                      | Interactive interview covering business value and the 6 domain pillars |
| Model RBAC, states, rules, ERD         | `domain-modeling`                                         | Produces formal models, updates `CONTEXT.md`, and writes ADRs          |
| Scan for contradictions or scope risks | `risk-contradiction-scanner`                              | Consolidates assumptions, builds risk register, locks MoSCoW           |
| Draft PRD/SRS/User Stories             | `spec-writer`                                             | Generates IEEE 29148 compliant specifications                          |
| Validate spec quality & trace          | `spec-validator`                                          | Adversarial quality check against requirements                         |
| Formally sign off domain baseline      | `handover`                                                | Confirms Gate 1; technical planning and Gate 2 still precede implementation                    |
| Draft technical spec & architecture    | `technical-spec` & `implementation-plan`                        | Full: technical design and scoped plan; optional contracts when needed                            |
| Generate granular task breakdown       | `task-breakdown`                                           | Breaks implementation into testable slices                             |
| Implement slices with TDD              | `implementation-orchestrator`                             | Full after Gates 1 + 2; Fast implements and self-checks in one context                     |
| Adversarially review code & UI         | `code-reviewer` & `ui-design-review`                      | Dual-pass review: Standards Pass + Spec Fidelity Pass                  |
| Generate technical docs & user guides  | `technical-documentation` & `user-guide-with-screenshots` | Post-review documentation with visual evidence                         |

---

### 2. By Symptom / Failure Mode (Data Plane)

| Symptom / Friction                                          | Recommended Skill               | Why                                                                  |
| ----------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| _"I don't understand what the agent/user just said"_        | `wait-what`                     | Re-pitches using plain terms and `CONTEXT.md` shared language        |
| _"I need a quick throwaway mockup to test a design choice"_ | `prototype`                     | Single-file HTML or multi-variant UI before committing to production |
| _"A decision requires input from an external team member"_  | `to-questionnaire`              | Generates a structured async Markdown questionnaire                  |
| _"Merge or rebase has conflicted files"_                    | `resolving-merge-conflicts`     | Resolves conflict hunk-by-hunk by intent, never blind abort          |
| _"Modules feel fragmented, shallow, or hard to test"_       | `improve-codebase-architecture` | Hotspot scan + interactive HTML report + grilling loop               |
| _"Tests failing or regression bug discovered"_              | `diagnosing-bugs`               | 6-phase gated diagnostic loop with falsifiable hypotheses            |
| _"Session context is full or ending for the day"_           | `handoff`                       | Distills active mental model into a clean handoff document           |
| _"Writing new skills or AGENTS.md instructions"_            | `writing-for-agents`            | Ensures high density, low tokens, and zero ambiguity                 |
| _"Starting a new repo or onboarding a project"_             | `setup-workspace`               | Discovers project stack, initializes `CONTEXT.md` and `adr/`         |

---

## Protocol

When invoked:

1. Identify the user's immediate bottleneck (Domain clarity? Architecture? Bug? Testing? Git?).
2. Match against the routing matrices above or the **Failure-Mode Index** in `AGENTS.md`.
3. Provide a direct recommendation in 2–3 sentences:
   - Name the skill and its folder path (`.agents/skill-library/engineering/...` or `.../productivity/...`).
   - Give the exact trigger instruction or command.
   - Explain why this skill matches their situation.
