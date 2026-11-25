<!-- Part of the `design-taste-product` skill. Read only when the router in SKILL.md points you here. -->

## 5. Design anchor (`DESIGN.md`)

The first time real visual decisions are made for a project (color, type
scale, spacing scale, radius, shadow), write them to a short `DESIGN.md` at
the project root instead of re-deciding per screen. Every screen after that
reads the existing file first and stays consistent with it.

```markdown
# Design System — <project name>

## Palette

- Neutral: <background, surface, border, text>
- Primary accent: <hex>
- Secondary accent (optional): <hex>
- Semantic (only if the domain needs it): success / warning / danger

## Type

- Family: <font(s)>
- Scale: <e.g. 12 / 14 / 16 / 20 / 24 / 32>
- Weight usage: <e.g. 400 body, 600 headings>

## Spacing

- Scale: <e.g. 4 / 8 / 12 / 16 / 24 / 32 / 48>

## Radius / Shadow / Motion

- <corner-radius system, shadow usage, default transition duration>

## Notes

- <anything worth remembering — a system this is anchored to, things to avoid>
```

If a `DESIGN.md` already exists, treat it as the source of truth and update
it only when the user explicitly changes direction — don't regenerate it from
scratch because a new screen has different needs.

---
