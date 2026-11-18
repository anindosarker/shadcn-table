# Q88 date filter demo, brief for the runner

The owner must choose how the library's date filters look and work (Q88) and will only rule on a picture-perfect demo. Owner, 2026-11-14: "This needs careful consideration, without that it cannot go to the library. So the demo has to be picture perfect first ... assign multiple agents to verify it."

This is a preview for a decision, not library work: no spec, no grid row, nothing merges into `claude/review`. Run it as one Workflow (build, verify with several lenses, fix, verify again).

## Where

- Repo: `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` (its own git repo, no remote, Base UI style `base-nova`). Work in that checkout on its current branch `playground/header-demo-theming`; commit there, no push.
- Page: `app/date-filter-demo/page.tsx` (exists, commit `1cd0d7f`, rejected by the owner: "Looks ugly and doesn't follow theme"). Rework it in place. `components/ui/card.tsx` is untracked, added by the shadcn CLI: keep and commit it. Leave `app/date-picker-demo/` as it is.
- The owner runs the app at `http://localhost:3000`. Never start, stop or restart a dev server. Verifiers open that URL with a headless browser (`agent-browser`); if it does not answer, the workflow stops with that reason.
- Screenshots: `.ai/plans/v0.9.x/anindosarker/reference/q88-date-filter-demo/` in the shadcn-table repo, named `<candidate>-<variant>-<light|dark>.png` plus `page-<light|dark>.png`; commit them on `claude/review` with this brief.

## What the page shows

Three candidates as columns, six rows, one row per library filter variant: `date`, `date-range`, `datetime`, `datetime-range`, `time`, `time-range`. Each cell prints the value the filter would store (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`, `HH:mm`; ranges as two values), built from local date parts.

- A, browser date box plus shadcn Calendar: native `type="date"` in an `InputGroup`, native icon hidden, `min="0001-01-01"` `max="9999-12-31"`, a calendar `InputGroupButton` that opens `Popover` + `Calendar`; in ranges both boxes have the button and share one `Calendar mode="range"`. Time: native `type="time"`, native icon hidden, a themed clock icon as an addon.
- B, shadcn date picker as documented, button trigger: the docs' Basic, Range and Time Picker variants.
- C, shadcn date picker as documented, typed Input variant (free text parsed on change) for dates; time as in B.

## Bar: picture perfect

- Stock shadcn components and compositions only, added through the shadcn CLI, composed exactly as the shadcn docs do (date-picker, calendar, field, input-group, popover, card). Theme tokens only, no hard-coded colors, no custom design.
- Every cell the same width, sized like a filter popup (about `w-80`); controls full width; labels aligned; range pairs built from identical controls; no uneven wrapping at any viewport from 360 px to 1920 px.
- Follows the playground's theme control: light and dark, and at least three of its themes; native parts must sit in the right color scheme. Anything native that cannot follow the theme is listed, not hidden.
- Behavior: typing, picking, range picking, popover placement inside the viewport, Tab order, Escape closes and returns focus, a four-digit year, From after To handled the way the docs' range variant does.

## Verification

At least three independent verifiers on the running page, each with its own lens, reading screenshots, not only code: visual (alignment, spacing, widths, theme, light and dark, narrow and wide), behavior (the list above, per cell), and fidelity (each cell against the shadcn docs' code and look; code review for stock-only and tokens). Findings go back to the builder; verify again; stop when a round returns no finding, three rounds at most. Open findings after round three are listed in the report.

## Report

Send the lead `DEMO Q88 <ready|open findings: n>` with the commit id. Write `report.md` next to this brief: per candidate, what works, what cannot follow the theme, what the docs prescribed that differs from this brief (the docs win), the open findings.
