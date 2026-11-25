<!-- Part of the `design-taste-product` skill. Read only when the router in SKILL.md points you here. -->

## 6. UX states, grounded in the spec

Every view that loads or submits data needs all four states designed, not
just the happy path:

- **Loading** — a skeleton roughly matching the eventual layout, not a
  generic centered spinner on a blank page.
- **Empty** — a real explanation and, where relevant, a next action — not
  just "No data."
- **Error** — says what happened and what to do next, not a raw error
  string.
- **Populated** — check it at edge densities too (1 row, 100 rows), not just
  the demo-data case.

If the project has a spec (user stories, acceptance criteria, a domain
model), every UI-relevant state named there should be visually distinct and
checkable by looking at the screen — not just inferable from reading the
code.

---

## 7. Accessibility, in context

`frontend-a11y` (if present in this project) covers the code-level patterns —
label association, ARIA, keyboard handling, focus management. This skill adds
the judgment layer on top, applied to the actual rendered screen rather than
the markup in isolation:

- **Keyboard-only pass** — can the core flow (completing a form, finishing a
  review session) be done without a mouse?
- **Icon+number pairings need accessible names** — a streak-flame icon next
  to "12" needs an accessible label, not just a visual pairing a sighted user
  can infer.
- **Contrast checked against the actual rendered background**, not the
  design token in isolation — a token that passes on paper can still fail
  against a photo, gradient, or translucent surface behind it.

---

## 8. i18n resilience

If the project targets more than one language, test labels, buttons, and any
number/counter displays with a long string — German, Vietnamese, and several
other languages routinely run longer than English — and confirm nothing
truncates or breaks layout. This matters more in product UI than marketing:
a truncated button label blocks a task; a truncated landing-page headline is
just ugly.

---
