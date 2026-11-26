# Test / fix log

## Cleanup slice

- RED: test-distribution-cleanup.py failed all three tests before cleanup: shipped
  app scripts, rendered example HTML, duplicate optional Archify resources.
- GREEN: same three tests passed after removal/ref repairs, including rendering
  five diagrams and demo from retained JSON/runtime into temporary directories.
- Removed 26 files / 4,096,850 bytes; exact paths in cleanup-inventory.json.

## Integration, in progress

- RED: full-source fixture test-update-integration.py rejected the real catalog
  because alternative language persona packs share .agents/agents roots.
- Sent root cause to slice A: compare expanded file ownership rather than rejecting
  shared directory roots whose leaf files do not collide. Preserve duplicate-file
  rejection. All changes remain within approved safety requirements.

## Integration resolution and review

- Full-source fixture: shared directory roots fixed via expanded-file collision
  checks; direct custom cold skill scanning fixed; repeated integration green.
- Actual Bash catalog detection exposed trailing-slash directory marker; three
  regressions red then green; full-source Go fresh/reinstall permanent test green.
- R1 REL-001 High: normalized Windows registry paths. R1 SPEC-001 Medium:
  prospective adapter parents validated before core writes. Both targeted tests
  failed before fixes; Node derived suite now 12 green.
- Added actual engine-level preflight sentinel assertion; integration now two green.
- Installer unconditional success wording corrected and tested against partial case.
- R2 incremental review APPROVE, both findings resolved; no new findings.
- Final: Python 36 pass +3 pwsh skips; Node 36 pass; index/agent/syntax checks pass.
- Planning command correction: unittest discover collected 0 due hyphenated names;
  ran every Python test script directly. Validator is validate-agents.py.
