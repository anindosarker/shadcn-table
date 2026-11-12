# 14: The Icon Library select switches the example tables' icons, tracker

Status: merged (39dc76e7)
Branch `v0.9/icon-library-select`, worktree 04
Checks:
- `pnpm test typecheck --base radix` at c827660c + Task 1 files: pass (the docs and registry tsconfigs do not include stories/, so the story red is read from the stories tsconfig below)
- `tsc -p packages/shadcn-table/tsconfig.stories.json --noEmit` at c827660c + Task 1 files: fail as expected, `Icons.stories.tsx(5,3): TS2305 no exported member 'ST_DefaultsProvider'` (P11); 3 older errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories are not this milestone's
- `ST_BASE=radix vitest run stories/features/Icons.stories.tsx` at c827660c + Task 1 files: fail as expected, "does not provide an export named 'ST_DefaultsProvider'" (P11)
- `pnpm test docs-e2e --base base /` at c827660c + Task 1 files: fail as expected, 3 failed: `icons: Tabler switches the home tables` (picked=false, the select is disabled), `icons: the pick survives a reload` (stored=lucide), `icons: Shift+R returns to Lucide` (P11)
- `pnpm test docs-e2e --base base /docs/examples/basic` at c827660c + Task 1 files: fail as expected, 1 failed: `basic: stored Tabler pick switches the example icons` (class lucide lucide-search) (P11)
- `pnpm install --frozen-lockfile` after the Task 2 install at a59bca71 + Task 2 files: pass, clean
- `pnpm test typecheck --base radix`, `--base base`, `--base aria` at 15ddc6da + Task 3 files: pass, tsc clean
- `ST_BASE=<base> vitest run stories/features/Icons.stories.tsx` for radix, base, aria at 15ddc6da + Task 3 files: pass, 1 passed each
- `eslint` on the Task 3 library files and the story: pass
- `ls components/ui-<base>/shadcn-table/icons/` for radix, base, aria at efd1087f + Task 4 files: pass, hugeicons phosphor remixicon tabler in each
- `pnpm test validate-repo` at efd1087f + Task 4 files: pass (bases identical, icon maps complete, registry valid, 27 unit tests)
- `pnpm --filter shadcn-table-docs types:check` at c06f68ee: pass
- `pnpm test docs-e2e --base base /` at c06f68ee: fail 3 times on the theme hotkey checks (`theme: r changes --primary` and the three after it; icon checks pass); cause measured: the home demo replays while centered (demoLoop leaves it there) and moves focus into its search field, where the theme keys are ignored; under load `r` also lands about 1.1 s late against the 200 ms wait (Q23). Not caused by this milestone's code (the hotkeys fire in a probe on the same build)
- `pnpm test typecheck --base radix`, `--base base`, `--base aria` at bf40fd6a: pass, tsc clean
- `pnpm test lint` at bf40fd6a: pass (9 warnings in the docs app, none in this milestone's files)
- `pnpm test validate-repo` at bf40fd6a: pass
- `pnpm test storybook-tests --base base` at bf40fd6a: 617 passed, 2 failed (`RowOrdering` "Drop Slides Rows" 91 s timeout and "Drop No Slide Reduced Motion", CPU idle under 1 percent); rerun of `RowOrdering.stories.tsx` on base: 9 passed
- `pnpm test storybook-tests --base radix` at bf40fd6a: 618 passed, 1 failed (`ClickToCopy` "Click Copies Value", P5 flake); rerun of `ClickToCopy.stories.tsx` on radix: 5 passed
- `pnpm test storybook-tests --base aria` at bf40fd6a: pass, 619 passed (Icons play included)
- `pnpm test docs-e2e --base base /` at 408a7ba9: pass (theme checks and the three icon checks)
- `pnpm test docs-e2e --base base /docs/examples/basic` at 408a7ba9: pass
- Verifier at 5cb8af69 (bf40fd6a..HEAD touched `test/docs-e2e/lib/getting-started.mjs`, so its checks rerun; the docs-e2e lines at 408a7ba9 stand, .ai-only diff since):
- `pnpm install --frozen-lockfile` at 5cb8af69: pass, clean
- `pnpm test typecheck --base radix`, `--base base`, `--base aria` at 5cb8af69: pass, tsc clean
- `pnpm test lint` at 5cb8af69: pass (9 warnings, 0 errors)
- `pnpm test validate-repo` at 5cb8af69: pass (bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests)
- `pnpm test storybook-tests --base base` at 5cb8af69: pass, 619 passed (Icons play included)
- `pnpm test storybook-tests --base radix` at 5cb8af69: pass, 619 passed
- `pnpm test storybook-tests --base aria` at 5cb8af69: pass, 619 passed
- Merge of `origin/claude/review` into the branch at 450ee4f7 (conflict in `getting-started.mjs`: kept claude/review's F23/F24 helpers, added the `themeIconLibrary` call, which now takes the shared `closePanel`); lockfile unchanged, regenerated copies unchanged
- `pnpm test typecheck --base radix` at 450ee4f7: pass, tsc clean
- `pnpm test lint` at 450ee4f7: pass (9 warnings, 0 errors)
- `pnpm test validate-repo` at 450ee4f7: pass (bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests)
- `pnpm test docs-e2e --base base /` at 450ee4f7: pass, 73 passed (theme hotkey, picker and the three icon checks)
- `pnpm test docs-e2e --base base /docs/examples/basic` at 450ee4f7: pass, 15 passed

- Task 1 Reproduce (story typecheck and the icon checks red on the shipped code): done, a59bca71
- Task 2 Dependencies (the five icon packages): done, 15ddc6da
- Task 3 Library (ST_DefaultsProvider, hook merge, exports, types): done, efd1087f
- Task 4 Installer and copies (icons/<set>.ts per base): done, 7d8d71a0
- Task 5 Docs (config, select, example-icons, layout, API page, guide): done, 408a7ba9
- Task 6 Cleanup: done, bf40fd6a

## Attention

- Random keeps the current icon library: `shuffleConfig` sets `iconLibrary: current.iconLibrary` on every shuffle, since the curated presets name icon libraries of their own and the spec says Random does not change it; the spec text only named `randomFields` keeping the default (which would reset a Tabler pick to Lucide on Random). Revert by dropping that line in `lib/design-system/config.ts`.
- The theme hotkey checks on `/` (`theme: r changes --primary` and after) fail whenever the home demo is in view: `demoLoop` leaves it centered, the replay restarts after each reload and moves focus into its search field, where the panel's single-key shortcuts are ignored. At the top of the page the demo holds, but then the first Escape only dismisses the focused Reset button's tooltip and leaves the panel open. For F23: scroll to the top before the panel checks and close the panel with Escape until it detaches; this milestone did that only in its own icon checks to stay off F23's lines.
- The Task 1 story red is read from `tsc -p packages/shadcn-table/tsconfig.stories.json` and vitest: `pnpm test typecheck` does not include `stories/`, so it stayed green on the shipped code. The stories tsconfig carries 3 older errors (HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories).
- The one `pnpm install` also re-resolved `@emnapi/core` and `@emnapi/runtime` peers in the lockfile (1.11.0 to 1.9.2 inside the vite/vitest peer strings); `pnpm install --frozen-lockfile` is clean.

## Notes

- `components/example-icons.tsx` imports `ST_DefaultsProvider` from each copy's `hooks/useST_Defaults` file, not the index, so the layout does not pull the whole library into every page.
