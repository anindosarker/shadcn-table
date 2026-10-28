# 03: stories and docs, tracker

Deviations and gate results. Plan: [03-stories-and-docs.md](03-stories-and-docs.md). Rulings: [decisions.md](decisions.md).

## Phase 01

Branch `v0.5/stories-docs` from `claude/review` at `99c533cd`, worktree `07`. Scope: the aria example variants type-check and render (the 19 errors in 10 generated aria examples listed in [02-tracker.md](02-tracker.md)).

### Commits

- `fix(aria): shared prop names at the ST boundary`: `ST_TableHeadCellFilterContainer` (aria tree) takes `open`, `defaultOpen` and `onOpenChange` like radix and base and maps them to the Disclosure's `isExpanded`, `defaultExpanded` and `onExpandedChange` (`open ?? <column filters shown or popover mode>`, as the radix spread lets `open` win). Docs `components/ui-aria` reinstalled (`lib:install aria`). Grep of every other public ST_* prop: `ST_TooltipProps` keeps `open`, `delayDuration`, `disableHoverableContent`; `ST_ActionMenuItem` keeps `onOpenSubMenu`; `isSubMenu` on `ST_FilterOptionMenu` is an aria addition, not a rename. The `isDisabled`/`isSelected`/`isOpen`/`onOpenChange` names elsewhere are on parts or on the part prop types (`ButtonProps`, `CheckboxProps`, `DialogProps`, `ST_PartPropTypes`), left as the aria part shapes.
- `feat(docs): aria example variants type-check`:
  - `lib/example-variants.mjs`: `rewriteAriaParts` for the aria variant, string and regex transforms documented in the header: `<Button disabled>` to `isDisabled`, `<RadioGroup onValueChange>` to `onChange` (both pass the value as a string), `<Tooltip><TooltipTrigger asChild>X</TooltipTrigger><TooltipContent>Y</TooltipContent></Tooltip>` to `<TooltipTrigger>X<Tooltip>Y</Tooltip></TooltipTrigger>` (the aria `TooltipTrigger` takes trigger and tooltip as children) with `TooltipContent` dropped from the tooltip import. Attribute renames scan the opening tag to its `>` outside `{...}` and quotes and rename only names at that level (`renameAttribute`).
  - Example source changed to an edition-neutral form: `custom-headless` rendered the shadcn `Table` part, which on aria is a React Aria collection table (`TableHeader` takes columns, no header row): `pageerror: Cell count must match column count. Found 6 cells and 1 columns.` It now renders plain `table`/`thead`/`tr`/`th`/`tbody`/`td` with the shadcn Table classes (same look on every base; the page's point, your own markup around ST components, unchanged). `registry.json` regenerated: `example-custom-headless` no longer depends on `table`.
  - `tsconfig.json` includes `examples/.aria`. `lib/install.ts` `bases` gains `aria`, label `React Aria`, style `aria-nova` in the comments. Record-per-base fallout: `base-selector.tsx` tab value `react-aria` and `BaseTabs` `aria` content, `example-variant.tsx` aria loader, `storybook-link.tsx` `/aria/`. Comments naming two bases updated (`example-source.ts`, `example-snippet.tsx`, `install-command.tsx`, `site-nav.tsx`, `CONTRIBUTING.md` variants paragraph).
  - `scripts/page-checks/a.mjs`: the base menu expectation is now `Radix UI,Base UI,React Aria` (the only check that failed on the third tab). Iterating aria in the page checks stays Phase 02.

### Gates

- `check:bases`: `radix and base: 142 ... 23 allowed to differ`, `radix and aria: 142 ... 37 allowed to differ`. `tsc:aria`, package `lint`: pass. `test:aria`: 63 files, 446 tests pass.
- Docs `examples:variants` (115 examples, 216 files per edition), `types:check` (tsc 0 errors with `examples/.aria`), `lint` (0 errors, 3 existing warnings), `NEXT_DIST_DIR=.next-p03 pnpm build`: pass (Next's tsconfig include rewrite reverted, `.next-p03` removed).
- `next start -p 5345` (stopped after), Playwright from the scratchpad: the 10 examples on React Aria, Radix UI and Base UI: rows render, no page or console errors; aria Export/selection buttons disabled, the `"remove"` radio checks, the custom filter UI renders its inputs, the refresh tooltip opens on hover and on keyboard focus. Every docs page (94) with the base set to each edition: 109 of 109 example panels render rows, 0 pages with errors.
- `check-pages a` 260, `c` 280, `e` 595 passed, 0 failed; `d /docs/examples/custom-headless` 11 passed.

### Left as is

- The shared example registry items stay the Radix-shaped source (`asChild`, `disabled`): a Base UI or React Aria project that `shadcn add`s `example-react-query` (and the other rewritten examples) gets source its parts reject; the rewrites only feed the docs' live variants. Same as Base UI since 0.3.
