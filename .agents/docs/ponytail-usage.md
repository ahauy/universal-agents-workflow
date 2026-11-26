# Ponytail quick reference

Read this page on demand; it is documentation, not a separate skill.

| Request | Behavior |
| --- | --- |
| `/ponytail lite` | Implement the requested solution and mention a simpler alternative when useful. |
| `/ponytail full` | Apply YAGNI → existing code → stdlib → native → installed dependency → minimum code. This is the default. |
| `/ponytail ultra` | Challenge speculative additions before implementing the smallest confirmed scope. |
| `/ponytail-review diff` | Read-only review of the requested changes for unnecessary complexity. |
| `/ponytail-review repo` | Read-only whole-repository audit, ranked by justified cuts. |
| `/ponytail-review debt` | Report deliberate `ponytail:` shortcuts with their ceiling and upgrade trigger. |

A selected level lasts for the session until changed. Say `stop ponytail` or
`normal mode` to deactivate it; invoke `/ponytail` to resume. Never simplify away
input validation, data safety, accessibility or confirmed acceptance criteria.

These are agent instruction requests. Cold skills are loaded by reading their
catalog path; actual slash-command availability depends on the installed harness.
There is no framework runtime promise to load environment variables or a global
configuration file to select a level. No global configuration is needed.

Review findings include location, one of `delete:`, `stdlib:`, `native:`, `yagni:`
or `shrink:`, the suggested replacement and evidence that consumers remain safe.
An audit proposes changes; it does not authorize deletion. Preserve user-modified
skills and data during updates, including installed copies no longer shipped.

External benchmark figures are not measurements of this project. The metrics
script records task evidence; actual token/cost claims need provider telemetry.
