# Test-fix evidence

- Removal tests first failed on present cache/runtime, then passed after approved cleanup.
- Instruction tests first exposed link/layout/lane errors, then four passed after fixes.
- Screenshot tests first failed five error/cleanup cases; all seven now pass.
- Replaced runtime-dependent fixture data with small independent skill/resource data;
  preserved prune/copy/Windows-path coverage instead of deleting those regressions.
- Two-update integration additionally preserves customized retired-tool/helper files.
- Final: Python 40 pass / 3 pwsh skips; Node test suites 22 pass; hook assertions 22 pass.
- Independent Round 1 APPROVE, zero findings; no corrective review round required.
- 78 previous feature/ADR artifacts preserved byte-for-byte, mutable indexes updated.
