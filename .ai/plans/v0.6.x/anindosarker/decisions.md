# v0.6.x: decisions

Rulings taken 2026-10-28 in chat after the 0.5.1 release. The 0.4.x and 0.5.x rulings
([../../v0.4.x/anindosarker/decisions.md](../../v0.4.x/anindosarker/decisions.md),
[../../v0.4.x/anindosarker/decisions-review.md](../../v0.4.x/anindosarker/decisions-review.md),
[../../v0.5.x/anindosarker/decisions.md](../../v0.5.x/anindosarker/decisions.md)) stay in
force; nothing here re-decides them.

## Examples per edition

1. The docs examples follow the library's edition model: one complete hand-written set per
   edition, `apps/shadcn-table-docs/examples/<edition>/<slug>/` for every edition in
   `EDITIONS`, instead of one Radix-shaped source rewritten per edition. Why: the registry
   items `example-<slug>` under `/r/base/` and `/r/aria/` embedded the Radix source, so
   `shadcn add` on an example using `asChild`, `disabled` on `Button`, `onValueChange` on
   `RadioGroup` or the Radix tooltip composition gave Base UI and React Aria projects code
   their parts reject; the string rewriter in `lib/example-variants.mjs` only knew those four
   shapes and `custom-headless` already needs a structurally different aria file. Hand-written
   copies are idiomatic per edition and type-check against the real parts.
   - Guard, same as `check-bases.mjs`: `scripts/registry/examples-<edition>-diff.json` lists
     the example files allowed to differ from radix; every other example file must be
     byte-identical across the three folders and present in all of them; CI `bases` job fails
     otherwise. Starts with the nine examples that use edition-specific part props plus
     `custom-headless` for aria.
   - `scripts/registry/examples.mjs` builds `/r/<edition>/example-<slug>.json` from that
     edition's folder; the base and aria example sets are type-checked against their installed
     parts in CI.
   - The prop rewrite in `lib/example-variants.mjs` is deleted. The import rewrite
     (`@/components/ui/` to `@/components/ui-<edition>/`) stays, because the docs app installs
     three part copies side by side while a user's project has one; the code view keeps
     showing `@/components/ui/`.
   - Stories stay one set: they exercise the library API, identical across editions, and
     already run per edition through `ST_BASE`.
   - No edition rename: shadcn's own slugs are `base`, `radix`, `aria`
     (ui.shadcn.com/docs/components/<slug>/*, styles `base-nova`, `radix-nova`, `aria-nova`),
     already ours.

## shadcn parts

2. shadcn parts (`registry/<edition>/components/ui/<part>.tsx`) are never edited; they are
   what `shadcn add <part>` installs, formatted by `scripts/registry/add-part.mjs`. A check
   that fails on a part is fixed in the check. Why: the aria `label.tsx` part was edited
   (unused `import * as React`, TS6133) to satisfy `noUnusedLocals` in `tsconfig.radix.json`,
   which every edition inherits; the config was the problem, the part was not.
   - `label.tsx` is restored through `add-part.mjs`.
   - `noUnusedLocals` and `noUnusedParameters` leave the tsconfigs (TypeScript cannot exempt a
     path); unused code is ESLint's job: `@typescript-eslint/no-unused-vars` for the library,
     parts (`registry/*/components/ui/*.tsx`) in `globalIgnores`, the folded MRT core gets
     the rule with `args: 'none'` instead of `off` so no check is lost.
   - Standards gain one line under Editions.
   - No upstream report to shadcn; the part is used as shipped.

## Release

3. Decisions 1 and 2 ship together as 0.6.0 (`release:minor`), the next PR into `master`.

## Upstream part defects

4. A defect in a shadcn part is upstream's, not ours: the part stays as shipped (decision 2),
   no fork, no upstream report unless the owner asks. The docs name it as a known issue with the
   user's own fix, and a CI install scenario applies exactly that documented step, nothing
   more. First case: the `aria-nova` `label` part's unused `import * as React` fails Vite's
   `noUnusedLocals` (TS6133) in a fresh `shadcn init --template vite --base aria` app. The
   install page's React Aria tab says so and tells the user to delete that import line in
   `components/ui/label.tsx` or set `noUnusedLocals: false`; `install.yml`'s aria scenario
   deletes the line after `shadcn add`, with a comment naming the defect. The `CHANGELOG.md`
   workaround line part 02 added is removed. Why: the owner ruled the defect is shadcn's and
   the registry should carry no corrected copy; a red CI scenario or a hidden type error would
   both misreport what users see.

## add-part determinism

5. `scripts/registry/add-part.mjs` is made deterministic, then every part in every edition is
   re-added once, one commit per edition. A follow-up part, not a 0.6.x patch; nothing in it is
   user-facing. Why: the decision 2 gate (`pnpm add-part <edition> <part> && git status --short`
   prints nothing) only holds today by invocation order. The 2026-10-28 probe (`shadcn`
   4.22.0, `@shadcn/registry` 0.2.0) rewrote 10 radix, 9 base and 7 aria parts nobody had
   edited, see `02-tracker.md` "Part drift". Users never run the script and never receive
   these copies: non-forked parts reach them as `registryDependencies` from ui.shadcn.com,
   only `forkedUi` files ship from our tree.
   - `'use client'`: `@shadcn/registry` `transform-rsc` tests the directive with a `/g` regex,
     so `lastIndex` carries across files and the directive is stripped from every other file
     in a run. `add-part.mjs` stops trusting that transform: after the CLI runs, the script
     sets the directive on each copied file from the upstream item JSON content (`rsc: false`
     applied by us, per file).
   - `font-heading`: the CLI drops the class because the scratch `index.css` declares no
     `--font-heading`. The scratch stylesheet declares it.
   - The regex is reported to `@shadcn/registry` as an upstream bug.
   - Rejected: a check-side normaliser that ignores the directive and the class (keeps the
     churn, hides it); documenting the gate as "no diff beyond those two" (manual judgment).

## Checkbox fork

6. The `checkbox` forks go. The library gets its own `ST_Checkbox` at
   `components/ui/shadcn-table/ST_Checkbox.tsx` per edition, a wrapper over shadcn's
   `Checkbox` like `ST_Tooltip.tsx` over `tooltip`: it adds the indeterminate styling and
   draws a dash (`MinusIcon`) for the indeterminate state, the part stays untouched.
   `ST_SelectCheckbox`, `ST_FilterCheckbox` and `types.ts` (`CheckboxProps`) import it.
   `registry/{radix,base}/components/ui/checkbox.tsx` are restored through `add-part.mjs`,
   `checkbox` becomes a `registryDependency` on every edition and `forkedUi` leaves
   `registry.ts` and `lib.mjs`; decision 2 holds with no exception and the standards bullet
   loses the `checkbox` clause. Why: the fork is a deliberate design change, not a defect fix,
   so decision 4 does not cover it, and shipping it under shadcn's own file name replaces the
   user's `components/ui/checkbox.tsx` across their app. The aria tree already does the
   wrapper inline in `ST_SelectCheckbox.tsx` (the aria part renders children), so `ST_Checkbox`
   is an extraction there; the radix and base parts render no children, so those two wrappers
   either overlay their own icon on the part or compose the primitive with shadcn's class
   string. The gate is the decision 2 one: `pnpm add-part <edition> checkbox` leaves no diff.
   - Upstream: shadcn-ui/ui#8042 (radix, auto-closed stale 2026-08-29) and #9373 (base, open,
     issue #9357) already propose this; no new PR, a comment with our diff on #9373 at most.
   - Ships as 0.6.1, `release:patch`: no visible change on any edition, the dash already
     renders on all three.

## Edition selector

7. Base UI is the preselected edition wherever the reader picks one: the docs edition tabs
   (`lib/base-tabs.mjs`, `defaultBase` in `lib/install.ts`) open on Base UI, and the Storybook
   root (`storybook.shadcn-table.com/`) redirects to the Base UI build. Why: shadcn's own docs
   default to Base UI since nova. Decided 2026-10-29, ships in 0.6.1.
   - No edition lives at the Storybook root. The three builds sit under `/radix/`, `/base/`
     and `/aria/` (`storybook:build` writes `storybook-static/radix`), and `/` redirects to
     `/base/` with the query string kept, a Vercel redirect on the `storybook.` host in
     `vercel.json`. Existing `/base/` and `/aria/` links keep working; old root links land on
     Base UI, one toolbar click away from Radix UI. `staticEditionRoot`, `check-storybook.mjs`,
     `smoke.mjs` and the docs `storybook-link.tsx` follow. Moving Base UI to the root instead
     would have broken every `/base/` link and silently flipped every root link.
   - The Storybook edition tool marks the current edition with a visible selected state on its
     button, nothing else; today all three buttons look the same.
   - `REFERENCE_EDITION` stays `radix` for `check-bases.mjs`: it is the diff baseline, not a
     default. Dev ports stay 6006 radix, 6007 base, 6008 aria; `editionHref` maps by a port
     table instead of `EDITIONS` order if the order changes.
   - No default registry anywhere. The committed `registry.json` names every item with its
     edition: `editionItemName` returns `${name}-${edition}` for all three editions, so the
     radix items become `shadcn-table-radix`, `shadcn-table-radix-locale-*`,
     `example-<slug>-radix`. Repo-internal: `hosted.mjs` already serves the plain name under
     `/r/<edition>/`, so the hosted output is byte-identical and nothing changes for users.
   - GitHub shorthand aliases (added 2026-10-29). `npx shadcn add anindosarker/shadcn-table/<item>`
     reads the committed catalog and cannot pick an edition: no `{style}` substitution, static
     item content (the hosted `@st` namespace does pick it, through `{style}`). So `build.mjs`
     emits the plain names (`shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`) as
     generated aliases of the Base UI items, same `files`, description naming the alias, in
     line with Base UI as the default a reader sees. Before 0.6.1 the plain names were the
     Radix UI items; that path was never documented and the changelog names the change.
     `hosted.mjs` ignores the aliases.

## Edition order and selectors

8. Base UI is listed first, and both edition selectors are dropdowns. Decided 2026-10-29 on
   review of the 0.6.1 result (`ATTENTION-2026-10-29.md`, item 8), ships in 0.6.2.
   - Order Base UI, Radix UI, React Aria everywhere a reader sees the editions: `EDITIONS`
     becomes `['base', 'radix', 'aria']` and is the only order source; the docs app's own
     `bases` copy (`lib/install.ts`) goes, the docs derive from `EDITIONS`. Prose lists in
     the docs, `README.md`, `SKILL.md` and `CONTRIBUTING.md` follow. The `README.md` primary
     install block is Base UI; Radix UI and React Aria sit in the fold. Why: Base UI is the
     default a reader sees (decision 7), so it comes first; today Radix UI is first and the
     order is set in two places.
   - The docs header selector is a dropdown: a select button showing the current edition
     with a chevron, styled like the example page's `Copy prompt` split control, opening a
     `DropdownMenuRadioGroup` with the three editions (the agent bar's "Choose base" menu).
     The fumadocs pill tabs go from the header; `BaseTabs` on the install, init and
     best-practices pages stay tabs.
   - The Storybook edition tool is a dropdown too: Storybook's own `Select` from
     `storybook/internal/components`, the component behind the built-in viewport and
     background pickers, three options, the current edition preselected, choosing another
     navigates the top frame to the same story in that edition. The 2px bottom bar from
     0.6.1 goes. Why: the owner found three same-looking buttons with a bottom bar hard to
     read; the native picker is what the rest of the toolbar already uses.
   - No unsuffixed edition script. `storybook`, `storybook:build`, `test` in
     `packages/shadcn-table/package.json` become `storybook:radix`, `storybook:build:radix`,
     `test:radix`; the root `storybook`, `storybook:all`, `storybook:build` and `turbo.json`,
     `vercel.json`, `pr.yml`, `preview.mjs`, `CONTRIBUTING.md` follow. `resolveEdition` with
     `ST_BASE` unset or unknown falls back to `DEFAULT_EDITION` (Base UI), no longer to
     Radix UI, so a bare `vitest` (editor test runners, Storybook's `addon-vitest` panel)
     keeps working on the tree a reader sees first. An exit on unset `ST_BASE` was
     considered and dropped: it would need per-editor env config for no gain.
   - Dev ports keyed by edition name, not by `EDITIONS` index: Radix UI 6006, Base UI 6007,
     React Aria 6008 unchanged, in one `EDITION_PORTS` table in `editions.mjs` read by
     `package.json` scripts, `preview.mjs` and `edition-tool.ts`.
   - `REFERENCE_EDITION` stays `radix`: `check-bases.mjs` diffs against it and hand edits
     land in `registry/radix` first. Display order and diff baseline are separate concerns.
   - The home page terminal demo (`theme-demo/variants/terminal.tsx`) runs its commands on
     `DEFAULT_EDITION`, not a hardcoded `radix`.
   - Ride-alongs in the same part: the vitest browser `testTimeout` goes from 45 s to 90 s
     (`Profiled Thousand Rows` took 48 s once on the runner, PR #53); the root `format`
     script's glob gains `mjs`, so the registry and release scripts are formatted like the
     rest (three files reformat once). The six `05-shots/*.png` are deleted.

## Base naming

9. One word for the shadcn base concept: `base`, as shadcn names it; `edition` goes. Decided
   2026-10-29, ships in 0.6.3.
   - shadcn's own code calls the concept `base` and the Base UI value `base`
     (`PRESET_BASES = ['radix', 'base', 'aria']`, `BASES` with `{ name: 'base', title: 'Base UI' }`,
     `--base <base>`, "the component library to use"), and disambiguates only through the
     label `Base UI` wherever a human reads it. This repo had both words: the docs app said
     `base` (`BaseSwitch`, `defaultBase`, `--base`, `check-bases`), the library scripts and
     Storybook said `edition` for a library tree per base. Full rename, not reader-facing
     strings only, so the repo matches shadcn one to one and the standards keep "one term per
     thing".
   - Identifiers: `EDITIONS` to `BASES`, `REFERENCE_EDITION` to `REFERENCE_BASE`,
     `DEFAULT_EDITION` to `DEFAULT_BASE`, `EDITION_LABELS` to `BASE_LABELS`, `EDITION_PORTS` to
     `BASE_PORTS`, `resolveEdition` to `resolveBase`, `editionItemName` to `baseItemName`, type
     `Edition` to `Base`; files `editions.mjs` and `editions.d.mts` to `bases.mjs` and
     `bases.d.mts`, `.storybook/edition-tool.ts` to `base-tool.ts`; every derived name follows
     (`editionItems`, `editionHref`, `staticEditionRoot`, `ST_OTHER_EDITIONS`, the docs app's
     `example-variant-dir.mjs` helpers). The committed registry item names
     (`shadcn-table-base`, `example-basic-radix`) and the hosted paths `/r/<base>/` already use
     the base names and do not change.
   - Reader-facing strings: Storybook toolbar picker `Base`, preview banner "the Base UI base
     of shadcn-table" reads badly, so the banner says "These stories render shadcn-table on
     Base UI. The other bases: Radix UI, React Aria."; README, SKILL.md and the docs mdx say
     "one copy of the table per shadcn base".
   - `check-pages.mjs`: `--base <url>` becomes `--url <url>` so `--base base|radix|aria` can
     take the old `--edition`. CONTRIBUTING follows.
   - Standards section "Editions" becomes "Bases". Past `CHANGELOG.md` entries, `.ai/plans/`
     history and decisions 1 to 8 keep their wording.
   - The chevron on the Storybook picker (leading icon, `@storybook/icons`
     `ChevronSmallDownIcon`, commit `5f420c01`) ships in the same part. Why leading:
     Storybook's `Select` draws no caret and renders `icon` before the selected title; the
     owner chose that over the legacy `showSelectedOptionTitle` route.
   - Review of the 0.6.3 result (2026-10-29), both kept: the grep gate won over byte-identical
     catalogs, so the alias descriptions say "installs the Base UI copy" and one shipped aria
     comment says "every base exposes" (hosted `aria/shadcn-table.json` differs by that line);
     and "copy" is the word where "base" would double up ("one copy of the table per shadcn
     base", "the Base UI copy").

## Versioning

10. One "Versioning" section on the API reference index (`docs/api/index.mdx`) and a line in
    `README.md`, nothing more. Decided 2026-10-29, ships in 0.6.4 as a patch.
    - Public surface: everything `index.ts` re-exports, the MRT model (decided in chat earlier;
      components, hooks, `shared/` helpers, types, features). No narrower list.
    - No stability list and no "what a major may change" section. The code is copied in, as
      with shadcn/ui, and the upgrade path is the same: `shadcn add --overwrite` plus the
      changelog. Writing a breaking-change contract is work for when something changes.
    - Registry addresses: hosted `/r/<base>/shadcn-table.json`, `shadcn-table-locale-<code>`,
      `example-<slug>` and the `@st` namespace are stable; the GitHub shorthands stay a
      maintainer fallback (decision 7).
    - The three bases are at feature parity, and `check-bases.mjs` enforces it; the page says
      so.
    - TanStack Table pinned to `^9`; a TanStack v9 breaking change flows through as a major of
      this library.
    - A renamed option keeps an alias for one minor with a console warning, listed under
      `### Deprecated` in the changelog, removed in the next major.
    - Unit tests for `lib/` are not part of 1.0 (owner, 2026-10-29); external use happens on
      0.6.x.
