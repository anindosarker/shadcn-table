# 04: package layout, tracker

Decisions and deviations only. Branch `v0.4/04`, commits `905ac81`, `94c2b4f`, `05c032e`. Reviewer verdict pass with one minor finding, gate agent green.

## Decisions

- `tsconfig.json` dropped its whole `compilerOptions` block, `paths` as well as `baseUrl`. The part file says only no `baseUrl`; `paths` without `baseUrl` in a solution file with `files: []` has no effect, and the referenced projects carry their own `paths`.
- `scripts/registry/check-bases.mjs` reports three problem kinds with distinct messages: a file only in one tree, a file listed in `base-diff.json` but missing from a tree, and an unlisted file that differs. One line per path on stderr, one summary line on success. The differing message carries the `components/ui/shadcn-table/` prefix so the path can be pasted; the other two print the list-relative path.
- The CI job `bases` runs with node only (`actions/checkout`, `actions/setup-node` 22), no `pnpm install`, because the guard has no dependencies.
- `packages/shadcn-table/package.json` scripts `registry:build` and `registry:dev` were repointed at `scripts/registry/build.mjs`. The part file lists only the three root scripts, but `pnpm registry:build` cannot run otherwise.
- The root `package.json` is touched by phases 2 and 3. The phase 2 commit carries only the `check:bases` line; the three path changes are in the phase 3 commit.
- Beyond the four files named in 1.6.7, `apps/docs/next.config.mjs` and `apps/docs/.gitignore` had comments naming `packages/shadcn-table/registry/hosted.mjs`; both were updated in the phase 3 commit. `scripts/install-base.mjs` reads `public/r`, which did not move, and is unchanged.
- `pnpm format` covers `**/*.{js,ts,tsx,md}` and `.mjs` is outside that glob, so the changed `.mjs` files were formatted with an explicit `prettier --write` in the same step.
- Phase 1 was committed as a pure `git mv` as the part file requires. That intermediate commit does not type-check on its own; the first gated state is the phase 2 commit.

## Deviations

- Goal 1.2, "library files show as renames only": the 106 common files that now also exist in `registry/base` cannot be renames of anything. The phase 1 commit shows 221 R100 renames, 106 C100 copies and one added file (`base-diff.json`). This follows from the two complete trees decision, not from the implementation.
- Gate "CI install matrix green on the branch" could not be observed from the branch, because `ci.yml` runs only on pushes to `master` and `claude/review` and on pull requests. The lead opens a pull request into `claude/review` to get the run before merging.
- Gate "Owner editor check" on `registry/radix/.../body/ST_TableBody.tsx` and its Base UI twin is left to the owner. Proxy: both files are root files of `tsconfig.radix.json` and `tsconfig.baseui.json` and both projects type-check clean.
- The moved library files contain pre-existing em dashes in comments (for example `modals/ST_EditRowModal.tsx`, `table/ST_Table.tsx`, `table/ST_TableLoadingOverlay.tsx` and their Base UI twins). They were moved byte-identical as 1.6.2 requires and not edited. Every file this part authored or edited is free of em dashes.
- Reviewer minor finding: `CONTRIBUTING.md` was rewritten more broadly than 1.6.7 lists. Left as is, the extra edits are the sections that described the old layout.

## Gate numbers

- `pnpm check:bases`: 129 library files in both trees, 23 allowed to differ. A one-line edit in one tree turns it red with the path; reverted.
- `test` and `test:base`: 400 of 400 each.
- `pnpm registry:build`: `registry.json` diff is 260 insertions and 260 deletions, all `files[].path` lines, identical after normalising the tree prefix.
