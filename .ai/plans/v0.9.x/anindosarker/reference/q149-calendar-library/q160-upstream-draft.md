# Q160: draft for shadcn-ui/ui (not sent; waits for the owner's go)

## What exists upstream (read 2026-11-24)

- Issue 9401, open since 2026-01-21: "[bug]: Base UI Calendar arrow key navigation is broken". 5 comments, last activity 2026-11-19.
- PR 9402, open since 2026-01-21: "fix(calendar): pass ref to Button for keyboard navigation". Review required, not merged.
- PR 9082, open since 2025-12-15: "fix(calendar): add ref forwarding to Button component for react-day-picker compatibility". Review required, not merged.
- PR 10657, closed unmerged 2026-10-06: "fix: wire Base UI calendar day focus ref".
- `apps/v4/registry/bases/base/ui/calendar.tsx` on main still has no `ref={ref}` on the day `Button` (line 222); `bases/radix/ui/calendar.tsx` has it.

So the bug is reported and two fixes wait for review. A new issue or a third PR would be a duplicate. The useful thing is one comment on issue 9401 with a current reproduction.

## Draft comment for issue 9401

Still reproducible on the current `base-nova` calendar (`shadcn@4.23.0`, registry file read 2026-11-24).

Steps, in a fresh app (`shadcn init -d` with the Base UI base, `shadcn add calendar`):

1. Render `<Calendar mode="single" />` and click a day, for example the 18th.
2. Press the right arrow twice. The focus ring moves to the 20th.
3. Press Enter. The 18th is selected again.

`document.activeElement` stays on the first day after every arrow key, while react-day-picker's focused day moves.

Cause: `CalendarDayButton` creates the ref and calls `ref.current?.focus()` when `modifiers.focused` changes, but the ref is never passed to `Button` (`bases/base/ui/calendar.tsx`, the `<Button` at line 222). The Radix file has `ref={ref}` on that line. Adding the same line to the Base UI file fixes it; checked in the same app, focus then follows each key.

PR 9402 has this change. Is there anything blocking its review?

## Not drafted

- No new issue, no new PR.
