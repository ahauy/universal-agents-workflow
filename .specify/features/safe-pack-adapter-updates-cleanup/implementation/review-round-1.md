# Adversarial Code Review Report (Round 1/3)

**Verdict: WARNING — two concrete findings require correction.**

Scope: parts 4–5 feature delta against the pre-change snapshot specified in
`review-scope.md`; earlier parts 1–3 treated as baseline. Read-only independent
review, with separate A (standards/security), B (requirements/AC), and C (lean)
passes. Implementer reports and reasoning were not read. Findings describe the
code inspected before the coordinator dispatched their corrections; Round 2
must verify the corrective delta rather than treating this report as current
post-fix status.

## Severity matrix

| Severity | Pass A | Pass B | Pass C | Open at review |
| --- | ---: | ---: | ---: | ---: |
| Critical | 0 | 0 | 0 | 0 |
| High | 1 | 0 | 0 | 1 |
| Medium | 0 | 1 | 0 | 1 |

## [SECURITY]

No demonstrated outside-root write, custom-content overwrite, or Critical
security finding in the reviewed delta. Unsafe adapter ancestors were rejected
when adapter planning ran; the timing defect is recorded below.

## [SPEC_FIDELITY]

### [MEDIUM] [SPEC-001] [PASS B] Adapter preflight omits planned destination ancestors

Locations:

- `.agents/scripts/sync-harnesses.mjs:609`
- `.agents/scripts/update-engine.py:552`
- `.agents/scripts/update-engine.py:553`

Issue: adapter `--validate-only` exits after ownership-state validation, before
planning adapter destinations. An unsafe ancestor absent from the old manifest
therefore passes engine preflight and is detected only after core/pack writes.

Why: V09/AC-04 requires unsafe source/target mappings to be rejected before any
write. Reproduced with a temporary source containing the current six update/
derived scripts and AGENTS.md, an empty target, and `target/.cursor` symlinked
to an outside directory. `update-engine.py --sync --yes` wrote AGENTS.md and six
scripts, then reported `Symlink path rejected: .cursor/rules/00-uaw.mdc` and exit
1. The outside directory remained empty, but target bytes had changed before
the unsafe destination was rejected.

Fix: preflight prospective adapter destinations and their ancestors, including
new paths with no ownership record, before engine synchronization starts.
Preserve custom link leaves; distinguish them from unsafe traversal ancestors.
Add an engine-level regression asserting target and outside sentinels remain
unchanged when an unrecorded adapter ancestor is a symlink.

## [RELIABILITY]

### [HIGH] [REL-001] [PASS A] Platform-native joins violate normalized ownership paths on Windows

Locations:

- `.agents/scripts/sync-harnesses.mjs:39`
- `.agents/scripts/sync-harnesses.mjs:602`
- `.agents/scripts/build-skill-index.mjs:184`
- `.agents/scripts/build-skill-index.mjs:185`
- `.agents/scripts/derived-state.cjs:8`

Issue: new ownership validation requires slash-separated relative identifiers,
but callers continue constructing identifiers with platform-native `path.join`.

Why: on Windows, `MANIFEST_REL` becomes `.agents\\harness-manifest.json` and
`ownership.load` immediately rejects it. Engine adapter preflight consequently
fails for every normal Windows install/update, including PowerShell installation,
before source synchronization. Index skill traversal has the same mismatch.
Reproduced the deterministic boundary on this host using `path.win32.join`:
ownership.relative rejects both `.agents\\harness-manifest.json` and
`.agents\\skills\\engineering` with `Unsafe relative path`. Native Windows
execution was unavailable because `pwsh` is absent.

Fix: use `path.posix.join` or canonical `/` strings for repository-relative
ownership identifiers and metadata; reserve native joins for absolute filesystem
paths. Audit all relative-path call sites in both generators, not just the first
manifest failure. Add platform-independent win32 regression coverage and run
native Windows tests when available.

## [ARCHITECTURE]

No additional independently actionable architecture finding.

## [LEAN]

The shared derived ownership helper removes repeated trust/write logic;
validation and atomic writes protect preservation requirements. No defensible
cut identified in the feature delta. Lean already. Ship after findings resolve.

## Verification evidence and limits

- `node .agents/scripts/test/test-derived-updates.mjs`: 10 passed.
- `node .agents/scripts/test/test-catalog.mjs`: 3 passed.
- `python3 .agents/scripts/test/test-update-engine.py`: exit 0; includes the
  newly corrected trailing-slash marker regression. That coordinator-reported
  issue was already corrected and is not an open finding here.
- `python3 .agents/scripts/test/test-distribution-cleanup.py`: 3 passed.
- `python3 .agents/scripts/test/test-update-integration.py`: 1 passed, including
  repeated local upgrades, custom bytes, selected packs, and installed Archify demo.
- `python3 -m unittest discover -s .agents/scripts/test -p 'test-*.py'`:
  collected zero tests on this host. Direct invocation was used above; discovery
  is not counted as passing test coverage.
- Explicit temporary symlink/preflight fixture and win32-path validator probe
  reproduced SPEC-001 and REL-001 respectively.
- No real browser screenshot or native PowerShell/Windows execution was claimed.

Round 1 identified zero Critical findings, one High, and one Medium. This is
not evidence that the in-progress corrections are verified; review those exact
changes in Round 2.
