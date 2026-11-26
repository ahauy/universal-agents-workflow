# Acceptance plan: BA-first UAW

Status: evaluated; results and limits are recorded in acceptance-report.md.

| Case | Requirement | Scenario | Expected result |
| --- | --- | --- | --- |
| TC-001 | 001/002/007 | Clear typo, config edit or technical bug with confirmed existing behavior, no risk | Concise intent/impact/AC checkpoint; Fast, one context, no Full folder |
| TC-002 | 001/002 | Small change introduces new business behavior or unresolved formula/state/permission decision | Full business trigger applies; no code before decisions/baseline |
| TC-003 | 002/004 | Roadmap S/M story includes auth, sensitive data, breaking schema or a new entity | Existing risk trigger still selects Full; no size/roadmap bypass |
| TC-004 | 003/004 | Existing signed-off evidence answers most questions | Reuse it; ask only material gaps, never repeat a fixed questionnaire |
| TC-005 | 003/004 | Only platform/auth/billing preferences supplied, domain journeys/rules still unknown | Clarify domain scope before deriving stories/AC; no invented defaults |
| TC-006 | 002/004 | Story is blocked or Depends-on is incomplete | Resolve explicit blocker/retain dependency gate before implementation |
| TC-007 | 003/007 | More material unknowns remain after a short interview batch | Continue targeted batches, no fixed total cap or guessed answers |
| TC-008 | 005 | Business evidence ready but no technical spec/plan/tasks yet | Business review can run; technical consistency waits for actual downstream artifacts |
| TC-009 | 005/006 | Approved baseline enters native planning | Local technical spec/plan/tasks use one feature folder and trace confirmed business intent |
| TC-010 | 006 | Resolve current routes and legacy names in downloaded tree | Canonical files exist; legacy stubs redirect or retire explicitly; no upstream scripts/runtime required |
| TC-011 | 007 | Measure catalog and inspect task telemetry without billed usage | Hot entry count remains 9; cold/on-demand behavior retained; estimates/unknown money labelled |
| TC-012 | 008 | Run install/reinstall and prior regression suites | Preserve safety, metadata, customized content, previous accepted history and external MCP configuration |

Lane/BA/artifact cases are semantic decision-path reviews, not executable proof
of future model obedience. Structural checks validate real skill inventory,
paths and active runtime dependencies; hook tests execute supported payloads.
Do not write keyword-only tests and present them as business reasoning tests.

Planned checks: node .agents/scripts/build-skill-index.mjs --check;
python3 .agents/scripts/validate-agents.py; node .agents/scripts/test/test-hooks.js;
python3 .agents/scripts/test/test-installers.py; additional scoped workflow checks;
node .agents/scripts/measure-skill-index.mjs; syntax/link/whitespace checks.
Run full-source local fresh/reinstall/adapter smoke checks in temporary projects;
no remote services, runtime installation, publication or Git writes. Report pwsh skips.
