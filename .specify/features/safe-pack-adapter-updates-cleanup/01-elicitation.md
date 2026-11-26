# Elicitation: Safe updates and cleanup

## Confirmed intent

- Complete update handling for selected packs and adapters.
- Remove application-specific scripts, generated HTML and redundant content.
- Test updates/reinstalls and preserve user-customized data.
- Report briefly; no commit/push, external deployment or global configuration change requested.

## Repository evidence

- Optional packs are copied separately by installers; selection/source-target
  mappings are not persisted as a complete update registry.
- Update apply uses the core ship list, refreshes hooks/index, but not the full
  selected-pack/adapter lifecycle. Fresh metadata may start with an empty manifest.
- Existing copied skill adapters are skipped. Marker-bearing generated adapters
  can be rewritten without verifying whether the user edited them.
- Hot/cold pruning removes same-name hot directories without content comparison.
  Hook regeneration also needs to distinguish generated content from custom changes.
- Cleanup inventory: 12 app capture scripts (5892 lines), one app extension helper,
  five generated Archify example HTML files (3815908 bytes), equal catalog copies,
  and duplicate Archify example/reference copies.

## Decisions confirmed by owner at Gate 1 (2026-11-26)

- ASM-UPD-001: Update only core and explicitly selected/verified installed packs;
  persist IDs/source-target mappings and hashes. Do not infer selection solely
  from present folders or silently add packs during update.
- ASM-UPD-002: Refresh files only with evidence of framework ownership and no
  local change; preserve custom/unbaselined files and report unresolved conflicts.
  Missing/invalid metadata or unsafe paths must not silently reset trust or write
  outside the workspace. Post-processing is subject to the same safeguards.
- ASM-UPD-003: Cleanup removes source/distribution artifacts, not arbitrary files
  in existing customer projects. Preserve local custom/legacy copies; no automatic purge.
- ASM-UPD-004: Keep one authoritative catalog/content source; generated deployment
  mirrors may remain when needed at runtime. Deduplicate Archify content only
  after valid local references/distribution are maintained; keep its renderer,
  canonical JSON data and general screenshot workflow.

No actual data, configuration or source implementation has been changed here.
