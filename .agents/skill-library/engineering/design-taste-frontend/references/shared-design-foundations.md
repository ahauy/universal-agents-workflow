# Shared design foundations

Use this reference for the initial design decisions or the final cross-surface
quality pass. Read only the section needed; marketing and product screens keep
their own retained skill and rubric.

## Detect stack and surface

Inspect workspace manifests and existing components before selecting technology:
`package.json`, `pubspec.yaml`, `composer.json`, `*.xcodeproj`, or the relevant
project files. Reuse the detected stack and installed design system. If no stack
is established, ask rather than silently choosing React, Next.js, or a library.
Keep product/app UI separate from marketing/landing UI; mixed projects classify
per screen. Native shells use their platform design guidance.

Read existing `DESIGN.md`, token files and brand references first. Their confirmed
decisions outrank skill defaults. User rules and approved scope outrank stylistic
suggestions, including any example palette, font, motion dial or framework here.
Do not invent the product, audience, business claims or default behavior to fill
a sparse brief. Ask only for missing material decisions.

## Visual direction and copy

Ground the direction in the real subject, audience and screen's single job.
For a new marketing surface, describe a compact design plan: named palette,
display/body type roles, layout thesis and one memorable signature element tied
to the subject. Compare a short prose or ASCII layout alternative when it helps
settle an open choice. Product UI favors task hierarchy and existing conventions;
it does not need a marketing hero or an extra display typeface.

Before building, critique the plan against the brief. Revise anything that could
be pasted onto an unrelated product. A cream/terracotta serif editorial look,
near-black with an acid accent, and dense newspaper columns are also defaults
when chosen without a reason. They are valid when the actual brief calls for them.
Spend visual boldness in one meaningful place and keep supporting elements quiet.
Numbering, eyebrows and dividers must express content structure; do not decorate
unrelated items with fake sequence numbers. Match implementation complexity to
the approved direction, with native platform and existing components first.

Use real content and assets. A marketing hero should immediately communicate what
the offering is, for whom and the primary next action. Vary section rhythm to
support its story rather than repeating identical feature cards. Omit unsupported
social proof. Pricing emphasis and tier labels must reflect confirmed product
facts. Product navigation stays predictable; forms use visible labels and clear
primary/secondary/destructive actions, without introducing invented validation
rules or submission behavior.

Write from the user's side: name what they control, not internal implementation.
Use active, specific action labels consistently through buttons and feedback
(`Save changes` / `Changes saved`). Explain errors and recovery in plain language;
empty states give context and a next action when available. Keep tone appropriate
to the audience and keep each label, example and instruction to one clear job.

## Design anchor

Record real agreed visual decisions in a short root `DESIGN.md` or the project's
existing equivalent. Extract the first real screen's decisions rather than
inventing a speculative design system. Later screens read the anchor first.
Preserve an existing anchor; change direction only when the user authorizes it.
Merge the agreed changes without regenerating or overwriting custom content.

```markdown
# Design System — <project name>

## Palette
- Neutral: <background / surface / border / text>
- Primary accent: <hex>
- Secondary accent: <only if needed>
- Semantic: <only statuses actually required by the domain>

## Type
- Family and role: <display / body / utility as needed>
- Scale and weights: <confirmed sizes and hierarchy>

## Spacing
- Scale: <consistent spacing steps>

## Radius / Shadow / Motion
- <corner system, purposeful elevation, duration and easing>

## Notes
- <brand reference, accessibility needs and explicit constraints>
```

## Shared final check

Apply the retained surface skill's pre-flight checks, then verify:

- The project anchor matches actual palette, type scale and spacing rhythm.
  Hierarchy uses weight and size, not identical cards with identical shadows.
- The layout has a clear focal point, readable line lengths and meaningful
  alignment. Repeated icon/title/body grids are justified by real content.
- Unrequested neon gradients, glassmorphism and decorative motion are absent.
  Check contrast on the actual backgrounds in every supported theme.
- Interactive elements have visible keyboard focus and appropriate hover/pointer
  feedback. Respect reduced motion and stable outer anchors for hover physics.
- Data views handle loading, empty, error and populated states, including sparse
  and dense content. Submitted actions show appropriate feedback. Forms remain
  labeled and accessible; state behavior follows the confirmed requirements.
- Copy is specific and consistent. No fabricated quotes, logos or statistics;
  icons belong to one coherent set/style rather than a mixture of emoji and sets.
- Review rendered screenshots when available, including mobile and keyboard
  flows. Report unavailable visual verification honestly. Remove decoration that
  adds no meaning; fix conflicting CSS specificity instead of stacking overrides.

An optional external design-audit tool supplements these checks only when already
available and relevant. It is not a new installation requirement.
