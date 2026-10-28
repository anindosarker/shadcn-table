# 04: ST_Checkbox, tracker

Plan: [04-st-checkbox.md](04-st-checkbox.md). Rulings: [decisions.md](decisions.md), decision 6.
Branch `v0.6/st-checkbox`, worktree `09`, from `claude/review` at `c872dfc4`.

## Phases

- Phase 1, wrapper: `55ce6f0c` feat(registry): ST_Checkbox draws the indeterminate dash.
  `ST_Checkbox.tsx` per edition, the three files differ only in the indeterminate data
  selector (`data-[state=indeterminate]` on radix, `data-indeterminate` on base and aria), the
  prop read (`checked === 'indeterminate'`, `indeterminate`, `isIndeterminate`) and the doc
  comment; listed in `base-diff.json` and `aria-diff.json`. Overlay on all three, aria
  included (not the children render prop), so the files stay alike. `tsc:radix`,
  `tsc:baseui`, `tsc:aria` 0 errors, `lint` clean, `check:bases` green. Selection, SubRowTree,
  Filtering and RowPinningOnSelect stories: 67 of 67 per edition. A throwaway probe story
  (not committed) read the select-all box with one row selected: fill `bg-primary`, part check
  `display: none`, dash 14 x 14 at box + 3 px (centred in the 20 px box), colour
  `primary-foreground`, on all three editions.
- Phase 2, unfork: `967f69c7` refactor(registry): drop the checkbox fork and forkedUi
  (`registry.ts` x3, `lib.mjs`, `lib.d.mts`, radix and base `checkbox.tsx` through
  `pnpm add-part`, `registry.json` rebuilt: `checkbox` in `registryDependencies` of
  `shadcn-table`, `shadcn-table-base`, `shadcn-table-aria`, no `ui/checkbox.tsx` in `files`);
  `cd996d2b` chore(docs): reinstall the library copies for all editions
  (`scripts/install.mjs radix|base|aria`). Full story suite: 446 of 446 per edition.
- Final phase: changelog and standards commit below. Gates in the Gates section.

## Gates

- `pnpm add-part radix checkbox && pnpm add-part base checkbox && git status --short`: empty.
- `grep -rn forkedUi packages/shadcn-table`: nothing.
- `tsc:radix`, `tsc:baseui`, `tsc:aria` 0 errors; `lint` clean; `check:bases` green;
  `registry:build` green, no diff; story tests 63 files, 446 tests green per edition.
- Docs app `tsc --noEmit`: errors only in the ignored, stale generated `examples/.radix/`.
- `pr.yml`: run by the verifier on the PR.

- Review round: fixed all three minor findings, none declined. `add-part --all` lists every `*.tsx` under components/ui (dead fork filter and registry.ts import gone); `lib.mjs` comments no longer mention forked parts; the `ST_Checkbox` dash always renders and shows through `peer-data-[state=indeterminate]:block` (radix) or `peer-data-indeterminate:block` (base, aria), so Radix's uncontrolled `defaultChecked="indeterminate"` gets its dash. tsc and lint green, story tests 446 per edition green, `registry:build` no diff.

## Owner attention

- React Aria checkbox filter (`filterVariant: 'checkbox'`) unset state now shows the dash on
  the muted fill like Radix UI and Base UI; before, the aria part drew its check there. Named
  in the changelog.
- Disabled and indeterminate together (select-all while `isLoading`): the dash is a sibling
  overlay, so it fades with its own `peer-data-disabled:opacity-50` instead of inheriting the
  part's opacity. The dash pixels blend slightly differently from the fork (icon at 50% over
  the faded fill instead of the whole box at 50%); every other state matches.
- `ST_Checkbox` wraps the part in a `relative inline-flex` span (needed for the overlay), one
  extra element around every library checkbox.
