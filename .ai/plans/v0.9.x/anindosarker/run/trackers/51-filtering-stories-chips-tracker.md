# 51: Filtering stories show chips, tracker

Status: running
Branch `v0.9/filtering-stories-chips`, worktree 06
Checks:
- Check: vitest before the change, `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx` at 7df6f7a2: pass, 37/37 on base, radix, aria
- Check: vitest Task 1, same command at f88052be: pass, 37/37 on base, radix, aria
- Check: plain stories under chips, Storybook :5346 (playwright, Filter menu, chip editor) at f88052be: pass on base, radix, aria (lines below)
- Check: sidebar names and ids, Storybook base :5346 `index.json` at 2469c649: pass, 9 names "Subheader: ...", ids unchanged; screenshot /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/18a7d8fb-53ed-4e77-8be8-85309efc0f16/scratchpad/shots/sidebar-subheader-names.png
- Check: `pnpm format` at 2469c649: pass, no changes
- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 2469c649: pass
- Check: `pnpm test lint` at 2469c649: pass (9 warnings, all in apps/shadcn-table-docs/examples)
- Check: `pnpm test storybook-tests --base base` at 2469c649: fail once (CustomFilterFns "Global Filter Mode Switch"), rerun pass 651/651
- Check: `pnpm test storybook-tests --base radix` at 2469c649: pass 651/651
- Check: `pnpm test storybook-tests --base aria` at 2469c649: pass 651/651
- Check: Acceptance at 0bf55cc7: vitest 37/37 on base, radix, aria; no changed line inside a play; no `subheader` between the export of each of the 10 stories and the next export
- Check: Storybook server on 5346 stopped

Plain stories under chips (no subheader inputs in thead on any base):
- FilterFnAndFilterVariants: Filter menu lists all 11 columns, State chip editor opens with the multi-select (base, radix, aria)
- FilterFnAndFilterVariantsFaceted: Filter menu lists 5 columns, State chip editor opens with faceted options (base, radix, aria)
- FilteringChangeModeEnabled: Age chip editor has the mode button, 14 modes (base, radix, aria)
- DisableSomeFilterTypesForCertainColumns: Last Name chip editor offers 4 modes (startsWith, endsWith, empty, notEmpty) (base, radix, aria)
- FilteringDisabledForCertainColumns: Filter menu lists First Name, Last Name, Gender, State; Age and Address absent (base, radix, aria)
- CustomFilterFunctionPerColumn: State "ca" filters the rows by startsWith (base, radix, aria)
- CustomFilterFns: State "ca" filters the rows through customFn (base, radix, aria)
- CustomFilterComponent: Gender chip editor renders the custom NativeSelect; Male filters the rows (base, radix, aria)
- CustomizeFilterTextFields: Gender chip editor shows the select variant (base, radix, aria)
- ExternalSetFilterValue: Find Joes adds a "First Name fuzzy: Joe" chip and filters the rows (base, radix, aria)

- Task 1 plain stories and ChangeModeTable: done (f88052be)
- Task 2 Subheader names: done (2469c649)
- Task 3 cleanup: done (0bf55cc7)

## Attention

- `CustomFilterFns.stories.tsx` "Global Filter Mode Switch" (base) failed once in storybook-tests under load (`expected [ 'Mason', 'Anderson', 'Lily', …(2) ] to deeply equal [ 'Lily' ]`) and passed on rerun; it is not on the P5 flake list.
- P5 names the aria flake `Filtering` "Multi Select Field Controls"; that story now shows as "Subheader: Multi Select Field Controls".
