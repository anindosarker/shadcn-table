# 03: Resize animation, tracker

Status: done
Branch `v0.9/resize-animation`, worktree 03
Checks:
- Red (P11): `ST_BASE=radix vitest run stories/features/ColumnResizing.stories.tsx` at 058b649b + play: fail, ResetSizeAnimates `expected false to be true` on the first `data-size-resetting` assertion after the double click; 24 other tests pass
- `ST_BASE=radix vitest run stories/features/ColumnResizing.stories.tsx stories/features/ColumnOrdering.stories.tsx` at 2dd9c242: pass (37)
- `ST_BASE=base vitest run stories/features/ColumnResizing.stories.tsx stories/features/ColumnOrdering.stories.tsx` at 2dd9c242: pass (37)
- `ST_BASE=aria vitest run stories/features/ColumnResizing.stories.tsx stories/features/ColumnOrdering.stories.tsx` at 2dd9c242: pass (37)
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at 2dd9c242: pass
- `pnpm --filter shadcn-table lint` at 2dd9c242: pass
- `pnpm test typecheck --base radix` at 2dd9c242 + changelog: pass
- `pnpm test lint` at 2dd9c242 + changelog: pass (9 pre-existing warnings in docs examples, none in owned files)
- `pnpm test validate-repo` at 2dd9c242 + changelog: pass (bases identical, tailwind valid, registry valid, 27 unit tests)
- `pnpm test storybook-tests --base radix` at 2dd9c242 + changelog: pass (610)
- Verifier at 2a9057b8: radix typecheck, radix storybook-tests, `pnpm test lint` and validate-repo not rerun (recorded at 2dd9c242 + changelog; diff since touches only .ai/ and CHANGELOG.md)
- `pnpm test typecheck --base base` at 2a9057b8: pass
- `pnpm test typecheck --base aria` at 2a9057b8: pass
- `pnpm test storybook-tests --base base` at 2a9057b8: pass (610) on the rerun; first run 1 failed, ClickToCopy "Click Copies Value" timed out under machine load (29.6 s), passes alone, not in owned files
- `pnpm test storybook-tests --base aria` at 2a9057b8: pass (610) on the rerun; first run 1 failed, RowOrdering "Drag Reorders Rows" timed out at 90 s under machine load, not in owned files
- Acceptance (1.2) at 2a9057b8: `ST_BASE=<base> vitest run stories/features/ColumnResizing.stories.tsx -t "Reset Size Animates"` pass in base, radix, aria; red line on the shipped code recorded above; `pnpm test validate-repo` pass (bases identical, tailwind valid, registry valid, 27 unit tests)

- Task 1 Reproduce (play red on the shipped code): done, d0e887c9
- Task 2 Library (reset helper, transition classes, three bases): done, 2dd9c242
- Task 3 Cleanup: done, changelog commit

## Attention

- Two unlisted flakes seen in the milestone 03 verifier run under load: ClickToCopy "Click Copies Value" (base) and RowOrdering "Drag Reorders Rows" (aria, 90 s timeout); both passed on the rerun. Candidates for the P5 known-flake list.
- The reset helper's `transitionend` listener removes itself only on a `width` or `min-width` event instead of `{ once: true }` (epic 1.6.2): button color transitions bubble to the table too, and `once` would drop the listener on the first of them and leave the attribute stuck. No timer, as D5 says.


## Notes

- The worktree's root `node_modules` lacked `playwright`; `pnpm install --frozen-lockfile --offline` linked it, no `package.json` or lockfile change.
- Generated outputs (registry.json, examples diff lists, docs `components/ui-<base>/`, `public/r/`) not regenerated; validate-repo passes without them.
