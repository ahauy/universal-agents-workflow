# Slice A implementation report

Gate 2 authorized T002–T004. No Git writes performed.

## Files

- `.agents/scripts/update-engine.py`: shared fresh/reinstall/apply lifecycle; validated preflight; atomic source copies and metadata; persistent selected packs and mapping-bound hashes; conservative unowned/legacy handling; ordered verified-source generators; recorded partial/failure/unavailable outcomes; same-version retries.
- `.agents/scripts/update-state.py`: named stdlib helper for metadata/hash/path validation, catalog selections, distribution exclusions and atomic JSON persistence.
- `install.sh`, `install.ps1`: delegate all source copies, explicit pack selection and derived refresh to the engine; remove blind-copy/empty-manifest paths; preflight installer ignore/notice paths.
- `.agents/scripts/test/test-update-engine.py`: nineteen offline lifecycle regressions.
- `.agents/scripts/test/test-installers.py`: twelve installer cases, valid hash fixtures, helper distribution, ignore symlink guard.

## Contracts

Schema 2 retains unknown metadata and old fields. `selectedPacks` records catalog IDs and source/target paths. `fileHashes` and compatibility `manifest` bind relocated files as `source=>destination`; identity mappings retain source-only keys. Existing identical unowned content is kept without ownership adoption. Kept conflicts retain old hashes. Legacy absent selection means core only, with an explicit reconfirmation notice.

`--extra-ship source=destination` persists an explicit selection (resolving catalog ID when matched). `--detect-packs` offers detected packs before any writes and is passed by install/reinstall only. `--apply` retries core plus persisted packs even at the same version. Included-in-core catalog entries do not create a second pack owner. Shared destination directory roots are permitted only when their expanded output files do not collide.

Derived commands run from verified source: index, adapters, hooks, with `--validate-only` preflight before source writes. Adapter mode is omitted so B preserves recorded copy/link mode. Node unavailable reports failed phases; existing derived state additionally requires Node validation before any source write. Missing source generators are explicitly unavailable and prevent an `ok` overall status. Per-phase result objects/stdout/stderr are persisted in `lastSync`; failure messages are printed. Source sync remains safely retriable after derived failure.

## Evidence

Initial seven-test red run exposed six failures: corrupt metadata, excluded artifacts, destination escape, persisted packs, target symlinks and unowned content adoption. Added targeted failure/retry/alias tests during implementation.

Final commands:

- `python3 .agents/scripts/test/test-update-engine.py`: 19 passed.
- `python3 .agents/scripts/test/test-installers.py`: 9 passed, 3 skipped (`pwsh` unavailable).
- `python3 .agents/scripts/test/test-update-integration.py`: passed (coordinator-owned full fixture, two upgrades; 3.6 seconds).
- `bash -n install.sh`: passed.

Integration exposed actual catalog shared agent-directory roots and a B custom-skill scanner issue; both were fixed and the full fixture passed afterward.

## Limits

PowerShell runtime execution remains unverified because `pwsh` is unavailable; its script uses the same tested Python engine. Safe writes completed before a later failure remain in place (no global transaction). Existing target distribution artifacts are preserved rather than purged. No network/customer updates were executed.

## Post-review full installer detector regression

The coordinator's real full-source Bash Go install exposed a legitimate `.specify/` directory marker rejected as a mapping path. Detection now removes exactly one trailing slash on directory-only markers, then applies strict existing path validation. Root, traversal and doubled trailing slash markers still fail. Content markers keep quoted keyword matching; nested glob scanning preserves existing recursive detection while skipping framework/cache/symlink directories. Bundled identity catalog rows under the default core set do not add duplicate selected-pack owners or false unavailable packs.

Three additional regressions ran red before their fixes and green afterward. Real `/bin/bash install.sh --target <temporary Go project> --mode team --yes` ran fresh and reinstall against the full source: both exited 0; selection stayed exactly `go-patterns`, `go-rules`, `go-depguard`, `go-agents`; unavailable list remained empty; custom CONTEXT bytes survived; `.claude/skills` had 9 entries and `.claude/agents` had 15 entries including code-reviewer. Both runs truthfully reported partial derived status where generated root adapters were pre-existing unowned source outputs. Temporary-only evidence logs: `/tmp/uaw-bash-go-fresh.txt`, `/tmp/uaw-bash-go-reinstall.txt`.

Permanent full-source Bash fresh/reinstall coverage now lives in `test-installers.py`, runs on normal PATH against temporary Go projects, and additionally verifies Go appears in `.agents/SKILLS.md` and `.claude/agents/go-reviewer.md` exists. Cold Go skill fanout is intentionally absent from the hot harness set. Installer suite: 12 cases, 9 pass and 3 PowerShell skips.

## R2 installer result wording correction

Bash and PowerShell now direct readers to source and phase summaries without printing unconditional refresh/completion success. Exit codes and conflict preservation are unchanged. The minimal Bash fresh fixture explicitly observes `Refresh status: partial` and rejects prior success/completion text. This assertion failed before the wording change and passed afterward. Delta: two Bash output lines, one PowerShell output line, four installer assertions.
