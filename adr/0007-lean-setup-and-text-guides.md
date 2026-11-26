# 0007: Lean setup and text guides

Status: Accepted
Date: 2026-11-26
Authority: owner approved three remaining skill merges and explicitly removed screenshots from user-guide production.

## Decision

Merge setup-workspace into command-skill-setup through an on-demand onboarding reference, preserving confirmed stack/selections, CONTEXT and accepted ADRs. Merge writing-for-agents into technical-documentation references. Merge ponytail-debt into ponytail-review debt. Replace user-guide-with-screenshots and its capture tooling with user-guide text instructions and a thin command router. Guides run only when requested or selected for release documentation, with no browser/server/capture/annotation requirement. UI review and E2E testing keep their own evidence checks.

## Consequences

The current source library contains 50 identities (9 hot/41 cold), superseding ADR 0006's inventory count. Its other source-retirement and customer-preservation rules remain. Existing installed skills, guide images, capture scripts and custom domain/config files are not deleted. Keep accepted historical records unchanged; report missing selected source packs as unavailable/partial rather than inventing successful migration. No new runtime/global setup or monetary-saving claim is introduced.
