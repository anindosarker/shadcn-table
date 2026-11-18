# D123 Storybook upgrade: compare

After: `4d441d7b` (branch `v0.9/storybook-upgrade-planned`, worktree 08): the upgrade `3f35b7a4` (Storybook 10.6.2 to 10.6.7) plus one merge of `origin/claude/review`, which brought spec 62 (touch drag in menus and toolbars: touch steps added to existing plays in `ColumnGrouping`, `ColumnOrdering` and `SortPopover`, no story added or removed) and spec 62.1 (column auto-scroll stops off the table). Before: the baseline, `57ece654` (`baseline.md`).

## Story tests (`pnpm test storybook-tests --base <base>`)

| Base | Before | After | Names |
|---|---|---|---|
| base | 654 passed, 81 files | 654 passed, 81 files | equal |
| radix | 654 passed, 81 files | 654 passed, 81 files | equal |
| aria | 654 passed, 81 files | 654 passed, 81 files | equal |

- Names: `lists/after/tests-<base>.txt`, from a vitest json reporter run per base; the sorted `file > name` lists equal `lists/before/` on each base (`diff` prints nothing). Spec 62 changes no test name and no count, as expected.
- Load flakes seen and rerun, none caused by the upgrade: the first `storybook-tests --base radix` run after the merge had 1 failure under a load average near 40, the rerun passed 654. The json-reporter runs on radix and aria (same load) failed `ClickToCopy` "Click Copies Value" (known flake, process.md P5) and `FilterChips` "Range Editor Inputs Fit And Fill Date Time" (94 s, a timeout, no assertion); both pass in the `pnpm test storybook-tests` runs of the same commit.

## Static builds (`pnpm test storybook-static --base <base>`)

| Base | Before | After | Story ids | Files | Bytes before | Bytes after |
|---|---|---|---|---|---|---|
| base | reset pass | reset pass | 654, equal | 329, 329 | 19257987 | 19319497 |
| radix | reset pass | reset pass | 654, equal | 329, 329 | 19246841 | 19308351 |
| aria | reset pass | reset pass | 654, equal | 329, 329 | 19307415 | 19369022 |

- Story ids: `lists/after/story-ids-<base>.txt`; `diff` against `lists/before/` prints nothing on each base.
- Size: +61.5 KB (0.3 percent) on each base, the same file count: the Storybook 10.6.3 to 10.6.7 manager and preview runtime (the fixes listed in `audit.md`). Not a failure: the difference is Storybook's own code.

## Captures

- `captures/after/`: 60 story captures and 9 shell captures, made with `tools/capture.cjs` on the three static builds above (port 5341).
- `node tools/diff.cjs captures/before captures/after` over the 69 library captures: 69 compared, 0 differ (pixelmatch threshold 0.1; noise floor of the baseline: zero).
- Shell behaviour, after, same as before on each base: the preview `<html>` class is `dark` before and `light` after the dark mode toggle click (button then reads "Change theme to dark mode"); the base tool moves base to `/radix/`, radix to `/aria/`, aria to `/base/`, same `?path=`.

## Docs story pages

Compared in the "Docs branch catch-up" milestone (Task 4), on `v0.9/docs-branch-catch-up` at `a62678ab` (claude/review merged in, docs app pins `@storybook/react` and `storybook` 10.6.7), worktree 08, docs production build served by `next start` on port 5340.

| Base | Result |
|---|---|
| base | pass, 5 sections, 116 pages, 2564 checks (getting-started 268, api 111, guides 1020, examples 1107, site 58) |
| radix | pass, 116 pages, 2564 checks (same per section) |
| aria | pass, 116 pages, 2564 checks (same per section) |

- Against the baseline's 2561 checks: getting-started has 3 more (268 against 265); the docs branch moved from `6ec25203` (baseline) to `b86ae185` (this branch point) through the hotfixes and fixes merged there, and this milestone changes no getting-started page. Every other section is equal.
- `captures/after/docs-*.png`: the three docs story pages, light and dark, on each base, made with `tools/capture-docs.cjs` on that build. `tools/diff.cjs` against `captures/before/docs-*.png`: 18 compared, 18 differ, every differing pixel in the sidebar (x <= 240): the "More examples" count and the row numbers move by the three story pages the catch-up adds. The page body, the Try it text, the toolbar and the table are equal.
## Differences

| Difference | Cause | Verdict |
|---|---|---|
| Static build size +61.5 KB per base | Storybook 10.6.7 runtime | a Storybook change, not a failure |
| Docs story pages: sidebar count and row numbers | three story pages added by the catch-up (D139, 61.1) | expected, not a Storybook difference |

No other difference.
