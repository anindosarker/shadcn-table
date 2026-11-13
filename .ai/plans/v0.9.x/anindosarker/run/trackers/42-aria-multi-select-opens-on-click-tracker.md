# 42: React Aria multi-select filter opens on click, tracker

Status: running
Runs in milestone Filter editor fixes, tracker 41-range-filter-editor-tracker.md

- P11 before the change, `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Multi Select Opens On Click"` at 052deb67: base pass, radix pass, aria fail: `Unable to find role="option" and name /^Done/`.
- List state right after the chip editor opens (input focused by the editor), before the change: base, radix and aria closed (`aria-expanded="false"`, no option); after one click: base and radix open, aria closed.
- React Aria docs, react-aria-components 1.22.1 (react-stately 3.51.0 `useComboBoxState`): `menuTrigger?: 'focus' | 'input' | 'manual'`, default `'input'`; `'focus'` opens the list whenever the input takes focus (`setFocused` calls `open(null, 'focus')`), programmatic focus included.
- `menuTrigger="focus"` tried: the list opens as soon as the editor focuses the input, React Aria hides the rest of the editor from the accessibility tree, and `MultiSelectArrayModes` fails on aria (`Unable to find role="button" and name "Change filter mode"`). Used instead: the input's click calls `open(null, 'manual')` on the ComboBox state (`ComboBoxStateContext`, React Aria's own state API), in a small wrapper of `ComboboxChipsInput` in `ST_FilterTextField.tsx`; the part file is not edited. After: list closed on editor open, open after one click, on the three bases.
