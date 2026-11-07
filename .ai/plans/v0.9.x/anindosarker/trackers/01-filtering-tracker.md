# 01: Filtering, tracker

Status: merged (4a61e251)
Branch `v0.9/filtering`, worktree 02
Checks:
- `ST_BASE=radix vitest run stories/features/Filtering.stories.tsx stories/features/FilterChips.stories.tsx` at 058b649b (library unchanged, plays added): fail as required, 5 failed, 38 passed. Red lines: ModePickerByDefaultChips `Unable to find role="button" and name "Change filter mode"`; MultiSelectArrayModes `Unable to find role="button" and name "Change filter mode"`; SelectClearBesideChevron `chevron right 265, clear left 241: expected 265 to be less than or equal to 241`; ModePickerByDefaultSubheader `Unable to find an accessible element with the role "button" and name "Change filter mode"`; ModePickerByDefaultPopover `Unable to find role="button" and name "Change filter mode"`
- `eslint --max-warnings 0` on the two story files at task 1: pass
- `tsc -p tsconfig.stories.json --noEmit` at task 1: no error in the two story files (pre-existing errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories, not owned)
- `ST_BASE=<base> vitest run stories/features/Filtering.stories.tsx stories/features/FilterChips.stories.tsx` at 856f5ed6, radix, base, aria one after another: pass, 43 of 43 each (the five new plays green)
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at 856f5ed6: pass
- `eslint --max-warnings 0` on the changed library and story files at 856f5ed6: pass
- `pnpm --filter shadcn-table-docs lint` at 775f0d6e: pass, 0 errors, 9 pre-existing warnings (img elements, one useMemo dep)
- `pnpm test docs-e2e --base base` at 775f0d6e (components/ui-<base> regenerated locally with `pnpm -w registry:build` and `lib:install`, not committed): pass, getting-started 181, api 109, guides 689, examples 936, 0 failed
- `grep -rn "enableColumnFilterModes: true" apps/shadcn-table-docs/examples apps/shadcn-table-docs/content` and `grep -rn "enableColumnFilterModes$" apps/shadcn-table-docs/examples` at 775f0d6e (after `pnpm examples:variants`): both empty
- `pnpm test validate-repo` at 775f0d6e: fail, tailwind-classes flags `pr-9` as physical in the three ST_FilterTextField.tsx; fixed in 0cdfa958
- `pnpm test validate-repo` at 0cdfa958 (generated files as committed): pass
- `ST_BASE=base|aria vitest run` the two filtering story files at 0cdfa958: pass, 43 of 43 each
- `pnpm test typecheck --base radix` at 0cdfa958: pass
- `pnpm test lint` at 0cdfa958: pass, 9 warnings
- `pnpm test storybook-tests --base radix` at 0cdfa958: 613 passed, 1 failed (ClickToCopy "Click Copies Value", clipboard toast under load, not filter code); `ST_BASE=radix vitest run stories/features/ClickToCopy.stories.tsx` twice: pass, 5 of 5
- Verifier at e8158899 (diff from 0cdfa958 touches only .ai/; checks recorded at 0cdfa958 not rerun: typecheck radix, lint, storybook-tests radix, validate-repo):
- `pnpm test typecheck --base base` at e8158899: pass, tsc clean
- `pnpm test typecheck --base aria` at e8158899: pass, tsc clean
- `pnpm test storybook-tests --base base` at e8158899: pass, 79 files, 614 of 614
- `pnpm test storybook-tests --base aria` at e8158899: pass, 79 files, 614 of 614
- `pnpm test docs-e2e --base base` at e8158899 (components/ui-<base> regenerated locally with `pnpm -w registry:build` and `lib:install <base>`, then restored, not committed): pass, getting-started 181, api 109, guides 689, examples 936, 0 failed
- Acceptance rerun at e8158899: `grep -rn "enableColumnFilterModes: true" apps/shadcn-table-docs/examples apps/shadcn-table-docs/content` empty, `grep -rn "enableColumnFilterModes$" apps/shadcn-table-docs/examples` empty, `pnpm test validate-repo` pass (bases identical, tailwind valid, registry valid, 27 unit tests); the five 1.6.5 plays green in base and aria (full suites above) and radix (856f5ed6, 0cdfa958)

- Task 1 Reproduce (plays red on the shipped code): done, 6748d48c
- Task 2 Library (default, multi-select modes, select clear button, three bases): done, 856f5ed6
- Task 3 Docs and examples: done, 775f0d6e
- Task 4 Cleanup: done, 0cdfa958

## Attention

- The select trigger takes `ltr:pr-9 rtl:pl-9`, not the `pr-9` D1 names: `pr-9` fails the logical-direction rule of `pnpm test validate-repo`, which the Acceptance line requires green. The pair keeps the D1 outcome (chevron left of the clear button) and also pads the correct side in RTL. Revert means an exception in `test/validate-repo/lib/tailwind-classes.mjs`.
- Removing a chip or "Clear filters" now puts the column on its initial filter mode (`table.initialState.columnFilterFns`), falling back to the first listed mode only when the initial one is not offered. Before, it took the first mode of the list, which with modes on by default would turn a multi-select column into `fuzzy` and a select column away from `equals` after one removal.
- `filterArrIncludesSome` and `filterArrIncludesAll` already existed in `ST_Localization`; only `filterArrIncludesNone` is new. Every locale's `filterArrIncludesSome` was retranslated to "includes any", and `filterArrIncludesAll` was reworded in az, fr, hy, it, pt, pt-BR, ru, tr, uk, zh-Hans, zh-Hant where the old text was an imperative ("include everything") rather than "includes all".
- With modes on by default every chip names its mode ("Status fuzzy: Done" instead of "Status: Done"); AddThroughPicker and RemoveAndClear in FilterChips.stories.tsx assert the new text (D4 says chips show the mode as /docs/examples/advanced does).
- The persistent-view example loses its "the only column with a filter mode picker" comment with the flag (1.6.6), so every text column of that example now has a picker.

## Notes

- The worktree root lacked the `playwright` link, so `pnpm test docs-e2e` could not import it; `pnpm install --frozen-lockfile --offline` restored the links without touching package.json or the lockfile.
- `pnpm format` (whole repo) ran once at task 1 and took over 10 minutes on the loaded machine; later commits ran `prettier --write` on the changed files only (same config).
- Generated outputs (registry.json, public/r, components/ui-<base>, examples-*-diff.json) are not committed; validate-repo passes without them.
