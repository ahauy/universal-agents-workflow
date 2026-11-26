---
name: ponytail-review
description: >
  Diff/repository complexity review or a debt ledger of deliberate ponytail shortcuts. Finds what to delete:
  reinvented standard library, unneeded dependencies, speculative abstractions,
  dead flexibility. One line per finding: location, what to cut, what replaces
  it. Use when the user says "review for over-engineering", "what can we
  delete", "is this over-engineered", "simplify review", or invokes
  /ponytail-review. Complements correctness-focused review, this one only
  hunts complexity.
---

Review unnecessary complexity in the requested scope. One line per finding:
location, what to cut, what replaces it. This is a read-only report.

## Scope

- **Diff**: `/ponytail-review diff` or a request to review changes. Inspect the
  specified diff and enough callers to justify each proposed cut.
- **Repository**: `/ponytail-review repo` or an explicit whole-codebase audit
  request. Scan source, dependencies and callers across the repository; exclude
  dependency/vendor trees, build outputs, Git internals and generated artifacts.
  Rank findings by the largest justified reduction first.
- **Debt**: `/ponytail-review debt` or a request to list deferred shortcuts.
  Follow the debt ledger section below; no complexity-cut review is implied.
- If the requested scope is unclear, clarify it before a repository-wide scan.

Look for dependencies covered by stdlib/native features, single-implementation
interfaces, one-product factories, forwarding wrappers, dead flags/config,
speculative flexibility and hand-rolled stdlib. Prove reachability and consumer
impact before suggesting deletion; a small file is not itself evidence of bloat.

## Format

`L<line>: <tag> <what>. <replacement>.`, or `<file>:L<line>: ...` for
multi-file diffs.

Tags:

- `delete:` dead code, unused flexibility, speculative feature. Replacement: nothing.
- `stdlib:` hand-rolled thing the standard library ships. Name the function.
- `native:` dependency or code doing what the platform already does. Name the feature.
- `yagni:` abstraction with one implementation, config nobody sets, layer with one caller.
- `shrink:` same logic, fewer lines. Show the shorter form.

## Examples

❌ "This EmailValidator class might be more complex than necessary, have you
considered whether all these validation rules are needed at this stage?"

✅ `L12-38: stdlib: 27-line validator class. "@" in email, 1 line, real validation is the confirmation mail.`

✅ `L4: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.`

✅ `repo.py:L88: yagni: AbstractRepository with one implementation. Inline it until a second one exists.`

✅ `L52-71: delete: retry wrapper around an idempotent local call. Nothing replaces it.`

✅ `L30-44: shrink: manual loop builds dict. dict(zip(keys, values)), 1 line.`

## Scoring

End with `net: -<N> lines possible.` For repository audits also report
`-<M> dependencies possible` when backed by dependency/caller evidence. Label
figures as estimates, avoid double-counting overlapping cuts, and never present
external benchmarks or elapsed time as this project's token or cost savings.

If there is nothing to cut, say `Lean already. Ship.` and stop.

## Debt ledger

For debt mode, scan comment markers such as `# ponytail:` or `// ponytail:`;
exclude dependencies/vendor trees, .git and build/generated output. Use rg first,
for example `rg -n '(#|//) ?ponytail:'` over the relevant source paths, adding
comment prefixes appropriate to the actual language. Prose that merely mentions
the convention is not a debt item.

Group one row per marker by file. Report `<file>:<line>`, what was simplified,
`ceiling: <limit>`, and `upgrade: <trigger>`, using only the marker's evidence.
Flag a missing upgrade trigger as `no-trigger`; do not invent a deadline or owner.
Read-only `git blame` may supply an owner when requested. End with `<N> markers,
<M> with no trigger`; if none, report `No ponytail: debt. Clean ledger.` This mode
does not use the estimated-lines-reduction score above.

Report without changing files. Persist a ledger only when explicitly requested,
then preserve existing custom content and use the requested destination. The mode
ends after the report; `normal mode` returns to ordinary review behavior.

## Boundaries

Scope: over-engineering and complexity only. Correctness bugs, security holes,
and performance are explicitly out of scope. Route them to a normal review
pass, not this one. A single smoke test or `assert`-based
self-check is the ponytail minimum, not bloat, never flag it for deletion.
Does not apply the fixes, only lists them.
"stop ponytail-review" or "normal mode": revert to verbose review style.
