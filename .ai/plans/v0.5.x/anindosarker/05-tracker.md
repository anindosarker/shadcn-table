# 05: release flow, tracker

Deviations and gate results. Plan: [05-release-flow.md](05-release-flow.md). Rulings: [decisions.md](decisions.md) item 7.

## Phases 01 to final

Branch `v0.5/release-flow` from `claude/review` at `bf0e29a5`, worktree `07`.

### Commits

- `feat(release): next-version script`: `scripts/release/next-version.mjs [--level patch|minor|major] [--from-changelog]`. Without `--level`, or with `--from-changelog`, `## Unreleased` must have lines (exit 2 and no output otherwise); `--level` wins over the headings. `### Removed` (used by older sections) counts as `Breaking`; an unknown heading or a line outside a `### ` heading exits 1. Prerelease bumps follow `npm version`. Tests in `scripts/release/next-version.test.mjs` (pure `run()` with injected version and changelog, one CLI case).
- `feat(release): version PR script`: `scripts/release/version-pr.mjs <next>`, guards a clean tree and a `## Unreleased` section, `git checkout -B release/next`, commits as `github-actions[bot]` under `GITHUB_ACTIONS`, force-pushes, `gh pr edit` the open PR from `release/next` or `gh pr create`, returns to the starting branch.
- `feat(release): comment on released PRs`: `scripts/release/comment.mjs <tag> [--dry-run]`. The merge subjects on `master` are custom (`merge: release 0.5.0`) and carry no `#N`, so besides the two subject patterns it asks GitHub for the PRs of each first-parent commit in the range (`repos/{owner}/{repo}/commits/<sha>/pulls`), plus the version PR by title.
- `ci: pr.yml replaces ci.yml`: `release-impact` (runs on `labeled`/`unlabeled` too; every other job skips label events, and the concurrency group splits label runs from check runs so a label change does not cancel the matrix). `registry` and `install` lost their `push` condition and run on every PR at `github.sha` (the PR merge commit), as `install.yml` already pins `REF` to it. `install.yml` header comment names `pr.yml`.
- `ci: release.yml opens the version PR or releases`: jobs `decide`, `version`, `wait-for-production`, `smoke`, `install`, `release`. The `v*` tag trigger is gone; a dispatch never tags. The version job keeps an open version PR's version when a later merge asks for a lower one (`sort -V`). `gh release create` is skipped when the release exists, so a re-run after a failed comment step works.
- `docs: release flow per decision 7`: `.github/pull_request_template.md`, `scripts/release.mjs` and the root `release` script removed, coding standards gates paragraph, `CONTRIBUTING.md` step 6 bullets and new step 7, `CHANGELOG.md` intro (headings incl. `### Docs`; `notes.mjs` copies the section whatever its headings), v0.3.x "Release" pointer. Labels `release:patch`, `release:minor`, `release:major`, `release:skip` created (`gh label create --force`).

### Gates

- `node --test scripts/release/next-version.test.mjs`: 8 tests pass (0.5.0 patch 0.5.1, minor 0.6.0, major 1.0.0, each heading, 1.2.3 Breaking 2.0.0, empty heading ignored, no section exit 2, label precedence, bad input exit 1).
- `actionlint` 1.7.12 (brew) with shellcheck: `pr.yml`, `release.yml` clean; one existing `install.yml` SC2034 warning (`i` unused in the dev registry wait loop, unchanged).
- `act -l`: `pr.yml` 7 jobs, `release.yml` 6 jobs, `install.yml` 1.
- js-yaml parse of both files; the `release-impact`, `decide` and `version` run blocks extracted and run under `bash -eo pipefail` with a fake `gh`: no label on shipped files fails, two labels fail, a level label without a `CHANGELOG.md` change or without `## Unreleased` lines fails, `release:patch` prints `Ships as 0.5.1`, `release:minor` `Ships as 0.6.0`, `release:skip` and no label without shipped files print `no release`; decide gives `version` (label level or headings), `none` (lines gone, tagged), `release` (lines gone, untagged; dispatch). The real `gh pr list --search <sha>` and `--head release/next` queries return the expected shapes.
- `version-pr.mjs` run twice in a scratch clone against a bare remote with a fake `gh`: first opens, second edits; one bot commit on `release/next`, three files changed, the PR body is the closed section plus the merge line.
- `comment.mjs v0.5.0 --dry-run` lists #39, #41, #42; `v0.4.0` lists #34 to #38.
- `node --check` on every `scripts/release/*.mjs` (no ESLint config covers root scripts); `pnpm lint` passes.

### Owner attention

- The repo setting "Allow GitHub Actions to create and approve pull requests" is off (`can_approve_pull_request_reviews: false`), so the `version` job's `gh pr create` fails until it is turned on (Settings, Actions, General; or `gh api -X PUT repos/anindosarker/shadcn-table/actions/permissions/workflow -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true`). The script then fails with that hint after pushing `release/next`.
- A PR opened with `GITHUB_TOKEN` triggers no workflow, so the version PR shows no `pr.yml` checks. No ruleset requires checks today, so it merges.
