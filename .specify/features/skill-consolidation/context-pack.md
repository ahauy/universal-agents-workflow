# Scoped context

Feature: skill-consolidation. Baseline SIGNED-OFF; Gate 2 plan/tasks approved by explicit owner request to implement reviewed proposals, except keep wait-what.

REQ-SKILL-001..004 and BR-SKILL-001..002: retire 16 source identities (10 speckit-*, ponytail-gain/help/audit, route, frontend-design, ui-taste-pro); preserve wait-what bytes and signed history. Final inventory 53 (9 hot/44 cold). Merge route into skills-index, audit into ponytail-review, UI direction/stack-aware design anchor/checklists into retained marketing/product owners. Retain unique functionality and contextual loading. Do not change updater no-deletion logic or delete customer/global files.

UI slice owns only frontend-design, ui-taste-pro, design-taste-frontend/product trees; frontend-developer + ui-ux-reviewer agents; UI references in .agents/docs/reading-map.md and skills-cheatsheet.md.
Navigation/lean slice owns skills-index, ponytail-review; deletes speckit-* and ponytail-audit/gain/help and productivity/route; owns remaining non-UI docs and README (not reading-map/skills-cheatsheet), setup-workspace/handoff/grilling references if needed. Never modify historical feature folders/accepted ADRs or wait-what.
Coordinator owns generator, tests, inventory, catalog and this feature artifacts. Shared catalog JSON changes only if required, not by slices.

Verification: 53 unique skills; no active dangling references; wait-what and all prior history unchanged; source absence and repeated-upgrade custom retired/retained file preservation; existing installer/update/derived tests pass.
