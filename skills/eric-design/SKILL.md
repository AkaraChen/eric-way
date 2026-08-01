---
name: eric-design
description: Apply Eric's visual design standards and flair. Use when designing, implementing, or reviewing visual direction — landing pages, app styling, icons, typography, composition, motion, headings, page overscroll, or when choosing a direction from a design DNA spec in Eric's style. Use eric-ui separately for UI correctness, disclosure, and cognitive load.
---

# Eric Design

Use this skill for visual direction and flair in web/app UI. `$eric-ui` owns
whether the interface is useful, what users see, and what stays hidden. The
canonical design docs live at `docs/design/` in the eric-way repo; this skill
vendors copies under `references/`.

## Workflow

1. Decide the context first: **landing** or **app**. Everything downstream depends on this call.
   - **Landing** (marketing site, promo page, homepage) — optimize for looks. Lean into visual impact, bold layout, motion, and storytelling. Beauty wins.
   - **App** (the product UI users work in) — balance usability and looks. It must be pleasant, but never at the cost of being usable. When the two conflict, usability wins.
2. Check whether the project already has a design system, component library, or icon library; if so, follow it instead of introducing a new one.
3. If the user did not specify a style or visual direction, do not pick one for them — build a style menu first (see [Picking a style](#picking-a-style)).
4. When a design DNA profile fits the task, read the matching JSON under `references/spec/` and derive colors, type, spacing, shape, elevation, and motion from its tokens instead of inventing values.
5. For frontend implementation details (styling boundaries, class helpers, feature folders), also use `$eric-frontend`.
6. When adding or reviewing UI, also use `$eric-ui` and read
   [`references/ui.md`](references/ui.md) before styling it.

## Picking a style

When the user has not named a style, reference, or design DNA spec, never silently
settle on one direction. Instead, show the options and let the user choose.

- Shortlist every direction that actually fits the context and content — the specs
  under `references/spec/` plus any other direction that suits the brief. Drop the
  ones that clash with the context (landing vs app) rather than padding the list.
  Two to five candidates is the useful range.
- Build one small standalone HTML file per candidate: a single self-contained file,
  no build step, no dependencies beyond a CDN font. Keep it to a slice of the real
  content — a hero or one representative screen — so the styles are compared on the
  same material.
- Each preview only has to convey the direction: color, type, spacing, shape, and
  a hint of motion. Do not build the whole page, and do not wire up real behavior.
- Name the files after the direction (`style-craft.html`, `style-brutalist.html`),
  put them in one folder, and tell the user where they are and how to open them.
- Then stop and ask the user to pick. Once they choose, build the real thing from
  that direction's tokens and discard the rest.
- Skip this whole step when the project already has a design system or the user
  named a direction — follow that instead.

## General

- Do not add eyebrow text; it is useless.
- For web apps and desktop apps built with web tech, apply [`references/normalize.css`](references/normalize.css) at the document root.

## Landing

- Apply text balance to titles (`text-wrap: balance` / Tailwind `text-balance`) so headings wrap evenly.

## App visuals

- Use icons deliberately and with restraint.
- Tabs include an icon to the left of the label; dialogs include an icon in the top-left.
- Prefer Phosphor Icons, unless the project already has a default icon library — then use the project's default.
- Phosphor variants: default to `regular`. Use `duotone` only for purely presentational, non-clickable, decorative icons (it has more visual depth). For action buttons such as edit or confirm, check the project's existing practice and use `regular` or `bold`.

## Design DNA specs

Design DNA profiles extracted from reference sites live under `references/spec/`, one JSON per site.

When suggesting a design style or visual direction, list that folder, read the specs, and consider them as candidate directions — they are the starting shortlist for [Picking a style](#picking-a-style). When one is chosen, derive tokens and treatments from its JSON instead of inventing values.

## Boundaries

- Do not invent a new design system when the repo already has one.
- Do not commit to a single style the user never asked for; show the options first.
- Do not turn the style previews into full pages or real implementations.
- Do not let visual flair decide what data or controls users see; that belongs to
  `$eric-ui`.
- Do not sacrifice app usability for visual flair; that trade is only allowed on landings.
- Do not mix icon libraries or Phosphor variants arbitrarily within one surface.
