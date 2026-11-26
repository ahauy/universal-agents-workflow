# Slice A: onboarding and instruction consistency

Implemented REQ-LOCAL-003 and the lane-aware instruction portion of
REQ-LOCAL-004 within the assigned source files.

- `command-skill-setup` now resolves a verified source checkout and invokes the
  existing update engine with explicit approved catalog source-to-target mappings.
  It preserves cold skill destinations, engine-owned selected-pack registration
  and last-written hashes, reports retained/conflicted/unavailable results, and
  prohibits manual ownership adoption and implicit pack detection. Removed global
  diagram-tool installation and cross-project MCP auto-configuration instructions.
- `setup-workspace` delegates activation to that same path, fixes the catalog link
  and reuses confirmed tracking choices instead of inferring them.
- `verification-before-completion` separates Fast chat acceptance/tests/self-check
  from Full signed baseline, approved plan, scoped traceability, review and feature
  documentation. Diagnostic tests remain permitted when approval is missing.
  Removed assumed monorepo/Prisma commands and unrelated product algorithms.
- React/TypeScript optional rules no longer claim inheritance from unshipped
  common/TypeScript paths; valid sibling navigation remains. E2E lookup uses the
  cold catalog rather than a nonexistent sibling skill path.
- Harness/token guidance records project-local registered pack activation,
  hot-only fan-out and cold lookup, and avoids stale hand-counted command totals
  or claims about the current user's global MCP configuration.

## Verification

Added `.agents/scripts/test/test-local-instructions.py` before fixes. Initial run
failed on activation/verification guidance and broken links (36 assertions plus
the missing Fast section). After fixes:

`python3 .agents/scripts/test/test-local-instructions.py` — 4 tests PASS.

Tests inspect the real onboarding and lane contracts, resolve instruction links,
and copy actual React/TypeScript packs using catalog destinations into a temporary
deployment before validating every local rule link in both source and deployed
layouts. No dependencies installed; no global/customer files touched. Future
project feature documentation placeholders are not mistaken for template links.

Self-check: no Critical findings in this slice; no catalog/index edits, global
installation changes or Git mutations. Coordinator owns whole-repository checks,
source index regeneration and final independent review.
