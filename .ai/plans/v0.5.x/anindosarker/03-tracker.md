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

## Phase 02

Docs and Storybook three-way, from `2e91c678`. The edition switch, `lib/install.ts` `bases`, the agent bar's base menu and the per-base example loader already had React Aria from Phase 01; a grep of `Base UI` across `components` and `lib` found no other edition list.

### Commits

- `docs: React Aria in the install, introduction, agents and localization pages`: `install.mdx` prerequisites name the three bases, the compatibility sentence is "React Aria is supported since 0.5.0", the init note names the `aria-*` style (`aria-nova`), the init and install commands come from the base tabs (`init --base aria`, `/r/aria/shadcn-table.json`), the uninstall list adds `react-aria-components`. `introduction.mdx` names three editions. `agents.mdx`: the skill reads `radix-*`, `base-*` or `aria-*`, the `/r/aria/` address, the `@st` namespace covering `aria-*` styles (the `next.config.mjs` rewrite `/r/:style(aria-.*)`), the `shadcn-table-aria` GitHub fallback, `<base>` radix, base or aria. `localization.mdx`: the aria locale path, the `shadcn-table-aria-locale-de` fallback, a new locale goes in all three trees. "Pick your base with the Radix UI | Base UI tabs" became "with the tabs: Radix UI, Base UI or React Aria" so the plan's `grep "Radix UI | Base UI"` gate stays empty.
- `test(docs): page checks cover the React Aria edition`: `baseSwitch` (`_helpers.mjs`, run by `a` on `/docs/getting-started/usage`) switches Radix to Base UI to React Aria and back; React Aria markup is `[data-rac]` (React Aria Components set it, Radix and Base UI never do), asserted absent on Radix and Base UI and present on React Aria, the code view base-neutral on each (no `ui-aria` either). `demoLoop` (`e` on `/`) holds the demo on React Aria too. `a`: the hero's base menu picks React Aria (`/r/aria/` command, tab label), the install page's compatibility sentence follows the new text plus an `aria-*` style note check, the React Aria tab (init `--base aria`, `/r/aria/` install command, header switch follows, `react-aria-components` in the uninstall list), the agents page lists one address per edition. `c` only had a comment (its tab counts exclude `#nd-subnav`). No existing check was removed or loosened.
- `docs: three editions in the skill and the registry README`: `SKILL.md` (three editions and paths, `--base aria`, `aria-*` detection, the aria command and GitHub items, `react-aria-components` in "What the command adds"). Registry README: three trees and styles, `editions.mjs`, `aria-diff.json`, the n-tree guard, `tsconfig.aria.json`, `tsc:aria`/`test:aria` gates, `add-part aria`, `shadcn-table-aria`.
- `docs: three trees and the n-tree guard in CONTRIBUTING and README`: CONTRIBUTING "Three Trees" (radix the reference, `base-diff.json` and `aria-diff.json`, `editions.mjs`), the aria folder layout, port 6008, `ST_BASE=aria`, the React Aria loop, `lib:install aria`, the fresh React Aria app, the item table row, CI commands, common mistakes. The stories bullet named per-base story files (`<name>.radix.stories.tsx`) that `.storybook/main.ts` never filters; it now says the stories are shared with no per-edition files. Root README status "0.5.0 on TanStack Table v9: three editions", the React Aria install block, the aria GitHub fallback.
- `docs(changelog): React Aria install command and docs edition switch`: the Added entry names `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/aria/shadcn-table.json` and the `@st/shadcn-table` namespace form; a docs line.

### Gates

- `test:aria` on `2e91c678` (no library change here): 63 files, 446 tests pass.
- `storybook:build`, `storybook:build:base`, `storybook:build:aria`; `serve storybook-static -l 6038` (stopped after); `check-storybook.mjs --base http://localhost:6038`: 42 passed, 0 failed (each edition marks itself and links the other two).
- Docs `NEXT_DIST_DIR=.next-verify pnpm build`: pass (tsconfig include rewrite reverted). `types:check`: tsc 0 errors. `lint`: 0 errors, 3 existing warnings.
- `next start -p 5345` (stopped after): `check-pages a` 274 passed, `c` 280 passed, `e` 596 passed, 0 failed.
- Playwright from the scratchpad on 5345: the header switch lists `Radix UI,Base UI,React Aria`; with React Aria selected, `/docs/examples/minimal` (5 rows) and `/docs/guides/toolbar-customization` (3 examples, 60 rows, 103 `[data-rac]` nodes) render, the variant loader's `Loaded` props read `base: 'aria'` for every example panel, no console or page error; the install page's React Aria tab shows `init --base aria` and the `/r/aria/shadcn-table.json` command.
- `grep -rn "Radix UI | Base UI" apps/shadcn-table-docs/content skills packages/shadcn-table/registry/README.md`: empty.
