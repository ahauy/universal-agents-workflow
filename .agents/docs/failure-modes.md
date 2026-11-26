# Failure-Mode Index (A9)

> Loaded on demand. When you hit friction or uncertainty, find the symptom below
> instead of guessing which skill to run.

| Symptom / Friction                                                 | Root Cause                      | Target Skill & Path                                                    |
| ------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------- |
| _"I don't understand what was just proposed / jargon feels dense"_ | Terminology misalignment        | `wait-what` (`productivity/wait-what`)                                 |
| _"Unsure which skill, command, or lifecycle phase to run next"_    | Framework navigation hesitation | `skills-index` (`.agents/skills/engineering/skills-index/SKILL.md`)                                         |
| _"Feature scope is vague; too many hidden design branches"_        | Incomplete elicitation          | `grilling` (`productivity/grilling`)                                   |
| _"Ambitious effort with unclear path / too large for one session"_ | Fog of War / unmapped decisions | `wayfinder` (`engineering/wayfinder`)                                  |
| _"A critical requirement depends on external team input"_          | Cross-stakeholder dependency    | `to-questionnaire` (`productivity/to-questionnaire`)                   |
| _"Debating between two UI layouts or state machine models"_        | Abstract speculation            | `prototype` (`engineering/prototype`)                                  |
| _"Git merge or rebase produced messy conflicts"_                   | Git branch divergence           | `resolving-merge-conflicts` (`engineering/resolving-merge-conflicts`)  |
| _"Bug reproduced but root cause is unknown or flaky"_              | Guess-and-check debugging       | `diagnosing-bugs` (`engineering/diagnosing-bugs`)                      |
| _"Modules feel shallow, coupled, or leaky cross-imports"_          | Architectural erosion           | `improve-codebase-architecture` / `setup-deep-modules`                 |
| _"Session ended; want to optimize agent environment or rule bloat"_| Feedback loop missing           | `retro` (`productivity/retro`)                                         |
| _"Agent context window is filling up or session is ending"_        | Memory bloat & drift            | `handoff` (`productivity/handoff`)                                     |
| _"Writing new system skills, rules, or instructions"_              | Unfocused agent documentation   | `technical-documentation` (`engineering/technical-documentation`), agent-authoring reference                |
| _"Starting a new repo or onboarding project from scratch"_         | Manual configuration burden     | `/command-skill-setup` (`engineering/command-skill-setup`)             |
| _"Upgrading framework or syncing upstream changes safely"_         | Framework evolution & drift     | `/command-update` (`engineering/command-update`)                       |
| _"Reviewing code or catching regressions before merge"_            | Unstructured code review        | `code-reviewer` agent (dual pass: Standards + Spec)                    |
| _"Need architecture or lifecycle diagrams"_ | Visual architecture clarity | Mermaid with `technical-documentation` |
| _"AI is adding flatpickr/moment/wrapper class for a date input"_   | Over-engineering / bloat        | `ponytail` (`engineering/ponytail`) — The Ladder                       |
| _"Agent generated 200+ lines for a task stdlib covers in 5"_       | Unnecessary complexity          | `ponytail-review` (`engineering/ponytail-review`)                      |
| _"Want to audit the whole codebase for bloat and deletable code"_  | Structural over-engineering     | `ponytail-review` — repository scope (`engineering/ponytail-review`)                        |
| _"Need to track deliberate shortcuts before they silently rot"_    | Unmanaged technical debt        | `ponytail-review debt` (`engineering/ponytail-review`)                          |
| _"Every task feels slow; too much ceremony before code"_            | Wrong lane / no escalation rule | `intake-classifier` (`engineering/intake-classifier`) — Fast by default |
