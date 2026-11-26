# Acceptance test plan: Download-only distribution

Status: planned, not executed. Source: requirements.md §4.

| Case | Story | Input/action | Expected result | Evidence |
| --- | --- | --- | --- | --- |
| TC-001 | US1 | Inspect repository/package inventory after removal | No UAW MCP source, package-only dependencies or generated runtime | Filesystem and dependency/reference scan |
| TC-002 | US1 | Compare third-party integration config/catalog before and after | Retained unchanged | Scoped diff/hash |
| TC-003 | US2 | Fresh install and reinstall into temporary projects from current source | Local skills/artifacts available; no UAW MCP dependency | Actual installer process output and file assertions |
| TC-004 | US3 | Complete confirmed requirements, domain rules and linked happy/edge scenarios | Eight-criterion semantic review and intact traceability recorded; no certification claim | Procedure walkthrough |
| TC-005 | US3 | Remove, empty or make an input unreadable; leave placeholder-only content | Explicit blocking finding, no empty-string fallback and no PASS | Negative-scenario procedure review |
| TC-006 | US3 | Leave ASM unconfirmed; separately leave an unrelated task checkbox open | ASM blocks PASS; a task checkbox alone is not inferred to be an assumption | Negative-scenario procedure review |
| TC-007 | US3 | Remove a story's acceptance scenarios or leave a REQ without applicable story coverage | IDs and missing criteria/coverage reported; no PASS | Negative-scenario procedure review |
| TC-008 | US3 | Use duplicate IDs or point Derived from/Traces to at absent BR/REQ/US | Specific traceability blockers reported; no PASS | Negative-scenario procedure review |
| TC-009 | US4 | Run existing installer safety/hook regressions | Preserve user data/metadata; stop safely on missing prerequisites/engine failure | Regression output; skipped pwsh cases reported separately |
| TC-010 | US5 | Review active setup docs and generate adapter in temporary tree | File-based setup only; old accepted ADR unchanged and successor indexed | Reference scan, generated output and scoped diff |

Validator cases evaluate the agent instruction's defined decision path. They
must not be reported as executable parser tests or proof that every future LLM
response follows the instructions. If a prescribed decision is ambiguous, fix
the skill and repeat the affected review rather than marking it passed.

Planned commands: python3 .agents/scripts/test/test-installers.py;
node .agents/scripts/test/test-hooks.js; bash -n install.sh; git diff --check.
Smoke/adapter checks operate on temporary directories and do not install
software, publish changes, access private services or execute a remote installer.
