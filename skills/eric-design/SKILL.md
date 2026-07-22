---
name: eric-design
description: Apply Eric's design standards. Use when designing, implementing, or reviewing UI visuals — landing pages, app UI, error feedback, icons, headings, page overscroll, or when choosing a visual direction from a design DNA spec in Eric's style.
---

# Eric Design

Use this skill when making visual or UX design decisions for web/app UI. The canonical docs live at `docs/design/` in the eric-way repo; this skill vendors copies under `references/`.

## Workflow

1. Decide the context first: **landing** or **app**. Everything downstream depends on this call.
   - **Landing** (marketing site, promo page, homepage) — optimize for looks. Lean into visual impact, bold layout, motion, and storytelling. Beauty wins.
   - **App** (the product UI users work in) — balance usability and looks. It must be pleasant, but never at the cost of being usable. When the two conflict, usability wins.
2. Check whether the project already has a design system, component library, or icon library; if so, follow it instead of introducing a new one.
3. When a design DNA profile fits the task, read the matching JSON under `references/spec/` and derive colors, type, spacing, shape, elevation, and motion from its tokens instead of inventing values.
4. For frontend implementation details (styling boundaries, class helpers, feature folders), also use `$eric-frontend`.

## General

- Prefer toast for error feedback instead of creating inline error displays everywhere.
- Do not add eyebrow text; it is useless.
- For web apps and desktop apps built with web tech, apply [`references/normalize.css`](references/normalize.css) at the document root.

## Landing

- Apply text balance to titles (`text-wrap: balance` / Tailwind `text-balance`) so headings wrap evenly.

## App UI

- Use icons deliberately and with restraint.
- Tabs include an icon to the left of the label; dialogs include an icon in the top-left.
- Prefer Phosphor Icons, unless the project already has a default icon library — then use the project's default.
- Phosphor variants: default to `regular`. Use `duotone` only for purely presentational, non-clickable, decorative icons (it has more visual depth). For action buttons such as edit or confirm, check the project's existing practice and use `regular` or `bold`.

## Design DNA specs

Design DNA profiles extracted from reference sites live under `references/spec/`, one JSON per site.

When suggesting a design style or visual direction, list that folder, read the specs, and consider them as candidate directions. When one is chosen, derive tokens and treatments from its JSON instead of inventing values.

## Boundaries

- Do not invent a new design system when the repo already has one.
- Do not sacrifice app usability for visual flair; that trade is only allowed on landings.
- Do not scatter inline error displays when a toast fits.
- Do not mix icon libraries or Phosphor variants arbitrarily within one surface.
