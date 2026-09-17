---
name: clean-my-design
description: Design rules for building or improving any UI - websites, landing pages, product screens, dashboards, components, forms, empty states. Use when writing or reviewing frontend code that a human will look at: visual hierarchy, typography, color, spacing, motion, states, responsive behavior, UX copy. Also use when a design feels bland, generic, templated, or when asked to make something bolder, quieter, or more polished. Not for backend-only work.
user-invocable: true
argument-hint: "[target file or surface]"
---

You are designing, not decorating. Every default you reach for without deciding is a
default the last thousand models reached for too. Decide, then build it fully.

## 1. Name the surface's mode first

The mode is what success looks like for the person on THIS surface, not for the product.
A tool's landing page is still Persuade. A fashion house's docs are still Read.

- **Persuade** (landing, marketing, pricing): design is the product. Earn attention and
  action. Show the thing doing its job, do not describe it.
- **Operate** (app UI, dashboard, editor, settings, admin): the user is in a task.
  Scanability, consistency and familiar affordances beat expression. Brand lives in details.
- **Read** (docs, articles, guides): structure for comprehension first, then make the
  reading worth staying in.
- **Experience** (portfolio, gallery): the work leads from the first viewport, the
  interface recedes.

An addition inside an existing surface inherits that surface. A new section is never an
excuse to invent a new identity.

## 2. Refuse the category defaults

These are not banned forever: a brief that explicitly asks for one earns it. But reaching
for one when nothing asked means you were not deciding.

Page structure:

- Rows of identical cards (icon + heading + text) as the page's skeleton. Cards are the
  lazy container. Nested cards are always wrong.
- The hero-metric template: big number, small label, supporting stats, accent color.
- **Kicker / eyebrow above a heading.** This one is an actual ban, no exceptions. The
  heading carries its own weight. Delete the label.
- Section numbers (01 / 02 / 03) unless the sequence itself is information.
- A modal for a task that needs neither interruption nor protected focus.

Surface habits:

- Gradient text. Emphasis comes from weight or size.
- Glass and blur as decoration rather than as a specific, motivated effect.
- A colored `border-left` thicker than 1px on cards, list items, callouts, alerts.
- Hard offset shadows (`box-shadow: 4px 4px 0`) outside a genuinely neobrutalist world.
- Sparklines, progress rings and soft-shadowed rounded rectangles standing in for content.
- Monospace as a costume for "technical", rather than for code, data or measurement.
- A system display face (Impact, Arial Black, the platform sans) as the display voice of
  a page with its own identity. Self-host a real face instead.
- Emoji or unicode glyphs standing in for icons. Icons are drawn, one library, one stroke
  weight, one style.
- `clip-path` polygons or radial gradients approximating a photo subject's edge. Either
  derive a real alpha matte, or drop the effect.
- Light or dark picked by category habit. Pick it from the scene: who, where, what ambient
  light.

## 3. The floor, checked on the built result

Not intentions. Open the thing and look, in one batched pass (desktop + mobile together).

- **Contrast:** body and placeholder text >= 4.5:1, large text >= 3:1. On a colored
  surface, tint secondary text from that hue. Never gray.
- **Depth:** shadows have an offset AND a soft blur. A zero-offset colored halo is
  decoration, not depth.
- **Spacing:** tight inside a group, generous between groups, more space ABOVE a heading
  than below it. One rhythm for the whole page.
- **Type:** body measure 65-75ch, display capped around 6rem, tracking floor -0.04em,
  balanced headings, obvious steps in size and weight. Run the REAL copy at every
  breakpoint and fix what overflows.
- **States:** hover, focus, active, disabled, loading, error, empty. Ship all of them or
  you shipped half a component. Skeletons, not spinners in the middle of content. Empty
  states teach the interface, they do not say "nothing here".
- **Motion:** one authored moment, not scattered effects, and not the same entrance
  animation on every section. Exponential ease-out, starting from an already-visible
  default. Blur, backdrop-filter, clip-path, mask and shadow are all in the palette when
  they stay smooth.
- **Browser surfaces:** the parts you did not draw still carry the design. Text selection,
  caret, scrollbars, focus rings, underline offset, tabular numerals. Theme them from the
  palette. This is the cheapest tell that a page was built rather than assembled, and the
  one most reliably skipped.
- **Overlays escape their container:** an absolutely positioned dropdown inside an
  `overflow: hidden` ancestor gets clipped. Use `<dialog>`, the popover API,
  `position: fixed`, or a portal.
- **Copy:** the product's own words. Controls name their action. Errors name the problem
  AND the recovery.

## 4. Commit the world (only when there isn't one already)

If the project has a coherent look, inherit it. Do not hold an identity tournament to add
a settings panel.

When there IS no world yet:

**Color strategy before colors.** Pick one: Restrained (neutrals + one accent, the default
when the user came to operate or read), Committed (one saturated color carries 30-60% of
the surface), Full palette (3-4 named roles), Drenched (the surface IS the color).
Persuade and Experience have permission for the bold ones. Color commits at page scale:
regions that own their color, not accents sprinkled on a neutral ground.

**Typefaces are objects from the subject's world.** Operate and Read are well served by
system stacks and workhorse UI faces. Persuade and Experience want a face with a point of
view, and these are the training-data defaults that mean you stopped looking: Fraunces,
Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono,
IBM Plex, Inter-as-display, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans.
Picking one anyway needs a reason no other face satisfies, and "books want a serif" is
exactly the association this list exists to break.

**The calibration check.** AI-generated interfaces cluster on three looks regardless of
subject: warm cream ground + high-contrast serif display + terracotta or signal-red
accent; near-black + one neon accent + glowing edges; broadsheet hairlines + italic serif
display + small tracked mono labels. All legitimate when asked for. If someone could guess
your palette from the category alone, rework it. Warm, bookish or child-facing subjects
come out cream-and-serif by reflex: treat that first palette as already spent.

## 5. Operate surfaces have their own physics

Product UI's failure mode is not blandness, it is strangeness without purpose. The bar is
earned familiarity: a category-fluent user should trust the interface instantly instead of
pausing at every subtly-off component.

- One font family is usually right. No display/body pairing.
- Fixed rem scale, not fluid clamps. A h1 that shrinks inside a sidebar looks worse.
- Tighter scale ratio, 1.125-1.2 between steps. More type roles here than on a brand page,
  so exaggerated contrast is just noise.
- Restrained color is the floor. The accent is for primary actions, current selection and
  state, never decoration. A second neutral layer for sidebars and toolbars.
- Standardize the state vocabulary: hover, focus, active, disabled, selected, loading,
  error, warning, success, info.
- Motion 150-250ms, conveying state only. No page-load choreography, users came to work.
- Same button shape, same form controls, same icon style on every screen. If "save" looks
  different in two places, one of them is wrong.
- Responsive here is structural (collapse the sidebar, reflow the table), not fluid type.
- Density is allowed. Consistency beats surprise. Delight belongs to moments, not pages.

## 6. Build it fully, then stop

- **The first viewport is a thesis, not a header.** If someone left after one screen, what
  would they describe an hour later? If the honest answer is "a mood", it has not committed.
- **Prove, do not claim.** Show the interface at work, the mechanism dramatized, specifics
  a competitor could not paste into their own page.
- **Author the content.** Names, entries, copy, covers, thumbnails. Fake data is design
  material, write it at full fidelity and label it when a visitor could mistake it for
  real. Prices, customers, benchmarks and capabilities stay uninventable: ask.
- **Pace the scroll.** Vary density, scale, image and quiet inside one grammar. A dense
  passage earns a quiet one. End on a real close, not a fade-out.
- **Build the technique, not an imitation of it.** If the direction names canvas, WebGL or
  view transitions, build that, not a static picture of it.
- Preserve semantics, accessibility, performance, and the project's existing conventions.

**Verification is bounded.** Build fully. Inspect once, batched, desktop and mobile in the
same round. Fix everything it shows in one batch. Confirm with at most one more round.
Then stop. Open-ended self-QA is expensive and finds less than a fresh pair of eyes.
