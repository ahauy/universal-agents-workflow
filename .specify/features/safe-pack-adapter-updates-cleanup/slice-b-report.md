# Slice B — derived ownership and catalog

Status: implemented; ready for independent review. No Git writes.

## Changes

- `sync-harnesses.mjs`: harness-manifest v2 records each output file/link with its
  source identity and last-written SHA-256 or link target. Copy mode refreshes safe
  files individually, leaving edited files and user descendants. Marker/path-only
  legacy state is validated but grants no ownership. Clean removes only unchanged
  recorded individual files/links. Generated path collisions fail before execution.
  Recorded copy/link mode and harness selection survive an implicit refresh.
- `build-skill-index.mjs`: supports `--root`; safely regenerates only owned index
  content, including a first copied index proven by the workflow-source registry.
  Same-name hot/cold trees are pruned only when fully owned and byte-equivalent;
  hot pack relocation similarly requires ownership of every descendant. Direct
  custom library skills are supported. Catalog parsing fails on malformed data;
  actual expanded file collisions, rather than shared directory roots, are checked.
- `install-hooks.js`: preserves settings outside `hooks` and tracks exact generated
  groups by event/matcher and hash. Modified or unverified groups remain unchanged;
  a command mentioning the framework never proves ownership.
- `derived-state.cjs`: shared stdlib path/schema/hash checks, atomic sibling-temp
  writes, and provenance comparison. Hooks/index keep independent v2 state files
  so commands cannot overwrite another phase's ownership.
- Canonical Archify row references the bundled core source/destination and local
  runtime, with `included_in_core: true`; removed global-install instructions.
  Runtime `.agents/catalog.json` mirrors the authoritative optional catalog exactly.
  Explicit source maintenance uses `--catalog-write`; `--catalog-check` is read-only.

## CLI contract delivered to slice A

All three support `--validate-only` and return before mutations. Failure exits 1;
conflicts alone exit 0 and report a partial JSON result with phase/status, updated,
kept, conflicts and failed counts. Index takes `--root TARGET`; adapters/hooks take
`--target TARGET`. Adapter mode is preserved unless explicitly provided.

State files are `.agents/harness-manifest.json`,
`.agents/derived-state-index.json`, and `.agents/derived-state-hooks.json`.
Existing unsupported/corrupt state and unsafe metadata paths fail validation.
Existing unverified output is kept across retries; its content is never adopted as
an ownership baseline merely because it matches current generator output.

## Verification

Tests were added before the corresponding fixes. Initial derived run: 5 failures
out of 6 cases (marker overwrite, stale copy, unsafe legacy clean, changed-link
clean, misplaced settings hooks). Initial Archify canonical-owner assertion failed.

- `node --test .agents/scripts/test/test-derived-updates.mjs .agents/scripts/test/test-catalog.mjs`:
  PASS, 13 tests (10 derived + 3 catalog). Temporary fixtures verify two refreshes,
  conflict hashes, custom descendants/settings, copied output advancement, broken
  links, ownership-only pruning, custom index preservation, malformed metadata,
  symlink ancestors, direct custom skills, and exact mirror regeneration.
- `node .agents/scripts/test/test-hooks.js`: PASS, 21 assertions.
- `node .agents/scripts/build-skill-index.mjs --check`: PASS, 9 hot + 61 cold.
- Coordinator separately reported full installed-fixture integration passing through
  two source upgrades, with protected data, edited adapter/index/hooks and pack
  baseline retained. Slice A integrated the read-only preflight CLI.

One early test invoked the original index generator before it supported `--root`.
It regenerated the source index incidentally; the index was restored byte-for-byte
from the coordinator's pre-change snapshot, and the read-only source check passed.
No generated ownership state remains in the source workspace.

## Limits / review points

- Conservative legacy state can leave old hot duplicates or hook groups in place;
  this is intentional and reported rather than inferred/adopted.
- Ownership state and file writes are individually atomic, not a global transaction.
  A failure between output write and state persistence leaves an unverified output
  conservatively preserved on retry.
- Removed upstream copied files remain installed unless an explicit safe `--clean`
  removes their unchanged recorded outputs. Custom descendants remain throughout.

## R1 corrections for incremental R2

Resolved REL-001 (High) and SPEC-001 (Medium). Corrective-only patch:
`review-r1-corrections.patch` (reconstructed immediately from the bounded inverse
of the exact fixes; includes only the two generator files and new test cases).

- REL-001: canonical manifest path is a POSIX literal; adapter registry/output/source
  joins and index catalog/skill registry joins explicitly use `path.posix`.
  Native filesystem resolution, absolute destination handling and filesystem helper
  paths remain platform-native. A test simulates Windows native joins in both
  generator entry points and verifies copied adapter output provenance and index
  references contain normalized forward-slash paths.
- SPEC-001: adapter `--validate-only` now validates each selected harness's planned
  output directory parents, including surfaces whose source skills/commands have
  not arrived yet. Symlink ancestors and nondirectory parents fail before source
  sync. The same check runs before ordinary generation. Explicit safe clean still
  validates only its owned manifest paths.

Before correction, both new tests failed: preflight returned success for an outside
`.cursor` symlink; simulated Windows generation failed on
`.agents\\harness-manifest.json`. After correction:
`node --test .agents/scripts/test/test-derived-updates.mjs .agents/scripts/test/test-catalog.mjs`
PASS (15 tests: 12 derived + 3 catalog), and source index `--check` PASS.
Actual Windows/PowerShell execution remains environment-dependent; this host ran
the portable Windows-path simulation, not a native Windows session.
