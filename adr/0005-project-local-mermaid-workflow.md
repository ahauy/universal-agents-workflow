# 0005: Project-local workflow and Mermaid diagrams

- **Status:** Accepted
- **Date:** 2026-11-26
- **Decision authority:** explicit owner approval of final-audit corrections and
  removal of group A/B plus all active Archify components.
- **Supersedes:** ADR-001 optional visual-enhancer/dual-asset allowance only;
  its Mermaid diagram requirement remains. Prior accepted ADR content is unchanged.

## Decision

Install and update UAW per project. Retire the global synchronization helper and
remove the bundled/optional visual compiler, catalog selection and dependent active
instructions. Use Markdown Mermaid diagrams for domain models and technical docs.
No global tool installation is implied by onboarding or diagram authoring.

## Consequences

Fresh source/distribution no longer carries that runtime or global-sync utility.
Keep generic screenshot capture and project-local hooks/adapters. Customer files
from old releases, including customized old tool files, are preserved by the update
engine and may be reported unavailable when their selected source disappears.
Never purge global installs/customer projects to implement source retirement.
Immutable ADR/baseline/acceptance history continues to describe its original point
in time; this decision and the latest feature docs define current behaviour.
