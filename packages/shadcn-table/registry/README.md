# Library source: one complete tree per base

The library ships in three editions, Base UI (`registry/base`, shadcn style `base-nova`),
Radix UI (`registry/radix`, style `radix-nova`) and React Aria (`registry/aria`, style
`aria-nova`). The edition list is `EDITIONS` in `scripts/registry/editions.mjs`, in that
order; Radix is the reference (the diff baseline). Each tree is the whole library for that base; nothing is shared, resolved or
generated between them. All three install to `components/ui/shadcn-table/` with the same
relative paths.

## What lives where

```
registry/<base>/
  components/ui/*.tsx                  the shadcn parts this edition builds on
  components/ui/shadcn-table/          the library, every file
    features/                          stFeatures.ts and one st*Feature.ts per state group
    hooks/                             stTableHook, useShadcnTable, useST_*, display-columns/
    components/                        table/ head/ body/ footer/ toolbar/ buttons/ inputs/ menus/ modals/
    shared/fns/                        filterFns.ts  sortFns.ts  aggregationFns.ts
    shared/utils/                      cell, column, row, style, pagination, virtualization, ...
    shared/locales/                    one <code>.ts per language
    ShadcnTable.tsx  ST_Tooltip.tsx  types.ts  icons.ts  index.ts
  lib/utils.ts  index.css  components.json  registry.ts
registry/README.md                     this file
scripts/registry/editions.mjs          the edition list (EDITIONS) and the reference (radix)
scripts/registry/base-diff.json        the library files that differ between radix and base
scripts/registry/aria-diff.json        the library files that differ between radix and aria
scripts/registry/check-bases.mjs       the guard: pnpm check:bases
```

`@/` is a plain alias to one tree: `tsconfig.radix.json`, `tsconfig.baseui.json` and
`tsconfig.aria.json` map it through `paths`, `vite.config.ts` (and so Vitest and Storybook)
through `resolve.alias`, switched by `ST_BASE=base`, `ST_BASE=radix` or `ST_BASE=aria` (unset
means Base UI, `DEFAULT_EDITION`). Every file of a tree
is a root file of its TypeScript project, so the editor resolves every import in every
tree.

## How to change a library file

A common change is made in every tree by hand, in the same commit. There is no sync script;
`pnpm check:bases` (also the CI job `bases`) reports a missed twin. It compares every edition
against the reference, radix, each with its own list, `scripts/registry/<edition>-diff.json`
(`base-diff.json`, `aria-diff.json`): every file under `components/ui/shadcn-table/` that is
not on an edition's list must be byte-identical in that tree and radix, every listed file
must exist in both, and no library file may exist in one tree only. The guard prints one line
per edition, then the offending paths, and never edits a file.

An edition-only change is made in that tree, and the file's path (relative to
`components/ui/shadcn-table/`) is added to that edition's diff list in the same commit. When
the copy becomes identical to radix again, remove the path from the list in the commit that
makes it so.

Gates: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `test:base`,
`test:radix`, `test:aria`, `pnpm check:bases`.

## How to add a shadcn part

Parts are per base. From the repo root:

```bash
pnpm add-part base tooltip         # registry/base/components/ui/tooltip.tsx, style base-nova
pnpm add-part radix tooltip        # registry/radix/components/ui/tooltip.tsx, style radix-nova
pnpm add-part aria tooltip         # registry/aria/components/ui/tooltip.tsx, style aria-nova
pnpm add-part radix --all          # re-adds every part the base has, forks skipped
```

After `pnpm add-part <base> --all`, `git status --short` must print nothing: the committed
parts are the script's output.

`scripts/registry/add-part.mjs` fetches the part in the base's style
(`registry/<base>/components.json`), lets the shadcn CLI install it into a scratch project so
the file goes through the CLI's own transforms, rewrites the upstream `cn` package import to
`@/lib/utils`, formats the file and prints the part's `dependencies` (npm) and
`registryDependencies` (other parts) for you to add on purpose; it never writes those.
Re-adding a part the base already has refreshes it from upstream, so the diff shows what
changed there (a forked part such as `checkbox` will differ). Import the part from the library
as `@/components/ui/<part>`; the registry build turns that import into a
`registryDependency`.

## Registry items

`registry/<base>/registry.ts` defines the base's items (`shadcn-table`,
`shadcn-table-base` or `shadcn-table-aria`, plus one locale item per language) through
`scripts/registry/lib.mjs`. The main item lists every file of the tree's
`components/ui/shadcn-table/` except the non-English locales, plus the forked parts. Each
locale item (`<item>-locale-<code>`, `mk` included) ships its one
`shared/locales/<code>.ts`. `pnpm registry:build` collects every edition's items into
`registry.json` at the package root, which stays there because the CLI resolves
`files[].path` relative to it.
