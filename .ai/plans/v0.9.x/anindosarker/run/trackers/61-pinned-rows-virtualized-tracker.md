# 61: Pinned rows stay in view with row virtualization, tracker

Status: done (ee1c2837)
Branch `v0.9/pinned-rows-virtualized`, worktree 06
Checks:

- `ST_BASE=base vitest run stories/features/RowPinning.stories.tsx`, afc48d1e on the pre-fix library: fail as required (P11). `Row Pinning Sticky With Virtualization`: after the scroll to the middle "row 0 rendered" is undefined (the pinned row left the rendered range); the other 17 plays pass
- `ST_BASE=<b> vitest run` RowPinning + Virtualization stories, 9fb9bff0: base, radix, aria each 37 passed (the new play, `PinRowTopMode`, `PinRowSticky`, `UnpinRow`, every `Features/Virtualization` play)
- `pnpm test typecheck --base base|radix|aria`, 9fb9bff0: tsc clean on all three
- Side by side (Task 3), 9fb9bff0, storybook dev on port 5341 (base) and 5342 (radix, aria), Playwright script: `RowPinningWithStickyHeader` (no virtualization, sticky header, 600px box) against `RowPinningStickyWithVirtualization`, rows 0, 1, 48, 49 pinned, scrolled end to end in 10px steps (185 steps), pinned row tops measured against the box after each step. Base: same place at every step (within 1px; the reference's sticky footer gives its bottom stack the 1px), 0 jumps. Radix: same, 0 jumps. Aria: same, 0 jumps. Servers stopped
- `git diff origin/claude/review -- apps/shadcn-table-docs/content/docs/guides/row-pinning.mdx`, e1f895cf: the note line 77 and one blank line removed, nothing else
- `pnpm format`, cd3eb075: no change beyond the changelog block
- `pnpm registry:build`, cd3eb075: registry.json unchanged
- `pnpm test lint`, cd3eb075: pass (9 warnings, all in docs app files this milestone does not touch)
- `pnpm test validate-repo`, cd3eb075: pass
- `pnpm test storybook-tests --base base`, cd3eb075: 652 passed
- `pnpm test storybook-tests --base radix`, cd3eb075: 652 passed
- `pnpm test storybook-tests --base aria`, cd3eb075: 652 passed
- Verifier, cd3eb075: lint, validate-repo, storybook-tests base/radix/aria recorded at HEAD, not rerun
- Verifier, cd3eb075: `pnpm test typecheck --base base|radix|aria` rerun (an mdx file changed after 9fb9bff0): tsc clean on all three
- Verifier, cd3eb075, Acceptance (1.2) rerun: `ST_BASE=<b> vitest run stories/features/RowPinning.stories.tsx` base, radix, aria each 18 passed (incl. `Row Pinning Sticky With Virtualization`, `PinRowSticky`, `PinRowTopMode`, `UnpinRow`); pre-fix failure recorded at afc48d1e (P11); all Acceptance commands green at HEAD
- Verifier: origin/claude/review is at d8a67b87 (plan-only commits past c520d014); `git merge-tree` HEAD with it: clean

- Task 1 The play first: afc48d1e
- Task 2 Pinned rows stay rendered and placed: 9fb9bff0
- Task 3 Same as without virtualization: 9fb9bff0 (no code change)
- Task 4 The guide line: e1f895cf
- Task 5 Cleanup: cd3eb075

## Attention

- 1.6.3 says a pinned virtual row keeps `position: absolute` with an offset kept between the stacks. Built instead with CSS sticky: the body gives each rendered sticky pinned virtual row its own grid track at its list offset (`grid-template-rows`, `align-content: start`) and the row is `position: sticky` with the same top and bottom insets as a row without virtualization. Reason: the virtualizer re-renders only when its range changes, not on every scroll pixel, and a scroll-handler offset lags the compositor by a frame, so an absolute pinned row would jump while scrolling (Task 3). Unpinned virtual rows, overscan and the non-sticky modes are unchanged.
- Task 3 reference: `PinRowSticky` renders the paginated 10-row story with no scroll box, so the side-by-side used `RowPinningWithStickyHeader` (same 50 rows, 600px box, sticky header, no virtualization) as the non-virtualized reference.
