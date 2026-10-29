# Coding Standards

Rules a reader cannot derive from the code. Applies to humans and agents.

## Layout

```
packages/shadcn-table/
├── registry/base/           ← complete Base UI library: parts, components/ui/shadcn-table, lib, css, registry.ts
├── registry/radix/          ← complete Radix UI library, same shape
├── registry/aria/           ← complete React Aria library, same shape
├── registry.json            ← item catalog, stays at the package root
├── scripts/registry/        ← base list, registry build, hosted copies, example items, add-part, base guard
├── scripts/                 ← everything else
└── stories/ .storybook/     ← one story set, `@/` points at registry/<ST_BASE>
apps/shadcn-table-docs/      ← Next.js docs app; components/ui-base, components/ui-radix and components/ui-aria are installed copies
├── examples/base/ radix/ aria/  ← the docs examples, one hand-written set per base, radix the reference
```

## Bases

- Three trees, one per base: `registry/base`, `registry/radix`, `registry/aria`. The list
  is `BASES` in `scripts/registry/bases.mjs` (with `REFERENCE_BASE`,
  `DEFAULT_BASE`, `BASE_LABELS` and `BASE_PORTS`), Base UI first: the one source of
  the order readers see the bases in. Every script, config and docs app file that handles
  more than one base reads it, none repeats the names or the order.
- Every base script names its base: `storybook:<base>`,
  `storybook:build:<base>`, `test:<base>` (`ST_BASE=<base>`, dev ports from
  `BASE_PORTS`: base 6007, radix 6006, aria 6008). `ST_BASE` unset or unknown means
  `DEFAULT_BASE`, never the reference.
- Radix is the reference (`REFERENCE_BASE`, the diff baseline and the example slug source).
  A change to a common library file is made in every tree by hand. Base UI is the default
  (`DEFAULT_BASE`): what a reader sees before picking a base, in the docs tabs and at
  the Storybook root. Every committed item is `<name>-<base>` for every base
  (`baseItemName`); the hosted `/r/<base>/` copies carry the plain name. The plain names
  in the committed catalogs are generated aliases of the `DEFAULT_BASE` items (`aliasItems`
  in `lib.mjs`, same files), so the GitHub shorthand `anindosarker/shadcn-table/<name>`, which
  cannot pick a base, installs the default; never hand-write one, and `hosted.mjs` skips
  them.
- Each other base has its own list of files that legitimately differ from radix:
  `scripts/registry/base-diff.json`, `scripts/registry/aria-diff.json`. A file not on a
  base's list must be byte-identical in that tree and radix; CI (`pnpm check:bases`)
  fails otherwise.
- Adding a base-only difference means adding the path to that base's list in the
  same commit.
- shadcn parts (`registry/<base>/components/ui/<part>.tsx`) are never edited; they are
  what `pnpm add-part <base> <part>` writes, and `pnpm add-part <base> --all` re-adds
  every committed part of a base: the gate is that it leaves `git status --short` empty.
  A check that fails on a part is fixed in the check (ESLint ignores the parts; the tsconfigs
  carry no unused-code flags). No exception: a look the library needs beyond the part goes in
  a library wrapper under `components/ui/shadcn-table/` (`ST_Tooltip`, `ST_Checkbox`), and
  every part reaches users as a `registryDependency`.
- The docs examples follow the same model: `apps/shadcn-table-docs/examples/<base>/<slug>/`
  for every base, radix the reference, a common change made in every folder by hand,
  `scripts/registry/examples-<base>-diff.json` the list of example files allowed to differ,
  checked by the same `pnpm check:bases`.

## Naming

- Library components, hooks and types carry the `ST_` prefix; hooks `useST_`.
- A file that mirrors a material-react-table file keeps its twin's name with `MRT_`
  replaced by `ST_` (`MRT_TableBody.tsx` is `ST_TableBody.tsx`).
- Locales: `locales/<bcp47>.ts`, exported as `ST_Localization_<CODE>`.

## Imports

- Inside the library, import other library files and shadcn parts through
  `@/components/ui/shadcn-table/...` and `@/components/ui/<part>`, never relatively. The
  shadcn CLI rewrites `@/` on install, so source and installed output stay identical.
- The docs app imports its own UI from `@/components/ui-radix/...`. Example sources under
  `examples/<base>/<slug>/` import `@/components/ui/...` because that is what a user has
  after install; `lib/example-variants.mjs` points the generated copies at the installed
  base.

## Code

- No abstraction with one implementation. Two real implementations first.
- A function with three or more parameters takes one object.
- A change touches only the files of its feature. Drive-by refactors go in their own commit.
- Dead code, commented-out blocks and stale `eslint-disable` lines are removed on sight.
- An `eslint-disable` carries a reason after `--`.
- Code compiles clean under `strict`, whatever the committed tsconfig says.
- Docs never restate what the code says; they are updated in the same commit as the code.
- Agents navigate TypeScript with the LSP tool (definitions, references, call hierarchy),
  `grep` only for strings, comments and non-TypeScript files.

## Gates

Run before every commit that touches the area.

```sh
pnpm format                                   # prettier, once, before the commit
pnpm --filter shadcn-table tsc:radix          # ignore only the TS5101 baseUrl notice
pnpm --filter shadcn-table tsc:baseui
pnpm --filter shadcn-table tsc:aria
pnpm --filter shadcn-table lint
pnpm --filter shadcn-table test:base          # Base UI stories
pnpm --filter shadcn-table test:radix         # Radix UI stories
pnpm --filter shadcn-table test:aria          # React Aria stories
pnpm check:bases                              # base guard, library and examples, every base against radix
pnpm add-part <base> --all                 # shadcn parts, local only (not in pr.yml); then git status --short must print nothing
pnpm --filter shadcn-table-docs types:check && pnpm --filter shadcn-table-docs lint && pnpm --filter shadcn-table-docs build
```

CI runs the same gates: `.github/workflows/pr.yml` on every pull request, plus `release impact`,
which needs exactly one `release:` label (`release:patch`, `release:minor`, `release:major`,
`release:skip`) when the PR changes `packages/shadcn-table/registry`,
`apps/shadcn-table-docs/components/ui-*` or `skills/`, and `## Unreleased` lines in
`CHANGELOG.md` for a level label. `.github/workflows/release.yml` runs on every push to `master`:
it opens or rewrites the version PR `chore: version <v>` from `release/next`, or, once that PR is
merged, tags, verifies production and creates the GitHub release.

```sh
node --test scripts/release/*.test.mjs   # release scripts
```

Preview (Ctrl-C stops every server; the first two remove `.dev`, the root one also restores the production hosted registry):

- `pnpm --filter shadcn-table preview`: registry on 5310 (`/r`), Storybook on 6007 (Base UI), 6006 (Radix UI) and 6008 (React Aria).
- `pnpm preview` (root): the same plus the docs production build on 5330, its `/r` and install commands pointing at localhost:5330.
- `pnpm --filter shadcn-table-docs preview`: docs production build served on 5330 (`.next-preview`).
- `pnpm --filter shadcn-table-docs dev`: docs dev server on 5320.

## Style

- No em dashes anywhere, code comments included.
- Commit messages: Conventional Commits, no trailers, no attribution.
