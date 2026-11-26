# Reading Map — large files and where to jump

> Purpose: stop whole-file reads. Every file here is big enough that reading it
> end-to-end costs real tokens and buries the part you actually needed.
>
> **How to use:** find your task in the left column, read only the section named
> in the middle column (use a targeted read with `offset`/`limit`, or search for
> the heading). Read the whole file only when you are editing the whole file.

## Reference material (never read front-to-back)

| If you need… | Read | In |
| --- | --- | --- |
| Which skill to use, and where it lives | the *Pick fast* table | `.agents/SKILLS.md` |
| Which skill fits a symptom | the symptom row | `.agents/docs/failure-modes.md` |
| The step you are currently on | that step only | `.agents/docs/pipeline-detail.md` |
| A command or skill name | the matching numbered group | `.agents/docs/skills-cheatsheet.md` |
| How to work the pipeline in practice | the step you are on | `.agents/docs/workflow-step-by-step.md` |

## Skills (split skills: open the router first)

| If you need… | Read | In |
| --- | --- | --- |
| Git branching or commit message rules | `Strict Rules` + `Commit Messages` | `git-workflow` → `references/branching-and-commits.md` |
| Merge vs rebase decision, conflict handling | `Merge vs Rebase` / `Conflict Resolution` | `git-workflow` → `references/merge-rebase-conflicts.md` |
| PR description or release steps | `Pull Request Workflow` / `Release Management` | `git-workflow` → `references/pr-and-release.md` |
| Git hooks, config, anti-patterns | `Git Hooks` / `Anti-Patterns` | `git-workflow` → `references/config-hooks-antipatterns.md` |
| Design tokens, palette, type scale | `Design anchor` / `Palette` / `Type` | `design-taste-product` → `references/design-anchor.md` |
| Empty/loading/error states, a11y, i18n | `UX states` / `Accessibility` / `i18n` | `design-taste-product` → `references/ux-states-a11y-i18n.md` |
| Streaks/XP/rewards, product-UI AI tells | `Engagement mechanics` / `AI tells` | `design-taste-product` → `references/engagement-and-ai-tells.md` |
| Scroll/hover skeletons, motion perf, dark mode | the one skeleton or section | `design-taste-frontend` → `references/*.md` |
| Requirements quality checklist | Validation criteria | `spec-validator` → `SKILL.md` |
| Technical analysis findings | Findings/output contract | `technical-consistency-review` → `SKILL.md` |

## Big single-file skills (read the section, not the file)

| If you need… | Read this section |
| --- | --- |
| A debugging loop, start to finish | `diagnosing-bugs`: `The 6-Phase Gated Loop` (index) then only the phase you are in. Phases 1 and 2 are long — read them one at a time. |
| Resuming work from the roadmap | `command-continue-project`: `Step 1` dependencies and evidence, then `Step 2` checkpoint and lane. |
| Native technical planning | Read the input/output contract in `technical-spec`, `implementation-plan`, `task-breakdown` or `technical-consistency-review` only when needed. |
| Architectural audit report layout | `improve-codebase-architecture`: `HTML-REPORT.md` only when generating the report. |
| Diagram authoring | `technical-documentation`: current code evidence and Mermaid diagram. |

## Project docs (Vietnamese, large)

| If you need… | Read this section |
| --- | --- |
| How to install / quickstart | `README.md` → `Hướng Dẫn Bắt Đầu Nhanh` |
| The 7-step lifecycle explained | `README.md` → `Vòng Đời Phát Triển Chuẩn 7 Bước` |
| Directory conventions | `README.md` → `Cấu Trúc Thư Mục Chuẩn` |
| Git guardrails | `README.md` → `Khóa Bảo Vệ Git (Guardrails)` |
| Update / upgrade mechanics | `README.md` → `Cập Nhật & Nâng Cấp Thông Minh` |

## Templates

| If you need… | Read this section |
| --- | --- |
| Roadmap structure | `PRODUCT_BACKLOG_ROADMAP-template.md` → `Sprint 1` block as the shape to copy |
| Task breakdown format | `tasks-template.md` → `Format`, then `Phase 3` as the example |
| Spec structure | `spec-template.md` (small — read whole) |
| Phase handoff summary | `context-pack.md` (small — read whole) |

## Rule of thumb

If a file is over ~500 lines and you are reading more than 40 % of it, you are
probably doing the wrong task — split the work first.
