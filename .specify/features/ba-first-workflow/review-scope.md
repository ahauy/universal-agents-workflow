# Independent review — Round 1

Read .agents/agents/code-reviewer.md and inspect the current scoped source
against requirements.md section 4 and the acceptance criteria below. Do not
read implementer slice reports or prior conclusions before forming findings.

Gates 1/2 were approved. User wants UAW-owned execution with BA proportional to
Fast/Full, no missing upstream runtime, grounded roadmap, coherent names/stages,
controlled context overhead and preserved earlier safety/history.

## Review evidence boundaries

Before-task source copies and hashes are in:
/var/folders/s0/d9pljvh53_ggyt5lchb9gsqc0000gn/T/uaw-ba-first-gq33eg46/before

review-files.json lists changed source paths relative to that snapshot, plus
new files. Use it or direct file reads to avoid reviewing prior user changes
against Git HEAD. Existing installers/update-engine were not changed in this
request; previous accepted features/ADRs are immutable. Do not reopen unrelated
existing findings outside the approved file families.

## Acceptance focus

- BA checkpoint for all implementation requests; material unknowns block code.
- Fast for clear bounded existing behavior/no risk; new/unclear business behavior
  (T7) and existing T1-T6 triggers select Full even on small roadmap stories.
- Reuse confirmed answers. Roadmap depends on confirmed journeys/rules/AC;
  no fixed question total, invented business defaults or roadmap bypass.
- UAW requirements owns intent; spec owns design. Business consistency before
  baseline; technical consistency only after downstream spec/plan/tasks exist.
- Four native cold skills and ten small legacy stubs resolve locally. No
  upstream runtime/scripts or executable workflow registration is required.
- Fast stays one context/no Full folder; existing budgets and safety/approval
  gates remain. Estimated context figures are not measured money savings.
- Catalog, actual payload hooks and safe install/reinstall remain usable.

## Requested output

Run standards/security/reliability, spec-fidelity and lean passes. Report only
concrete actionable findings with file/line, severity and consequence, plus
execution limits. Write only this feature's review-report.md; no source or Git
edits. Up to three rounds; later reviews inspect only actual corrective deltas.

Documentation links in .specify/templates are relative to their instantiated
feature directory; assess them in that intended context. Prior signed feature
records and legacy migration names are intentional history/compatibility, not
active upstream execution instructions.
