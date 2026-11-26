# 0006: Consolidated native skill library

Status: Accepted
Date: 2026-11-26
Authority: owner approved the skill audit proposals, explicitly retaining wait-what.

## Context

Native UAW planning has replaced upstream SpecKit execution. Migration aliases and overlapping navigation, lean-review and UI skills now add duplicate ownership without a required core behavior.

## Decision

Supersede ADR 0004 only in its requirement to retain ten speckit-* source migration stubs. Remove those stubs and their references; retain the BA-first lane and gate contract and four native planning skills. Merge route into skills-index and repository audit into ponytail-review. Move help to documentation, remove external benchmark display, and consolidate frontend-design/ui-taste-pro guidance into the retained marketing/product owners with selective shared references. Keep wait-what unchanged.

## Consequences

New source installs contain 53 skill identities (9 hot, 44 cold). Removed commands are unavailable in fresh installs. This retirement does not authorize deleting installed customer copies: the existing zero-deletion updater preserves unchanged and customized retired files, custom retained skills, domain data and provenance. Accepted historical artifacts remain immutable. No new runtime or global setup is introduced.
