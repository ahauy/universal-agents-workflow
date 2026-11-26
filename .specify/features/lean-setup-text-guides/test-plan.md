# Verification plan

| Acceptance | Evidence |
| --- | --- |
| 50 identities; 4 old owners retired, user-guide added | test-workflow.py; generated catalog check |
| Safe setup/authoring/debt behavior transferred | test-local-instructions.py; independent semantic review |
| Text-only short command, no capture source/template | test-distribution-cleanup.py; active instruction routing check |
| Fresh install/reinstall has new owners and preserved domain data | test-installers.py |
| Two revisions preserve customized retained/retired skills, scripts, guide and binary image | test-update-integration.py |
| Derived adapter/index/hooks and provenance safety unchanged | test-derived-updates.mjs; test-update-engine.py; test-hooks.js |
| Catalog mirrors/source links, unchanged history and wait-what | test-catalog.mjs; preservation-check.json; local link audit |

The upgraded integration fixture installs 20 legacy identities (16 previously retired plus four current), customizes alternate files, then removes source trees and performs two revisions. It checks original ownership hashes, modified new user-guide and wait-what, a custom guide with an existing image reference, PNG bytes and retired capture scripts, plus existing pack/adapter/hooks/domain fixtures. No real customer workspace or global configuration is touched.
