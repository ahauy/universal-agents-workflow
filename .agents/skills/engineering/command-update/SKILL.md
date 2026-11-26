---
name: command-update
description: "Update the framework through the 3-Way Hash engine; protects project data and user-added skills (Zero Deletion Policy)."
triggers:
  - /update
  - /upgrade
  - /command-update
  - check update
  - cập nhật framework
  - có bản cập nhật không
---

# command-update — Safe framework update

Update core and explicitly selected packs while preserving project data and custom
files. Read [.agents/docs/smart-update-guide.md](../../../docs/smart-update-guide.md)
for the comparison and recovery rules. Never delete metadata to force an update.

## Execution

1. Inspect `.agents/workflow-source.json` and protected paths. Missing legacy
   ownership is not permission to adopt/overwrite files; malformed metadata or
   unsafe mappings must stop unsafe writes.
2. For check-only requests run `python3 .agents/scripts/update-engine.py --check`.
   Checking a version does not prove adapters/hooks were refreshed.
3. For an authorized update run
   `python3 .agents/scripts/update-engine.py --apply --target .`.
   Noninteractive `--yes` keeps conflicts; never silently select new packs.
4. Report actual file outcomes, kept/unverified conflicts, unavailable packs and
   failed/unrun phases. Do not turn a partial result into unconditional success.
5. If a prerequisite or postprocessing phase failed, explain the prerequisite and
   safe retry. Do not blind-copy around the engine or execute locally modified
   target generators as trusted update code.

## Preservation contract

Protected domain data, signed-off features/ADRs, user-added skills/files and local
config remain. Only validated, unchanged framework-owned output refreshes; kept
custom content never becomes a new overwrite baseline. Index/tier normalization,
copy/symlink adapters and hook groups obey the same rule. No name-only hot/cold
pruning, marker-only overwrite or automatic purge of removed upstream files.

Install metadata records pack choices/mappings and hashes of successful writes.
Legacy pack selection requires explicit confirmation; missing source preserves
installed files and is reported. The catalog authority is
`optional-stack-skills/catalog.json`; `.agents/catalog.json` is a runtime mirror.
No global configuration, dependency installation or Git writes are implied.
