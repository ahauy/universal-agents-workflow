# Code Review Standards

This file defines **when** a review happens and **what blocks a merge**. The full
review protocol lives in one place only:

👉 **[`.agents/agents/code-reviewer.md`](../../agents/code-reviewer.md)** — dual/tri-pass
structure, the 4 stopping rules, the 5 finding buckets, and the report template.

Do not restate that protocol here. Duplicated protocols drift apart, and the model
then follows whichever copy it read last.

## When to review

Mandatory triggers:

- After writing or modifying code.
- Before any commit to a shared branch.
- When security-sensitive code changes (auth, payments, user data).
- When architectural boundaries change.
- Before merging a pull request.

Pre-review requirements: automated checks passing, conflicts resolved, branch up to
date with the target.

## Severity levels

| Level | Meaning | Action |
| --- | --- | --- |
| CRITICAL | Security vulnerability or data-loss risk | **BLOCK** — must fix before merge |
| HIGH | Bug or significant quality issue | **WARN** — should fix before merge |
| MEDIUM | Maintainability concern | **INFO** — consider fixing |
| LOW | Style or minor suggestion | **NOTE** — optional |

## Approval criteria

- **Approve** — no CRITICAL or HIGH issues.
- **Conditional approve** — only HIGH issues remaining; log them as debt in `CHANGELOG.md`.
- **Block** — any CRITICAL issue.

## Who reviews

| Situation | Reviewer |
| --- | --- |
| Any language, default | `code-reviewer` agent |
| UI files changed | `code-reviewer` + `ui-ux-reviewer` agent |
| A `<lang>-reviewer` agent is installed in `.agents/agents/` | route files of that language to it; the polyglot `code-reviewer` remains the fallback |

Language-specific reviewers (`security-reviewer`, `typescript-reviewer`,
`python-reviewer`, `go-reviewer`, `rust-reviewer`) are **not** bundled. Do not
delegate to an agent that does not exist in `.agents/agents/` — check the directory
first.

## Related

- [testing.md](testing.md) — coverage requirements
- [security.md](security.md) — security checklist
- [git-workflow.md](git-workflow.md) — commit standards
- [agents.md](agents.md) — delegation and dispatch
