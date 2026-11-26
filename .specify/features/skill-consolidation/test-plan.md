# Verification plan

| Acceptance | Evidence |
| --- | --- |
| REQ-SKILL-001: 53 unique identities, source retirement and retained wait-what | test-workflow.py; generated index --check |
| REQ-SKILL-002: merged navigation, audit scopes and UI guidance | Independent review rounds, source reference/link checks |
| REQ-SKILL-003: catalog mirrors, source/deployed links, onboarding | test-catalog.mjs; test-local-instructions.py; validate-agents.py |
| REQ-SKILL-004: older inventory -> retirement -> two revisions | test-update-integration.py; test-installers.py; update-engine and derived-output suites |
| BR-SKILL-002: immutable history and retained source bytes | implementation/preservation-check.json |

Integration installs all 16 legacy identities from synthetic older source trees, customizes alternate installed copies, removes the source trees, then runs two new revisions. It checks both unchanged and customized legacy copies, ownership hashes, customized wait-what, pack, adapter, index, settings, hooks, domain data and cache. Untouched source siblings advance. Fresh full-source Bash install/reinstall checks the retired identities are absent and wait-what is available. No real customer workspace or global configuration is used.
