# Attention, 2026-10-29

Judgment calls taken during the unattended 0.6.1 round (parts 03, 04, 05) that the owner may
want to revert. Details and revert paths in the part trackers.

- Part 03: the fixed `add-part` sweep touched 28 parts (9 radix, 7 base, 12 aria), not only
  the probe lists in `02-tracker.md`, and the run did not halt. Every diff is exactly the
  `'use client'` line upstream carries plus a blank line; nothing else moved. Revert: drop the
  three `chore(registry): re-add <edition> parts` commits (`2ae6be38`, `b51fd68b`, `e4bb19d8`).
- Part 03: the `@shadcn/registry` `transform-rsc` `/g` regex report is not filed; an issue on
  `shadcn-ui/ui` speaks for you. Text to paste is in `03-tracker.md` Owner attention.
- Part 03: the root `format` script skips `.mjs`, so `pnpm format` never touches the registry
  and release scripts. Extending the glob reformats three files outside the part; left to you.
- Part 04: React Aria `filterVariant: 'checkbox'` unset state now draws the dash like the other
  editions (the aria part drew a check there before). Named in the changelog.
- Part 04: disabled plus indeterminate (select-all while `isLoading`) blends slightly
  differently from the old fork, the dash fades on its own; one extra `span` wraps every
  library checkbox for the overlay.
- Part 05: `hosted.mjs` now writes the hosted name into locale descriptions, so `/r/base/` and
  `/r/aria/` locale descriptions changed (38 each, `for shadcn-table.`); `/r/radix/` is
  byte-identical. Revert: drop the `description` line in `hosted.mjs`.
- Part 05: alias locale items depend on `anindosarker/shadcn-table/shadcn-table-base`, not on
  the plain alias main item; alias descriptions replace the source description. User docs list
  only the per-edition GitHub names; the plain names are documented for maintainers only.
- Part 05: the edition button's selected state is a 2px bottom bar in `barSelectedColor`, not
  a filled background. Six screenshots in `05-shots/` (44K) can be deleted after review.
- CI: `Profiled Thousand Rows` (aria, vitest browser mode) timed out once at 45 s on PR #53
  run `40759628176` and passed on re-run and on every other run. Flaky on the runner, not
  changed.

## Reviewed 2026-10-29

- Items 1, 4, 5, 6, 7: kept as shipped. Item 7: the plain GitHub names stay a maintainer-only
  fallback.
- Item 2: not filed, already upstream as shadcn-ui/ui issue #12381 with fix PRs #12383 and
  #11918 (both open, unreviewed); our one-invocation-per-part `add-part` stands until a fix
  ships.
- Items 3, 8, 9: decision 8, part 06 (0.6.2).
