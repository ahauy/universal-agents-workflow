# Verification plan and observed evidence

- REQ-LOCAL-001/002: cleanup tests require removed tool/catalog/global helper/group
  A paths absent. Scan active source/docs (exclude archived ADR/features and negative
  preservation assertions); source catalog byte mirror and index check pass.
- REQ-LOCAL-003: four local instruction checks: registered explicit mapping/cold
  activation, lane branch, source links and actual catalog-deployed React/TS links.
- REQ-LOCAL-004: seven mocked Playwright cases: failed action, unknown action,
  navigation/screenshot/context errors, supported actions and element selector.
  Verify nonzero error exits, no success output and browser close. No browser install.
- REQ-LOCAL-005: existing update/installer/derived suites plus full-source Go fresh/
  reinstall and two-update fixture preserving custom data, legacy retired tool files,
  source-removed files and no baseline adoption. Compare 78 old historical artifacts.
- Hooks: 22 guard assertions including cache isolation; root cache remains absent.
- Review: fresh independent A/security B/fidelity C/lean, maximum three rounds;
  no unresolved Critical at delivery. Platform skips explicitly reported.
