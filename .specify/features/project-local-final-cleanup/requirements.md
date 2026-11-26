# Requirements

## 1. Business context

Owner-approved follow-up to the final audit and completed parts 1–5. Project-local
workflow only; remove obsolete functionality and synchronize active guidance.

## 2. Product behaviour

BR-LOCAL-001: Removal affects framework source/distribution, never custom customer
files/global installations or immutable signed history. BR-LOCAL-002: Explicit
pack activation uses registered mappings/last-written hashes, not blind copying.
BR-LOCAL-003: Verification follows selected lane and reports errors honestly.

## 3. Requirements

- REQ-LOCAL-001: Remove Archify active runtime, optional wrapper, catalog/router/
  docs instructions and tests requiring that runtime; keep Mermaid diagrams.
- REQ-LOCAL-002: Remove approved group A cache, duplicate metrics state and named
  old handoff, plus global sync script; preserve task logs and signed history.
- REQ-LOCAL-003: Fix skill setup to activate via safe engine/cold catalog mappings;
  repair actual broken links in active instructions and shipped optional rules.
- REQ-LOCAL-004: Make verification lane-aware; generic screenshot workflow derives
  actual project URL/commands and fails on unsuccessful actions, with cleanup.
- REQ-LOCAL-005: Repeat install/update tests preserve custom skills/hooks/config,
  including retained customized legacy Archify files; independent review zero Critical.

## 4. User stories and acceptance

US-LOCAL-001: As owner I use only project-local UAW without Archify/global sync:
source/catalog/guidance do not require them; fresh distribution omits them.
US-LOCAL-002: As user I add selected packs and verify bounded Fast or Full work
with accurate guidance, errors and links; old customized data survives two updates.
Acceptance: test suite green/explicit skips, source scan allows Archify only in
immutable historical artifacts and negative preservation assertions, catalog/index
valid, known group A/B paths absent, signed historical hashes unchanged.
