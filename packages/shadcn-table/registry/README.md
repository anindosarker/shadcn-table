# Library source: one complete tree per base

The library ships in two editions, Radix (`registry/radix`, shadcn style `radix-nova`) and
Base UI (`registry/base`, style `base-nova`). Each tree is the whole library for that base;
nothing is shared, resolved or generated between them. Both install to
`components/ui/shadcn-table/` with the same relative paths.

## What lives where

```
registry/<base>/
  components/ui/*.tsx                  the shadcn parts this edition builds on
  components/ui/shadcn-table/**        the library, every file
  lib/utils.ts  index.css  components.json  registry.ts
registry/README.md                     this file
scripts/registry/base-diff.json        the library files that differ between the trees
scripts/registry/check-bases.mjs       the guard: pnpm check:bases
```

`@/` is a plain alias to one tree: `tsconfig.radix.json` and `tsconfig.baseui.json` map it
through `paths`, `vite.config.ts` (and so Vitest and Storybook) through `resolve.alias`,
switched by `ST_BASE=base`. Every file of a tree is a root file of its TypeScript project,
so the editor resolves every import in both trees.

## How to change a library file

A common change is made in both trees by hand, in the same commit. There is no sync script;
`pnpm check:bases` (also the CI job `bases`) reports a missed twin: every file under
`components/ui/shadcn-table/` that is not listed in `scripts/registry/base-diff.json` must be
byte-identical in both trees, every listed file must exist in both, and no library file may
exist in one tree only. The guard prints the offending paths and never edits a file.

A base-only change is made in one tree, and the file's path (relative to
`components/ui/shadcn-table/`) is added to `base-diff.json` in the same commit. When the two
copies become identical again, remove the path from the list in the commit that makes them
so.

Gates: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `lint`, `test`, `test:base`,
`pnpm check:bases`.

## How to add a shadcn part

Parts are per base. From the repo root:

```bash
pnpm add-part radix tooltip        # registry/radix/components/ui/tooltip.tsx, style radix-nova
pnpm add-part base tooltip         # registry/base/components/ui/tooltip.tsx, style base-nova
```

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

`registry/<base>/registry.ts` defines the base's items (`shadcn-table` or
`shadcn-table-base`, plus one locale item per language) through
`scripts/registry/lib.mjs`, which lists every file of the tree's
`components/ui/shadcn-table/` plus the forked parts. `pnpm registry:build` collects both
into `registry.json` at the package root, which stays there because the CLI resolves
`files[].path` relative to it.
