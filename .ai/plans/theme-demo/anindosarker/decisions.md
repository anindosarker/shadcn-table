# Theme demo: decisions

Taken 2026-10-28. Plan: [theme-demo-plan.md](theme-demo-plan.md).

## Format

1. Live component on the site, not a video.
   - Why: the homepage already ships the `ShadcnTable` chunk, so the demo costs a few KB of
     code plus fonts, against 1 to 2 MB of video. Real text, follows light/dark, clickable,
     never goes stale when the table UI changes.
   - A short recorded clip is still wanted for the README, where JS cannot run. Out of scope
     for this plan.

## Scope of the theme

2. The demo theme applies to a wrapper, never to `<html>`. The rest of the page keeps the site
   theme.
3. Portalled content (dropdowns, popovers, selects, tooltips, dialogs) must show the demo
   theme, not the site theme. Owner chose option (a), a portal container.
   - Finding: the table and its shadcn/ui parts expose no portal container prop.
   - Ruling: no library change for a docs demo. The demo reaches portals with a scoped
     stylesheet: while the demo owns focus or the last pointer down, `<html>` carries
     `data-demo-theme-owner`, and the stylesheet applies the demo tokens to portal roots
     under `body`. Adding a real `portalContainer` option to the library is a separate,
     later decision.

## Variants

4. Build several variants and review them on `/dev/theme/<n>` before one goes on the
   homepage and the theming docs page. Agents build them; the main session plans and reviews.
5. Demo themes are a dedicated set that differ in colour, font and radius, not the six site
   presets (which only change hue). No real brand names in theme labels.
