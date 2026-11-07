# 01: Filtering, tracker

Status: running
Branch `v0.9/filtering`, worktree 02
Checks:
- `ST_BASE=radix vitest run stories/features/Filtering.stories.tsx stories/features/FilterChips.stories.tsx` at 058b649b (library unchanged, plays added): fail as required, 5 failed, 38 passed. Red lines: ModePickerByDefaultChips `Unable to find role="button" and name "Change filter mode"`; MultiSelectArrayModes `Unable to find role="button" and name "Change filter mode"`; SelectClearBesideChevron `chevron right 265, clear left 241: expected 265 to be less than or equal to 241`; ModePickerByDefaultSubheader `Unable to find an accessible element with the role "button" and name "Change filter mode"`; ModePickerByDefaultPopover `Unable to find role="button" and name "Change filter mode"`
- `eslint --max-warnings 0` on the two story files at task 1: pass
- `tsc -p tsconfig.stories.json --noEmit` at task 1: no error in the two story files (pre-existing errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories, not owned)

- Task 1 Reproduce (plays red on the shipped code): planned
- Task 2 Library (default, multi-select modes, select clear button, three bases): planned
- Task 3 Docs and examples: planned
- Task 4 Cleanup: planned

## Attention


## Notes

