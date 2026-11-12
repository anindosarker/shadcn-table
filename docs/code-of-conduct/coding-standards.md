# Coding Standards

Rules a reader cannot derive from the code. Applies to humans and agents.

## Layout

```
packages/shadcn-table/
├── registry/base/           ← complete Base UI library: parts, components/ui/shadcn-table, lib, css, registry.ts
├── registry/radix/          ← complete Radix UI library, same shape
├── registry/aria/           ← complete React Aria library, same shape
├── registry.json            ← item catalog, stays at the package root
└── stories/ .storybook/     ← one story set, `@/` points at registry/<ST_BASE>
apps/shadcn-table-docs/      ← Next.js docs app; components/ui-base, components/ui-radix and components/ui-aria are installed copies
├── examples/base/ radix/ aria/  ← the docs examples, one hand-written set per base, radix the reference
├── lib/                     ← install.mjs (lib:install), example-map.mjs and the docs helpers
test/                        ← every test, one folder per test behind `pnpm test <name>` (run.mjs the runner)
tools/
├── docs/                    ← docs content checks (check-frontmatter.mjs)
├── registry/                ← base list, registry build, hosted copies, example items, add-part, the base diff lists
├── release/                 ← the release tools the workflows run, with their *.test.mjs
└── preview.mjs              ← the root and package previews
```

## Bases

- Three trees, one per base: `registry/base`, `registry/radix`, `registry/aria`. The list
  is `BASES` in `tools/registry/bases.mjs` (with `REFERENCE_BASE`,
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
  `tools/registry/base-diff.json`, `tools/registry/aria-diff.json`. A file not on a
  base's list must be byte-identical in that tree and radix; `pnpm test validate-repo`
  (the CI job `Validate Repo`) fails otherwise.
- Adding a base-only difference means adding the path to that base's list in the
  same commit.
- shadcn parts (`registry/<base>/components/ui/<part>.tsx`) are never edited; they are
  what `pnpm add-part <base> <part>` writes, and `pnpm add-part <base> --all` re-adds
  every committed part of a base: the check is that it leaves `git status --short` empty.
  A check that fails on a part is fixed in the check (ESLint ignores the parts; the tsconfigs
  carry no unused-code flags). No exception: a look the library needs beyond the part goes in
  a library wrapper in the folder of its kind (`components/buttons/ST_Tooltip.tsx`,
  `components/inputs/ST_Checkbox.tsx`), and every part reaches users as a `registryDependency`.
- The docs examples follow the same model: `apps/shadcn-table-docs/examples/<base>/<slug>/`
  for every base, radix the reference, a common change made in every folder by hand,
  `tools/registry/examples-<base>-diff.json` the list of example files allowed to differ,
  checked by the same `pnpm test validate-repo`.

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
- A comment in library source is JSDoc on exported API or one sentence naming a non-obvious invariant or a quirk of the browser or of the tree's own spec library. No porting history (MUI, MRT, another base, a TanStack version) and nothing that restates the next line. A rationale shared by several files is written once, where the pattern lives.
- Agents navigate TypeScript with the LSP tool (definitions, references, call hierarchy),
  `grep` only for strings, comments and non-TypeScript files.

## Checks

Run before every commit that touches the area. Every test lives in `test/<name>/` and runs
through one runner, `pnpm test <name>` (`--base <b>` or `--scenario <s>` for one, `--list`,
`--all`, `--changed`); each ends with one summary line and a JSON record under `test/.out/`.

```sh
pnpm format                             # prettier, once, before the commit
pnpm test typecheck                     # Typecheck (<base>): tsc:<base> per base; radix also the docs types:check
pnpm test lint                          # Lint: the package and the docs app, zero warnings
pnpm test storybook-tests               # Storybook Tests (<base>): every story and play per base, headless Chromium
pnpm test docs-e2e                      # Docs E2E Tests (<base>): the docs app built and served, every page checked per base
pnpm test validate-repo                 # Validate Repo: bases identical, icon maps, Tailwind classes, registry valid, tool unit tests
pnpm test installation-e2e              # Installation E2E (<scenario>): install from the dev registry, build, Next browser phase
pnpm test --changed                     # only the tests whose paths the branch changed
pnpm add-part <base> --all              # shadcn parts, local only (not in pr.yml); then git status --short must print nothing
```

`validate-pr` (Validate PR: one `release:` label, the PR from `dev` into `master`, the version
bump dry run) needs a PR and runs in CI; `validate-production` (Validate Production) checks the
live site after a release. The tool unit tests (`node --test "tools/**/*.test.mjs"`) run as part
of `pnpm test validate-repo`.

Every story file has at least one play; a feature story file has one play per behaviour it
shows. A story file without a play is a finding (v0.8.x D59).

CI runs the same tests. `.github/workflows/pr.yml` on every pull request, twenty-two jobs:
`Head` (reads the PR head commit, D35), `Typecheck (base|radix|aria)`, `Lint`,
`Storybook Tests (base|radix|aria)`,
`Docs E2E Tests (base|radix|aria)`, `Validate Repo`,
`Installation E2E (fresh|existing|base|aria|nextjs-base|nextjs-radix|nextjs-aria)`,
`Validate PR`, `PR Summary` (one sticky comment per PR from every job's record) and
`Prepare Release` (on the release PR, `dev` into `master`, after every other job: commits
`chore: version <v>` to `dev`). The four matrices are called workflows (`typecheck.yml`,
`storybook-tests.yml`, `docs-e2e.yml`, `installation-e2e.yml`), so their check contexts read
`Typecheck / Typecheck (base)`, `Installation E2E / Installation E2E (fresh)`. A PR that changes `packages/shadcn-table/registry`,
`apps/shadcn-table-docs/components/ui-*` or `skills/` needs exactly one `release:` label
(`release:patch`, `release:minor`, `release:major`, `release:skip`), and a level label needs
`## Unreleased` lines in `CHANGELOG.md`. `.github/workflows/release.yml` on every push to
`master`, four jobs: `Check Release`, `Verify Deployment` (waits for www and storybook to serve
the version, then tags), `Validate Production`, `Publish Release`.

Preview (Ctrl-C stops every server; the first two remove `.dev`, the root one also restores the production hosted registry):

- `pnpm --filter shadcn-table preview`: registry on 5310 (`/r`), Storybook on 6007 (Base UI), 6006 (Radix UI) and 6008 (React Aria).
- `pnpm preview` (root): the same plus the docs production build on 5330, its `/r` and install commands pointing at localhost:5330.
- `pnpm --filter shadcn-table-docs preview`: docs production build served on 5330 (`.next-preview`).
- `pnpm --filter shadcn-table-docs dev`: docs dev server on 5320.

## Style

- No em dashes anywhere, code comments included.
- Commit messages: Conventional Commits, no trailers, no attribution.
