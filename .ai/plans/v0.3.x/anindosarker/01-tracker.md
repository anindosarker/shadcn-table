# 01: release automation, tracker

Decisions and deviations only. Branch `v0.4/01`, commits `b5506cf`, `c3d6da0`, `82a0bbd`, `2cdff67`, `8257072`. Reviewer verdict pass with two minor findings, gate agent green with the two workflow gates recorded as owner items.

## Decisions

- `scripts/release.mjs` adds one guard the part file does not list, after the version guard and before the changelog guard: the tag `v<version>` must not exist locally or on origin. Otherwise `git tag` would fail after the version commit was made and leave a commit without a tag.
- `release.mjs` and `smoke.mjs` locate the docs app `package.json` by package name `shadcn-table-docs` under `apps/*` instead of a hard-coded path, so the part 05 folder rename needs no follow-up.
- The changelog heading written by `release.mjs` is `## <version> - <YYYY-MM-DD>` with the local date; `notes.mjs` matches `## <version>` followed by whitespace or end of line, so a bare heading works too.
- `release.yml` passes `--verify-tag` to `gh release create`, so a dispatch with `dry_run` false can never create a tag of its own.
- The wait-for-production poll in `release.yml` is a shell loop with `curl` inside the runner. The no-curl rule applies to `smoke.mjs` and the local hook, not to the workflow.
- `ci.yml`'s install job no longer carries a per-matrix `name`; `install.yml` owns the matrix and the display name `install (<scenario> app)`.
- `install.yml` takes one `source` input, a template with `<item>` and `<base>` placeholders, so CI can pass a GitHub address and the release a production URL.
- `smoke.mjs` compares the hosted catalogs against the names `hosted.mjs` derives (152 per base), not the committed names, because the hosted `registry.json` never contains the committed names.

## Deviations

- 2.2 gate "ci.yml green with the install job on install.yml" cannot run from the branch: the install job is gated on push events to `master` and `claude/review`. The first run is the merge into `claude/review`.
- 2.2 gate "release.yml workflow_dispatch with dry_run": GitHub dispatches only workflows on the default branch (404 for `--ref v0.4/01`), and production serves 404 for `/version.txt` until `master` deploys the route. The dry run happens at the owner's milestone merge.
- The smoke job's `check-pages.mjs` step is red against production v0.3.0 today: 1623 passed, 24 failed (coder measured 23), all outside this part. Causes: 404 resource loads counted as console errors on 8 docs pages from broken internal links (`/docs/guides/aggregation-and-grouping`, `/docs/api/props`, `/docs/features/column-grouping`, `/docs/features/aggregation`); `/docs/examples/custom-headless` throws "Cannot destructure property 'density' of 'r.state' as it is undefined"; the `/docs/guides/detail-panel` check "enable-detail-panel-conditionally: panel opens"; `/docs/guides/localization` reports 40 locale tabs against another expected count. Owner decision pending: keep the full step (the failures are real production defects the release gate should catch, the dry run turns green once fixes deploy) or scope it.
- `pnpm format` rewrites 58 installed copies under `apps/docs/components/ui*` and `lib/utils.ts` that are unformatted on `claude/review` as well; reverted before each commit.
- Phases 1 and 2 were committed by an earlier interrupted coder run; the final run re-verified every file against 1.6.1 to 1.6.5 instead of rewriting.
- Reviewer minor findings, left open: the two helpers in `smoke.mjs` take three positional parameters where the standard says one object; `release.mjs` reads the second `package.json` after writing the first, so a malformed docs `package.json` would leave the library version written. Both are candidates for a follow-up commit, no gate is red.

## Gate numbers

- Scratch clone: `node scripts/release.mjs 0.0.0` on a dirty tree, on a non-master branch and with a lower version each exit non-zero with the reason and write nothing.
- `/version.txt` from `next start`: 200, `text/plain; charset=utf-8`, body `0.3.0`.
- Library gates on the merged result green; `test` and `test:base` 400 of 400; `check:bases` 129 files, 23 allowed to differ.
