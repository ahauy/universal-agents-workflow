# Project-local final cleanup

**Type:** Technical reference. **Date:** 2026-11-26.
**Status:** Implemented and verified; independent Round 1 APPROVE.

## Current behaviour

UAW installs per project. Diagrams use Mermaid; retired diagram tooling and global
sync helper are absent from current source/catalog. Existing customer files are
preserved by the same safe updater, not removed as part of source retirement.

Pack onboarding now resolves explicitly selected catalog source_path/target_path
pairs and runs the source engine with --sync --extra-ship. It does not blind-copy,
edit registry hashes or promote cold skills. Verification follows Fast/Full gates;
Fast does not create Full artifacts. Generic screenshot capture uses project setup,
fails on erroneous/unsupported actions and closes the browser before exit.

## Files and decisions

See [requirements](requirements.md), [technical design](spec.md),
[test coverage](test-plan.md), [acceptance report](acceptance-report.md), and
[ADR 0005](../../../adr/0005-project-local-mermaid-workflow.md).
[Removal inventory](implementation/removal-inventory.json) records 114 removed
source/transient files, 3,560,531 bytes. No home/global uninstall was run.

## Verification and recovery

Existing-project custom data, including legacy retired-tool files, is kept through
repeated updates. Missing selected source is reported unavailable, not deleted or
adopted as a new baseline. Never delete ownership metadata to force an overwrite.
Source index/catalog maintenance uses temporary generated output and explicit
source mirror generation; target ownership protection remains unchanged.

PowerShell execution is unavailable on this host; three tests are explicitly
skipped. Screenshot tests mock Playwright, not a live unrelated application.
Archived feature reports/ADRs describe their accepted historical state; this feature
and ADR 0005 supersede the previous optional visual-tool retention prospectively.
