# Independent review — round 1

Verdict: CHANGES REQUIRED. No Critical findings.

Scope: only `review-change.patch` against the saved before snapshot, plus retained consumers and relevant tests. No cumulative Git diff or implementer reports used. Reviewed signed baseline and requirements section 4. Source and Git were not modified.

## High

### R1 — Retained Git workflow still blocks text-only guides

- Location: `.agents/skill-library/engineering/git-workflow/SKILL.md:59–64` (retained consumer of the changed `/command-user-guide` workflow).
- Evidence: the active skill requires a guide for every UI feature, requires real Playwright screenshots with red callouts, and says `STOP IMMEDIATELY` when a guide is text-only. It then routes to `/command-user-guide` to capture screenshots, while that command now delegates to a text-only skill that prohibits capture. A compliant text-only guide can therefore never satisfy this retained shipping gate.
- Acceptance: section 4 requires no browser/server/capture/annotation tooling or per-feature screenshot gate. The signed baseline explicitly removes screenshots from guide production while retaining separate UI/E2E evidence.
- Fix: replace this guide screenshot gate with the approved requested/release-selected text-guide behavior; keep genuine UI review/E2E evidence separate. Align the still-UI-triggered user-guide checkbox at `.agents/skills/engineering/command-git-push/SKILL.md:126` with that same selection condition. Add a focused regression check covering the retained Git workflow: the current cleanup check only rejects the retired skill name/path, so this contradictory gate passes it.

## Pass A — Security and standards

No additional actionable security findings in this incremental change. Setup preserves confirmed selections, verified source mappings, project-local activation and explicit custom-data handling. No new runtime dependency or Git write was introduced by the patch.

## Pass B — Acceptance fidelity

R1 prevents full acceptance. Other inspected behavior matches the approved merges: 50 identities, 9 hot/41 cold; on-demand agent-writing reference; read-only debt ledger with ceiling/upgrade/no-trigger; thin guide router and preservation boundaries. Repeated-update fixture checks installed retired identities with both unchanged and customized copies, a customized new guide skill, selected pack, adapter, hooks/settings, domain content, guide/image assets and legacy scripts over two upgrades.

## Pass C — Lean

No additional actionable complexity finding. The retained workflows use compact routers/references and remove the source capture tooling rather than replacing it with another implementation.

## Independent verification

- `node .agents/scripts/build-skill-index.mjs --check` — pass, 9 hot + 41 cold.
- `node --test .agents/scripts/test/test-catalog.mjs` — 3 passed.
- `python3 .agents/scripts/test/test-distribution-cleanup.py` — 4 passed.
- `python3 .agents/scripts/test/test-workflow.py` — 3 passed.
- `python3 .agents/scripts/test/test-local-instructions.py` — 4 passed.
- `python3 .agents/scripts/test/test-update-integration.py` — 2 passed, including both preservation upgrades.

These passing tests do not cover R1. Installer/Windows execution was not independently repeated in this review.
