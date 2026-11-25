---
name: resolving-merge-conflicts
invocation: model
description: >
  Work through an in-progress git merge or rebase conflict hunk-by-hunk, resolving by
  intent traced to each side's primary source (the commit message, the spec/ADR it
  implements), never by blind "take mine / take theirs" and never with `--abort` as
  the first reaction. Model-invoked when a merge/rebase has produced conflicts the
  user needs resolved correctly, or when the user asks to "resolve the conflicts".
metadata:
  origin: mattpocock/skills (adapted)
  plane: data
---

# Resolving Merge Conflicts

## Mindset

A conflict is not "which block wins". It is: **what did each side intend?** Resolve by
intent, traced to a source. Only fall back to judgment when intent is genuinely ambiguous
—and then surface that ambiguity to the user, don't hide it.

## Loop

1. **Establish the merge shape.** `git status`, `git log --merge`, what branch is being
   merged into what. Confirm this is a merge/rebase the user wants to finish.
2. **Per conflicted file:**
   - Read the conflict markers top-to-bottom.
   - For EACH side, find the intent: the commit message, the spec / ADR / issue it
     references, or `git log -p` of the originating change.
   - Decide the resolution: keep one, keep both, or **synthesize** (the common case).
   - Remove the markers. Keep the code consistent (no dangling imports, no duplicate
     functions, balanced braces).
3. **Verify by behavior, not by eye:**
   - Run the type checker / linter / targeted tests on the touched areas.
   - If the repo has a test suite, run at least the affected slice.
4. **Stage and continue.** `git add <file>`, then continue the merge/rebase.
5. **Finish.** Complete the merge commit / `git rebase --continue`. Show the resulting
   diff summary to the user.

## Rules

- **Never `git merge --abort` / `git rebase --abort` as the first move.** Abort is for
  when the merge is fundamentally wrong (wrong base, unrelated history), not for
  conflicts. If you recommend aborting, say why.
- **Never silent `ours`/`theirs` for real logic conflicts.** Only use them for files
  where one side is clearly authoritative (e.g. lockfiles, generated files, docs).
- **Surface ambiguity.** If two intents genuinely collide, stop and ask the user which
  wins, with a one-line explanation of each side.
- **Trace to a source.** Every resolved hunk should be explainable as "this kept X's
  intent because …".

## Scope fence

This skill resolves conflicts in an **in-progress** operation. It does not redo the
merge strategy (that is `git-workflow`'s decision) and does not rewrite history.
