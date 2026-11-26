# Slice B: screenshot workflow and test isolation

Implemented REQ-LOCAL-004 / BR-LOCAL-003 in the approved scoped files.

- Capture script throws on unsupported actions and rethrows failed supported
  actions, preventing capture/success reporting for that step. Browser close is
  in finally around context creation, navigation, actions and capture.
- Command/guide/setup instructions derive the package, package manager, command
  and URL from target project evidence. Removed fixed web-workspace/port install
  assumptions and the unsupported automatic AGENTS gate claim. Corrected the
  command-to-cold-skill link.
- Annotation requirement is retained with truthful instructions: generic script
  does not inject highlights/badges; use browser automation before capture or
  annotate real images afterward and inspect them.
- Hook test subprocesses use scratch cwd and WORKSPACE_ROOT. Removed deletion of
  the real session cache and restore any inherited UAW_CONTEXT_ALWAYS value.

## Evidence

Added `.agents/scripts/test/test-capture-screenshots.mjs`: temporary mocked
Playwright package, no package installation or actual browser dependency.
RED before fix: five failures (action/unknown returned zero; navigation/capture/
context errors skipped browser close), two successful paths passed.
GREEN after fix: 7/7 screenshot tests passed; hook suite 22/22 passed.

Commands:

- `node --test .agents/scripts/test/test-capture-screenshots.mjs`
- `node .agents/scripts/test/test-hooks.js`

Self-check: no new runtime dependencies, Git writes, global changes or fabricated
screenshots. Real-browser behavior is not exercised by this mocked regression;
visual QA remains a guide-generation step as documented. No unresolved Critical
finding in this slice. Existing unrelated screenshot cleanup changes were left
intact.
