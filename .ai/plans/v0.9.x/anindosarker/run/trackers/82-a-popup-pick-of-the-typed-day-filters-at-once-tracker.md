# 82: A popup pick of the typed day filters at once (Q171), tracker

Status: done
Branch `v0.9/date-pick-of-typed-day-applies`, worktree 06
Checks:
- Check: play first (P11), `ST_BASE=base vitest run stories/features/DateFilters -t "Pick Typed"` on b7004b4d (origin/claude/review, spec 82 merged): passed on the shipped code. Cause, found by logging the box's focus events: a focus move inside the popup (month list to the day) reaches the box's `onBlur` twice, each call starts a commit timer, the box's `onFocus` clears only the second, so the first applied the typed date on the way to the day and hid the bug in this test.
- Check: same play with only that timer fixed (one pending commit, `clearTimeout` before `setTimeout`), base, on b7004b4d plus the timer line: fail, `expected [ 'Ann', 'Ben', 'Cara', 'Dan', …(2) ] to deeply equal [ 'Ben', 'Cara', 'Dan', 'Eve' ]` (the picked typed day did not filter, Q171 reproduced)
- Check: `vitest run stories/features/DateFilters` per base after the fix at 6fc2534c: pass, base 25, radix 25, aria 25
- Check: `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/date-picker'` at 4390024c: pass (prints nothing)
- Check: `pnpm -w registry:build`, `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`, `node apps/shadcn-table-docs/lib/story-pages.mjs` at 6fc2534c: pass; docs copies of `ST_FilterTextField.tsx` per base and the new story page committed as 4390024c (registry.json unchanged)
- Check: `pnpm test typecheck` at 4390024c: pass (base, radix, aria tsc clean)
- Check: `pnpm test lint` at 4390024c: pass (9 warnings, none in the changed files: `eslint` on the four owned files exit 0, no output)
- Check: `pnpm test validate-repo` at 4390024c: pass
- Check: `pnpm --filter shadcn-table-docs types:check` at 4390024c: pass (exit 0)
- Check: `pnpm test storybook-tests --base base` at 4390024c: pass, 638 passed
- Check: `pnpm test storybook-tests --base radix` at 4390024c: pass, 638 passed
- Check: `pnpm test storybook-tests --base aria` at 4390024c: pass, 638 passed
- Check: `pnpm test docs-e2e --base base`, `radix`, `aria` at 4390024c (rerun: the docs copies and a story page changed): pass, each 5 sections, 117 pages, 0 failed

- Check (verifier): files, `git diff --name-only origin/claude/review...HEAD` at aba45fe1: pass, the four owned files, the tracker, CHANGELOG.md, the docs copies (`pnpm --filter shadcn-table-docs lib:install <base>`) and the story page plus more/meta.json (`apps/shadcn-table-docs/lib/story-pages.mjs`)
- Check (verifier): play first, `ST_BASE=base vitest run stories/features/DateFilters -t "Pick Typed"` with the base file of origin/claude/review: passed (1 passed), as the builder found; with only the onClickCapture line removed: fail, `expected [ 'Ann', 'Ben', 'Cara', 'Dan', …(2) ] to deeply equal [ 'Ben', 'Cara', 'Dan', 'Eve' ]`; file restored
- Check (verifier): typecheck, lint, validate-repo, storybook-tests x3, docs types:check, docs-e2e x3 lines at 4390024c stand (only the tracker changed since)
- Check (verifier): `pnpm test installation-e2e --scenario nextjs-base|nextjs-radix|nextjs-aria --no-diff` at aba45fe1 (the item files changed): pass, each built, browser pass, release gate pass
- Check (verifier): stays unchanged, `git diff --stat origin/claude/review...HEAD` on registry/*/components/date-picker, types.ts, index.ts, tools/registry, package.json, pnpm-lock.yaml at aba45fe1: pass (prints nothing); the three base diffs identical
- Check (verifier): no server of this milestone on 5340 to 5360 (5356, 5357 belong to the date picker docs site worktree); worktree clean

- Task 1 A popup pick of the typed day filters at once: done (6fc2534c the fix and the play `Pick Typed Day Applies At Once`; 4390024c docs copies, story page, changelog)

## Notes

- The fix, three bases, `ST_FilterTextField.tsx`: a click on a calendar day (`[data-day]`, the day button of the picker's calendar on every base) applies the typed date first in the box's `onClickCapture`; a different day then fires the picker's `onChange` and applies as a pick. Typing still applies on Enter or when focus leaves the box.
- The second line, one pending blur commit, also stops a typed date applying when focus moves inside the popup where focus events arrive twice (spec 82 1.6.2: the popup counts as inside the box).
