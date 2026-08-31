# ADR-001: Adopt Mermaid-First Architecture with Optional Archify Visual Enhancer

- **Status:** Accepted
- **Date:** 2026-08-31
- **Deciders:** Product Owner, Lead Architect
- **Technical context:** Addressing the risk of external upstream dependency drift and vendor lock-in regarding diagram visualization tooling (`tt-a1i/archify`).

---

## Context

In multi-agent software engineering, architectural and domain diagrams (FSM lifecycle, sequence traces, data pipelines, system boundaries) are core artifacts required across all phases (BA Domain Modeling, SpecKit Architecture, Adversarial Review, Technical Documentation).

An external visual compiler like `tt-a1i/archify` provides rich interactive HTML maps, Before/After diffing, and 1200×630 share cards. However, hard-coupling the entire framework to an external third-party repository introduces severe risks:

1. **Upstream Drift / Breaking Changes**: If upstream changes CLI flags, JSON IR schemas (e.g. schema v2/v3), or deprecates commands, dependent workflows break.
2. **Distribution & Onboarding Barrier**: New users downloading or cloning the framework who do not install the optional CLI tool would experience broken workflows or tool-call errors.
3. **Vendor Lock-in**: Relying exclusively on custom JSON IR makes technical documentation unreadable in standard Markdown viewers (GitHub, GitLab, Obsidian, IDEs).

---

## Decision

We adopt the **Mermaid-First + Dual-Asset Strategy**:

1. **Mermaid as the Universal Single Source of Truth**:
   - Every specification, technical plan, domain model, and feature README **MUST ALWAYS** contain native, embedded standard Markdown `mermaid ` code blocks.
   - Mermaid is 100% zero-dependency, timeless, natively rendered across all Git platforms (GitHub, GitLab), and will never become obsolete or break with third-party upstream changes.

2. **Archify as an Optional Visual Enhancer (Dual-Asset Pattern)**:
   - `archify` is categorized as an **Optional Tool** in `optional-stack-skills/catalog.json`.
   - When present on the developer's machine (`archify doctor` succeeds), subagents _additionally_ compile standalone interactive `.html` files and `1200×630` PNG Share Cards into `docs/architecture/` or asset directories as high-fidelity companion artifacts.
   - When Archify is absent or fails, the workflow gracefully falls back to native Mermaid diagrams without stopping, erroring, or blocking completion.

---

## Consequences

### Positive

- **Zero Upstream Lock-in**: The workflow is 100% resilient and self-sufficient. Upstream changes in `archify` can never break core agent workflows.
- **Universal Readability**: All diagrams render out-of-the-box in GitHub web previews, Markdown previewers, and IDEs without special plugins.
- **Graceful Degradation**: Users with Archify enjoy interactive zoom/pan/diffing; users without Archify still get complete, clear Mermaid diagrams.

### Negative / Trade-offs

- AI subagents maintaining dual-assets may emit both a Mermaid code block and an optional JSON IR file when Archify is active, consuming slightly more context tokens during documentation phases.

---

## Alternatives Considered

1. **Hard Dependency on Archify**: Rejected due to high risk of upstream drift, installation overhead for users, and lack of native GitHub Markdown rendering.
2. **Intermediate Adapter / Facade Layer**: Over-engineered for markdown diagrams; added unnecessary translation maintenance overhead.
3. **Forking / Vendoring Archify Runtime**: Rejected to keep repository size minimal, maintain polyglot independence, and avoid maintaining a separate rendering engine fork.

---

## Related

- **Catalog Entry**: `optional-stack-skills/catalog.json` (`archify`)
- **Skill Definition**: `.agents/skills/engineering/archify/SKILL.md`
- **Governance Reference**: `AGENTS.md` (Mandatory Tech Skills Matrix)
