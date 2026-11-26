---
invocation: model
name: design-taste-product
description: >
  Anti-slop design skill for product UI — dashboards, in-app screens, data
  tables, multi-step forms and wizards, settings, admin panels. This is the
  sibling of design-taste-frontend, covering exactly the surfaces that skill's
  Section 13 excludes. Use whenever building or improving a screen a user
  returns to repeatedly (logged-in, task-driven), as opposed to a one-time
  visitor page. Trigger on requests to build a dashboard, app screen, form,
  wizard, settings page, or to make in-app UI "look better", "less generic",
  or "more polished" — even if the user doesn't say "product UI" explicitly.
triggers:
  - Building or redesigning any logged-in / in-app screen
  - Any dashboard, study/review flow, deck management screen, streak/XP display
  - Multi-step forms, wizards, onboarding flows inside the product
  - Settings pages, admin panels, data tables
  - User asks to make in-app UI look "better", "cleaner", "less generic", or "more polished"
  - Implementation-orchestrator reaches its UI-layer slice for a product screen
  - ui-design-review determines the surface is product UI (not landing/marketing)
---

# design-taste-product: Anti-Slop Product UI Skill

> Dashboards, in-app screens, data tables, multi-step forms, settings, admin
> panels. Not landing pages, portfolios, or marketing surfaces — those belong
> to `design-taste-frontend`. Not code editors, native mobile shells, or
> realtime collaboration UI either — those are different problem classes with
> their own official tooling (see Section 0.C).

This skill exists because `design-taste-frontend` explicitly and correctly
refuses product UI (its Section 13): a dashboard judged by landing-page
standards ends up either boring (if held back) or exhausting (if it "pops"
the way a hero section should). Product UI needs its own taste model, not a
diluted copy of the marketing one.

**Where this skill borrows instead of repeating:** performance/accessibility
guardrails, dark-mode protocol, and the em-dash ban are universal hygiene, not
marketing-specific. Read the applicable section in [performance and dark mode](../design-taste-frontend/references/perf-and-dark-mode.md) or [AI tells](../design-taste-frontend/references/ai-tells.md), one file at a time, rather than loading the whole marketing rubric.

---

> Some sections of this skill were moved to `references/` to keep the load cheap. The router listing them is at the **bottom of this file**.

## When to use this skill (Trigger Conditions)

Activate `design-taste-product` whenever **any** of the following apply:

| Signal                                                                                                   | Example                                               |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Building or redesigning a logged-in / in-app screen                                                      | Study flow, deck editor, review session UI            |
| Dashboard, glanceable metrics, or streak/XP display                                                      | Home screen with streak counter, XP bar, daily goal   |
| Multi-step form, wizard, or onboarding flow inside the product                                           | Card creation wizard, account setup steps             |
| Settings page, admin panel, or management list                                                           | Profile settings, notification preferences, deck list |
| Data table with sort / filter / pagination needs                                                         | Leaderboard, history log, vocabulary list             |
| User says: "make this look better", "less generic", "more polished" — and the target is an in-app screen | Any product screen the user returns to repeatedly     |
| `implementation-orchestrator` reaches its UI-layer slice for a product surface                           | Confirmed by `00-intake.md` surface type = product UI |
| `ui-design-review` classifies the surface as product UI                                                  | Review table in `ui-design-review` Section 1          |

**Do NOT activate this skill for:**

- Landing pages, marketing sites, portfolio pages, or public-facing redesigns → use `design-taste-frontend` instead
- Code editors, native mobile shells, or realtime collaboration UI → use the specific tool named in Section 0.C
- Mixed surfaces (marketing page + in-app screen in one feature) → split the work: `design-taste-frontend` for the marketing surface, this skill for the in-app surface

---
Before selecting technology or tokens, use [shared stack and surface detection](../design-taste-frontend/references/shared-design-foundations.md#detect-stack-and-surface). Reuse the detected stack and existing design anchor; ask if neither the repository nor the owner establishes the stack. Shared examples never authorize a framework change or invented business behavior.

## 0. Scope

### 0.A This skill covers

Dashboards, in-app/logged-in screens, data tables, multi-step forms and
wizards, settings pages, admin panels, onboarding flows, any screen inside a
product that a user operates repeatedly rather than visits once.

### 0.B Defers entirely to `design-taste-frontend`

Landing pages, marketing sites, portfolios, redesigns of any of those,
about/pricing pages. If a feature has both a marketing page and an in-app
screen, split the review: apply each skill to its own surfaces, don't blend
the two rubrics on one screen.

### 0.C Out of scope for both skills — use the named tool instead

- Code editors → Monaco / CodeMirror with their official skinning.
- Native mobile shells → Apple HIG / Material directly, or `liquid-glass-design`
  for iOS 26 Liquid Glass specifically.
- Realtime collaboration UI (presence, cursors, OT-aware surfaces) → different
  problem class; design taste is not the bottleneck there.

If a request lands here, say so explicitly and point to the right tool rather
than stretching this skill to cover it.

---
## 1. Brief inference (read the room, product-UI version)

Before writing code, work out:

1. **Purpose** — what task does this screen let the user complete?
2. **Repeat user, not visitor** — this person will see this screen dozens or
   hundreds of times. Familiarity and predictability are worth more here than
   a strong first impression.
3. **Existing app conventions** — if the app already has screens, this one
   must match them (component library, spacing scale, radius, nav pattern),
   not introduce a parallel visual system. Check for an existing `DESIGN.md`
   or equivalent token file first (Section 5) — it overrides everything below.
4. **Data/action shape** — is this primarily about reading data (dashboard,
   report), entering data (form, wizard), or managing a collection (table,
   list, settings)? Each has a different center of gravity.
5. **Tone** — utilitarian, playful, calm, dense, technical — product UI has
   a tone too (a kids' learning app and an enterprise analytics tool
   shouldn't feel the same), it just expresses through restraint and detail
   rather than through the bold moves a landing page can make.
6. **Quiet constraints** — accessibility-critical audiences, regulated data,
   kids' products, anything that overrides aesthetic preference.

State a one-line design read before generating, same discipline as
`design-taste-frontend` Section 0.B:

> _"Reading this as: a daily spaced-repetition review screen, single-task,
> low-distraction, matching the app's existing zinc/emerald token system."_

> _"Reading this as: an admin settings panel, dense, table-heavy, no
> motion beyond state feedback."_

If genuinely ambiguous, ask **one** question — same discipline as
`design-taste-frontend` Section 0.C. Most of the time the existing app or the
brief already answers this; don't ask when you can infer.

---
## 2. Design system — don't reinvent, delegate

Check `design-taste-frontend` Section 2.A first. It already maps brief
signals to the right official package:

- Microsoft/enterprise SaaS → Fluent UI
- Google-ish product → Material 3
- IBM-style B2B/analytics → Carbon
- Shopify admin surfaces → Polaris
- Atlassian/Jira-style → Atlaskit
- Modern accessible React foundation → Radix Themes
- Own-the-code modern SaaS → shadcn/ui

For data tables specifically (a case `design-taste-frontend` names but
doesn't implement, since it's out of that skill's scope): **TanStack Table**
for headless/flexible needs, **AG Grid** when the product genuinely needs
enterprise-grid features (pivoting, virtualization at scale, Excel-like
editing). Don't hand-roll a sortable/filterable table from scratch — it's a
solved problem with mature libraries.

**The existing app wins.** If the project already has an established design
system or component library in use, match it — do not introduce a second
system "because it's more official" for this one screen. Consistency with
what's already shipped beats textbook-correct system selection.

---
## 3. The dials, recalibrated for product UI

`design-taste-frontend` uses three dials (`DESIGN_VARIANCE`,
`MOTION_INTENSITY`, `VISUAL_DENSITY`) tuned for pages that need to stand out.
Product UI inverts the priority: **consistency beats novelty.** A user who
sees this screen every day is not impressed by variance — they're slowed
down by it.

- **`VISUAL_DENSITY`** — reuse the same 1-10 scale and definitions from
  [the shared dial definitions](../design-taste-frontend/references/perf-and-dark-mode.md#7-dial-definitions-technical-reference). Product UI typically lands 4-8
  (Daily App to Cockpit) rather than the 2-4 (Art Gallery) range common on
  marketing pages. A dashboard with 15 metrics genuinely needs density; don't
  pad it with landing-page whitespace just to look "clean."
- **`MOTION_INTENSITY`** — same scale, but the product-UI baseline is lower:
  2-4 by default (state feedback only), not the 6-8 that suits a marketing
  hero. Motion here should almost always be answering "what just changed?"
  rather than "look how alive this page is."
- **`DESIGN_VARIANCE` is replaced by `CONSISTENCY`** as the operative
  constraint. Every screen in the product should be recognizable as the same
  product. A settings page that looks like a different app than the
  dashboard is a bug, not a design choice. If you want a number: treat this
  as `DESIGN_VARIANCE` locked at 1-3 (Predictable) relative to the rest of
  the app, regardless of how expressive the brief sounds.

---
## 4. Information hierarchy for the task at hand

Different product-UI tasks need different hierarchy strategies:

- **A focused task screen** (a flashcard review, a single-step form, a
  checkout step) stays low-distraction and single-focus. Nothing competes
  with the one thing the user is supposed to do right now — no dashboard
  widgets, no secondary stats, no upsell card, bolted onto the side.
- **A glanceable dashboard** (streak, XP, KPIs, status overview) makes the
  primary number unambiguous at a glance. If everything is bold and colored
  equally, nothing is primary — pick the one or two numbers that matter most
  and give everything else less visual weight.
- **A management surface** (table, list, settings) prioritizes scannability
  and predictable row/field structure over visual flourish. Users are
  hunting for a specific item or field, not absorbing a narrative.

---
## 11. Pre-flight check

Before calling product UI done, apply the [shared final check](../design-taste-frontend/references/shared-design-foundations.md#shared-final-check) alongside the product checks below. This includes consistent action labels and feedback, real social proof, coherent icons, keyboard focus and source-preserving design-anchor updates.

Before calling product UI done:

- [ ] Design read stated (Section 1) and matches existing app conventions
      where an app already exists?
- [ ] Design system chosen per Section 2, or an existing project system
      reused instead of introducing a second one?
- [ ] `DESIGN.md` (or equivalent) checked first if it exists, and updated if
      this is the first real screen for a new project (Section 5)?
- [ ] All four UX states (loading/empty/error/populated) implemented for
      every view that loads or submits data (Section 6)?
- [ ] Hierarchy matches the task type — single-focus for task screens,
      glanceable for dashboards, scannable for management surfaces
      (Section 4)?
- [ ] Keyboard-only pass done for the core flow; icon+number pairings have
      accessible names; contrast checked against the real rendered
      background (Section 7)?
- [ ] Long-string i18n check done if the project targets more than one
      language (Section 8)?
- [ ] Engagement/reward copy checked against anti-abuse constraints, not
      judged on aesthetics alone, if the product has streak/XP/reward
      mechanics (Section 9)?
- [ ] None of the Section 10 tells present — no card soup, no cards-in-cards,
      no meaningless KPI tiles, no ungrouped nav, no fake-data-table, no flat
      settings wall, no uniform buttons regardless of intent?
- [ ] Universal hygiene from `design-taste-frontend` applied: zero em-dashes
      (Section 9.G), reduced-motion respected for anything above
      `MOTION_INTENSITY 3` (Section 6.B), both light and dark mode tested if
      the product supports both (Section 8)?
- [ ] A real screenshot pass attempted if a browser/screenshot tool is
      available in this environment; its absence stated explicitly if not?

If a box can't be honestly ticked, the screen isn't done yet.

## References (read on demand)

This skill is split so a load costs ~3.4k tokens instead of ~4.7k. The core above is always relevant; the files below are situational.

| Open | Contains |
| --- | --- |
| `../design-taste-frontend/references/shared-design-foundations.md` | Stack/surface detection, subject-specific direction and copy, shared final check (read the matching section only) |
| `references/design-anchor.md` | 5. Design anchor (DESIGN.md), Palette, Type, Spacing, Radius / Shadow / Motion, Notes |
| `references/ux-states-a11y-i18n.md` | 6. UX states, grounded in the spec, 7. Accessibility, in context, 8. i18n resilience |
| `references/engagement-and-ai-tells.md` | 9. Engagement mechanics (streaks, XP, rewards, urgency), 10. AI tells specific to product UI |

Never load more than one reference file at a time.
