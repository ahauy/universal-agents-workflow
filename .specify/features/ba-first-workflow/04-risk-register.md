# Risks and scope: BA-first workflow

| Risk | Impact | Mitigation |
| --- | --- | --- |
| RISK-BA-001: partial renaming leaves broken routes/old bypass rules | High | Inventory active references, update catalog and test routing cases |
| RISK-BA-002: BA ceremony expands for trivial work | High | Fast checkpoint in chat, no feature folder/subagents, reuse confirmed evidence |
| RISK-BA-003: technical planner invents business defaults | High | Signed baseline inputs; unresolved decisions return to BA |
| RISK-BA-004: upgrade damages custom skills or historical specs | High | Keep installer safety; compatibility notices; immutable historical artifacts |
| RISK-BA-005: cost reduction is asserted without billing evidence | Medium | Label character estimates, token availability and semantic-review limitations |

ASM-BA-001..003 confirmed by owner approval in 01-elicitation.md. No open assumptions.
Contradictions identified there are implementation targets, not accepted exceptions.

Must: BA checkpoints in both lanes, UAW-native planning, coherent roadmap and
skill names, valid order/paths, existing safety and scoped regression evidence.
Should: migration guidance/aliases and a clear successor ADR.
Could: none requested.
Won't: new execution framework/CLI, billing telemetry integrations, invented price
or spending thresholds, new runtime/dependencies, unrelated cleanup or Git writes.
