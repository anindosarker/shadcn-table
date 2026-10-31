# 02: lint parity, tracker

Status: planned
Branch `[branch]`, worktree [name], PR #[n]
Gates:
- `[command]` at [commit]: [green | red]
- CI run [id]: [green | red]

- Milestone 01 [name]: [planned | running | done (<commit>, <workflow run id>)]

Foundation: branch `v0.7/foundation`, worktree `foundation`, PR #70
- `pnpm --filter shadcn-table tsc:radix` at 4e76e415: green
- `pnpm --filter shadcn-table tsc:baseui` at 4e76e415: green
- `pnpm --filter shadcn-table tsc:aria` at 4e76e415: green
- `pnpm --filter shadcn-table lint` (old config) at 4e76e415: green, exit 0, 0 errors, 18 warnings (unused-directive on the six new `no-explicit-any` disables per base, the rule is off under the folded-core block until the S1 switch)
- `pnpm check:bases` at 4e76e415: green
- `pnpm install --frozen-lockfile` at 48c0e7e8: green, clean
- `pnpm --filter shadcn-table test:base` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table test:radix` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table test:aria` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table check:tailwind <base>` at 4e76e415: red as expected, 66 per base (base, radix, aria): 36 non-canonical sites, 22 distinct, plus 30 physical-direction sites; F13's 37th site was `getCommonToolbarStyles` (`style.utils.ts:183`), deleted in the foundation
- `pnpm check:icons` at 4e76e415: red as expected, 4 problems per base (the four `icons/<library>.ts` maps missing until S3), `icons.ts` 35 keys
- Baseline: `reference/02-lint-baseline.json` (old config at 48c0e7e8: 0 errors, 18 warnings, all unused-directive)

## Attention

- CHANGELOG blocks are `#### Spec NN` under `### Changed`, not `### Spec NN`: `scripts/release/next-version.mjs` throws on any `### ` heading outside Breaking, Removed, Added, Changed, Fixed, Docs, which fails the `release impact` job and the release version PR. Each block keeps its lines with the category as leading label; regroup into the standard headings before the release, or teach the release scripts the blocks.
- `packages/shadcn-table/eslint.config.js` changed in the foundation: plugin 7 has no flat `recommended-latest`, so `lint` crashed after the bump; the first block now registers the plugin and names the two plugin 5 rules (`rules-of-hooks` error, `exhaustive-deps` warn). Same rule set, no React Compiler rules; S1's switch replaces it.
- `pr.yml` `registry` job waits for `http://localhost:5310/r/shadcn-table-base-core.json` and dry-runs the tabler edition and the example items from the dev registry, and `install.yml` adds `example-basic-<base>` from it, as spec 11 1.6.5 writes; the core, edition and dev example items exist only after S3 (`lib.mjs`, `build.mjs --dev`). Until S3 merges, the `registry` and `install` jobs are red on every PR, this one included.
- `icons.ts` gains `IndeterminateIcon: Minus` in the Lucide map (so the default map fills the new `ST_Icons` keys) and `ST_TablePagination.tsx` types its icons `ComponentType<ST_IconProps>` instead of `LucideIcon` (the type change broke `tsc` there); both are S3 or set C files, edited before those workstreams start.
- `useST_MenuAnchor` already carries the re-measure listeners and the second-click `toggle` (the Run plan foundation item), not only the interface the D26 addendum names; spec 10 wires the openers and adjusts behaviour if needed.
