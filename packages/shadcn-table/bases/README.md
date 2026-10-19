# Library source: `shared/` plus per-base overrides

The library ships in two editions, Radix (`bases/radix`, shadcn style `radix-nova`) and Base UI
(`bases/base`, style `base-nova`). Both install to `components/ui/shadcn-table/` with the same
relative paths, so the source is kept once and each base holds only what differs.

## What lives where

```
shared/components/ui/shadcn-table/**   one copy of every shared library file
bases/<base>/
  components/ui/*                      the shadcn parts this edition builds on (never shared)
  components/ui/shadcn-table/**        override files: same relative path as the shared copy
  lib/utils.ts  index.css  components.json  registry.ts
```

`bases/radix/components/ui/shadcn-table/` does not exist today: the Radix edition has no
overrides. `bases/base/components/ui/shadcn-table/` holds the Base UI overrides. The folder
listing is the complete list of differences between the editions; there is no other record.

## How a file is resolved

Every `@/` import is looked up in `bases/<base>/` first and in `shared/` second, first file
wins. TypeScript does this through `paths` in `tsconfig.radix.json` / `tsconfig.baseui.json`;
Vite (and so Vitest and Storybook) through the `st-base-fallback` plugin in `vite.config.ts`,
switched by `ST_BASE=base`. Nothing is generated or symlinked.

Library files import each other through `@/components/ui/shadcn-table/<path>`, never
relatively (ESLint `no-restricted-imports` enforces it under `shared/` and the override
folders): a relative import inside an override would reach the override folder, where most
files do not exist, and a relative import inside `shared/` would skip the override.

The type-check projects pull the shared library in through `index.ts` and `locales/` rather
than the whole `shared/` folder, so a shared file that the base overrides is never checked
against that base's parts. A new shared file must be reachable from `index.ts` (every library
file is exported there) or it is not type-checked.

## How to override a file

1. Copy it from `shared/components/ui/shadcn-table/<path>` to
   `bases/<base>/components/ui/shadcn-table/<path>` and edit the copy.
2. Keep the exports and their types compatible with the shared callers: every shared file that
   imports `<path>` is compiled against the override in that base.
3. Delete the override to fall back to the shared copy. When an override and the shared copy
   become identical again, delete the override.

Gates: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `lint`, `test`, `test:base`.

## How to add a shadcn part

Parts are per base. Until `registry/add-part.mjs` lands, copy the part by hand: run
`pnpm dlx shadcn@latest add <part>` in a scratch project initialised with the base's style
(`radix-nova` or `base-nova`, see `bases/<base>/components.json`), copy the generated
`components/ui/<part>.tsx` into `bases/<base>/components/ui/`, and import it from the library
as `@/components/ui/<part>`; the registry build turns that import into a `registryDependency`.
