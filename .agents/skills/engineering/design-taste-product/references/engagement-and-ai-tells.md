<!-- Part of the `design-taste-product` skill. Read only when the router in SKILL.md points you here. -->

## 9. Engagement mechanics (streaks, XP, rewards, urgency)

When the product uses streaks, XP, levels, badges, or similar mechanics:

- Make the current state legible at a glance — today's status, current
  streak, progress to the next milestone — without requiring math or a trip
  to settings.
- Reserve strong visual energy for genuine milestones (leveling up,
  completing a streak). If routine states get the same celebratory treatment
  as real milestones, nothing feels earned.
- Check reward/urgency copy against any documented anti-abuse or ethical
  constraints in the project's own domain rules before shipping loss-framed
  language ("you'll lose everything") — nudge toward genuine engagement, not
  anxiety.
- Reward/streak-increment animations should be motivated feedback for a
  completed action, and must respect `prefers-reduced-motion` like any other
  motion (`design-taste-frontend` Section 6.B applies here unchanged).

---

## 10. AI tells specific to product UI

These are the dashboard/app equivalents of `design-taste-frontend` Section 9
— read that section too for the tells that apply everywhere (em-dash ban,
Inter-as-default, AI-purple, hand-rolled SVGs). The ones below are specific
to product surfaces:

- **Card soup.** Every element wrapped in an identical white card with the
  same shadow and radius, with nothing to distinguish a KPI tile from a
  settings panel from a list item. Use elevation only where it communicates
  real hierarchy; group with spacing or a hairline divider otherwise.
- **Cards inside cards.** A card containing another card containing the
  actual content is a strong tell of not having thought about layout —
  flatten it.
- **Meaningless KPI tiles.** A number with an up/down arrow and a percentage
  that doesn't map to anything the user actually tracks. If a stat isn't
  something the user would ask about, it doesn't deserve a tile.
- **Sidebar nav with no grouping.** A dozen ungrouped icons in a rail is not
  information architecture. Group by function, and don't force icon-only nav
  when a labeled list would be clearer.
- **A table that pretends to be data-dense but has no sort, filter, or
  pagination.** If there's enough data to need a "data table," it needs the
  actual table functionality, not just table-shaped styling.
- **A settings page as one long flat form.** Group related settings into
  sections; don't present 30 fields in one uninterrupted column.
- **Uniform buttons regardless of intent.** Primary, secondary, and
  destructive actions all styled the same way forces the user to read every
  label to know what a click will do.
- **Happy-path-only screens.** A polished populated state with no loading,
  empty, or error state designed is not a finished screen (see Section 6).
- **Marketing copy leaking into product UI.** Hiding the actual workflow,
  tool, or object behind an onboarding-style hero, a feature-explainer
  section, or persuasive copy on a screen the user already chose to be on.
  Once someone is inside the product, show them the tool — they don't need
  to be sold on it again.

---
