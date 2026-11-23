# 77: PostHog setup fixes
- Epic: E24

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The setup recheck of spec 76 (tracker `76-posthog-sdk-update`, Setup recheck) found two points where the docs site does not follow PostHog's current guides and the difference is not deliberate: the reverse proxy lacks the rewrite the proxy guide names for the config files (point 3), and `posthog.init` does not set the dated `defaults` the install guide sets (point 8, Q148). The owner's word on 2026-11-23: every PostHog setup point is the lead's to settle, build and ship. Two milestones in one spec, because the second only moves what the first merged, as spec 76 did: the first adds the rewrite (D160) and the `defaults` date (D161) and proves both in the build output; the second ships them by one PR from `dev` into `master` with `release:skip` and `ci:skip` (D153) and reads the live site. No version bump, no tag: the sites stay 0.9.7.

### 1.2 Goals

- `/ingest/array/:path*` is rewritten to `https://us-assets.i.posthog.com/array/:path*`, before the `/ingest` catch-all, as PostHog's Next.js proxy guide has it (D160).
- `posthog.init` sets `defaults` to the date PostHog's Next.js install guide names on the day of the build (`2026-08-30` on 2026-11-23) (D161).
- An option the app sets by hand to the value that date already gives is removed, only when the tracker shows the two are equal; the deliberate differences stay: the lazy load after hydration, `autocapture: false`, no `identify` (D161, D62).
- Any further difference between the setup and the two guides that the first milestone finds, and that is not one of the deliberate ones, is fixed here by following the guide and named in the tracker (epic E24 Notes).
- Both fixes are live: the config request goes through `/ingest/array/` and answers 200, a capture request answers 200, the seven events of `lib/analytics.ts` still fire (D161).
- No version bump, no tag; both sites still answer `0.9.7`; `claude/review` and `dev` end at `master` (D153, P4).
- Acceptance: the previous state of the live site (0.9.7 with spec 76, live before the change) for everything this spec does not name: the same seven event names, one `$pageview` per route change, SDK version `1.453.2`, the same request paths under `/ingest/`. Programmatic: `apps/shadcn-table-docs/.next/routes-manifest.json` of the built docs app holds the `/ingest/array/:path*` rewrite between the `/ingest/static/:path*` one and the `/ingest/:path*` one; `.next/static` holds the `defaults` date as text; `gh pr view <N> --json state --jq .state` prints `MERGED`; `git ls-remote --tags origin 'v0.9.8'` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` prints `0.9.7`; the live reads of 1.6.4 pass.

### 1.3 Current structure

```
apps/shadcn-table-docs/next.config.mjs:65-76     ← comment (names components/posthog-provider.tsx as the place of api_host, stale) and two rewrites: /ingest/static/:path* to us-assets.i.posthog.com/static/:path*, /ingest/:path* to us.i.posthog.com/:path*
apps/shadcn-table-docs/next.config.mjs:96-107    ← skipTrailingSlashRedirect: true; the slash redirect /:path((?!ingest).*)/ that spares /ingest (D53)
apps/shadcn-table-docs/lib/posthog-options.ts:11-18  ← initOptions: api_host '/ingest', ui_host 'https://us.posthog.com', capture_pageview 'history_change', capture_pageleave true, person_profiles 'identified_only', autocapture false; no defaults
apps/shadcn-table-docs/lib/posthog-client.ts:28-37   ← dynamic import('posthog-js') and import('./posthog-options'); posthog.init(POSTHOG_KEY, initOptions)
apps/shadcn-table-docs/lib/analytics.ts:25-64    ← the seven events: base_switched, install_command_copied, example_code_opened, example_file_viewed, storybook_opened, outbound_clicked, search_used
apps/shadcn-table-docs/app/robots.ts:6           ← disallow '/ingest/' (covers /ingest/array/)
apps/shadcn-table-docs/proxy.ts:34               ← the matcher keeps the proxy function off /ingest (D66)
apps/shadcn-table-docs/package.json:53           ← "posthog-js": "^1.453.2" (spec 76)
CONTRIBUTING.md:321-331                          ← Analytics section; item 1 lists the init options, item 3 lists the two rewrites
CHANGELOG.md                                     ← ## Unreleased, ### Docs: #### Spec 70, #### Spec 74, #### Spec 76
origin/master, origin/dev (a1f463a8)             ← 0.9.7 plus spec 76; live
origin/claude/review                             ← master plus plan commits only
```

Read in `posthog-js@1.453.2` (`dist/module.js`): the dated `defaults` values the SDK knows are `2025-05-24`, `2025-11-30`, `2026-01-30`, `2026-05-30`, `2026-06-25`, `2026-08-29`, `2026-08-30`; tracker 76, recheck point 8 lists what the newest date changes (rage click capture, `external_scripts_inject_target`, `internal_or_test_user_hostname`, `persistence_save_debounce_ms`, `split_storage`, `detect_google_search_app`, `disable_capture_url_hashes`, cookie conflict handling, replay `captureJsonLd`), and point 5 says `capture_pageview: 'history_change'` is what any date from `2025-05-24` gives.

### 1.4 Target structure

```
apps/shadcn-table-docs/next.config.mjs           ← + { source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' } after the static rewrite, before the catch-all; the comment names lib/posthog-options.ts
apps/shadcn-table-docs/lib/posthog-options.ts    ← + defaults: '<guide date>'; an option equal to what the date gives removed (1.6.2); the doc comment says so
CONTRIBUTING.md                                  ← Analytics item 1 names the dated defaults, item 3 names the three rewrites
CHANGELOG.md                                     ← + #### Spec 77 under ## Unreleased, ### Docs
apps/shadcn-table-docs/package.json, pnpm-lock.yaml  ← unchanged, unless the guide's date is newer than posthog-js 1.453.2 knows (1.6.2)
origin/master                                    ← + the merge of the shipping PR; package version stays 0.9.7
origin/dev, origin/claude/review                 ← at master
```

### 1.5 Flow

```
guides read again ──> red checks on origin/claude/review ──> rewrite + defaults ──> types, lint, validate-repo, docs build ──> routes-manifest order + date text in .next/static ──> merge into claude/review
claude/review ── fast-forward ──> dev ── gh pr create (release:skip, ci:skip) ──> first run ── CLEAN ── auto-merge ──> master ── Vercel build ──> live reads

browser, after the change:
posthog.init ── fetch /ingest/array/<token>/config ── rewrite 2 ──> us-assets.i.posthog.com/array/<token>/config   (was: catch-all ──> us.i.posthog.com)
capture ── /ingest/e/, /ingest/batch/ ── catch-all ──> us.i.posthog.com                                            (unchanged)
recorder ── /ingest/static/* ── rewrite 1 ──> us-assets.i.posthog.com/static/*                                     (unchanged)
```

### 1.6 Components

#### 1.6.1 The config rewrite (D160)

- `apps/shadcn-table-docs/next.config.mjs`, `rewrites.afterFiles`: one new entry `{ source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' }`, placed after the `/ingest/static/:path*` entry and before the `/ingest/:path*` catch-all. Next matches `afterFiles` rewrites in order, so an entry after the catch-all would never match.
- Ride-along, the comment above the PostHog rewrites (line 65): it says `components/posthog-provider.tsx` sets `api_host '/ingest'`; the options live in `lib/posthog-options.ts` since D62. The comment names that file and says that the static files and the config files go to the assets host, everything else to the ingest host.
- The path the proxy guide names is read again on the day (`https://posthog.com/docs/advanced/proxy/nextjs.md`, US region); the entry uses the guide's destination as it reads then, and the tracker quotes the guide's line.
- `app/robots.ts` already disallows `/ingest/`; `proxy.ts` keeps its matcher: the tracker has one line that the matcher does not catch `/ingest/array/x` (the pattern read, not run).
- Does NOT change the two existing rewrites, `skipTrailingSlashRedirect`, the slash redirect of D53, the headers, or `proxy.ts`.

#### 1.6.2 The dated defaults (D161)

- `apps/shadcn-table-docs/lib/posthog-options.ts`: `initOptions` gets `defaults: '<guide date>'`, the date read on the day from PostHog's Next.js install guide (`https://posthog.com/docs/libraries/next-js.md`); `2026-08-30` on 2026-11-23. The tracker quotes the guide's line.
- The date must be one the installed SDK accepts: `pnpm --filter shadcn-table-docs types:check` is the proof (the option's type is the list of dates). A date newer than `posthog-js@1.453.2` knows: this milestone bumps `posthog-js` to the latest `1.x` with `pnpm --filter shadcn-table-docs add posthog-js@latest`, under the rules of spec 76, 1.6.2 (a `1.` version only, the lockfile diff limited to `posthog-js` and `@posthog/*`), and the tracker says so. Otherwise `package.json` and `pnpm-lock.yaml` do not change.
- What the date changes, from the source of the installed version, not from memory: the tracker lists every config key the chosen date sets (the block that maps a `defaults` date to values in `node_modules/posthog-js/dist/module.js`, or the readable source in the npm tarball), one line each: the key, the value before (SDK `unset`), the value with the date, and what it means on the docs site. The list starts from tracker 76, recheck point 8 and is checked against the source.
- Explicit options win over the dated defaults: the tracker quotes the place in the SDK source that shows it (the user config applied over the defaults), so `autocapture: false` still holds. A key in the list that would undo a deliberate difference (autocapture back on, an `identify` call, eager loading) is set explicitly in `initOptions` to its value of today, with a comment naming D161; the tracker names it.
- Removal of a hand-set option: for each of the six options of today, the tracker says whether the chosen date gives the same value. `capture_pageview: 'history_change'` is the expected case (tracker 76, point 5); it is removed only when the source read above shows the date gives `'history_change'`. `api_host`, `ui_host`, `autocapture`, and any option whose value comes from the plain SDK default and not from the date (`capture_pageleave`, `person_profiles`) stay.
- The doc comment of `initOptions` says: the dated defaults follow PostHog's install guide; page views on history changes come from them (when `capture_pageview` was removed); autocapture stays off; replay follows the project setting; nothing calls `identify`.
- Does NOT change `lib/posthog-client.ts`, `components/posthog-provider.tsx`, `lib/analytics.ts` or any event name or property.

#### 1.6.3 The guides read again, docs and proof (D160, D161, P9, P11)

- Both guides are fetched again on the day and compared with tracker 76's eight recheck points. A point that reads differently than on 2026-11-23, or a new instruction for a Next.js app with a reverse proxy: followed in this milestone when it is not one of the deliberate differences (the lazy load of D62, `autocapture: false`, no `identify`, the env var name `NEXT_PUBLIC_POSTHOG_KEY`, which is a name only and lives in the Vercel env), and named in the tracker with the file changed. A change that needs a PostHog project setting, a Vercel setting or an env var: not made, named in the tracker's Attention and in the DONE line. No queue card for a setup point (the owner's word, epic E24 Notes); a queue card only for something that is not setup (a bug in the docs site).
- `CONTRIBUTING.md`, Analytics: item 1's option list gains the dated defaults of the install guide (and loses "page views on history changes" as a hand-set option when `capture_pageview` was removed: the sentence then says the defaults give them); item 3 names three rewrites: `/ingest/static/*` and `/ingest/array/*` to `us-assets.i.posthog.com`, `/ingest/*` to `us.i.posthog.com`. The rest of the section stays.
- `CHANGELOG.md` (P9): `#### Spec 77` under `## Unreleased`, `### Docs`: one line for the config proxy, one for the dated defaults.
- Red first (P11), on `origin/claude/review` before any edit, each result in the tracker: after `pnpm --filter shadcn-table-docs build`, the manifest check below prints no `/ingest/array/:path*` entry, and `grep -rl 'defaults:"<guide date>"' apps/shadcn-table-docs/.next/static | head -1` prints nothing.
- Proof without sending a request to PostHog, after the edits and `pnpm --filter shadcn-table-docs build` in the worktree:
  - `node -e "const r=require('./apps/shadcn-table-docs/.next/routes-manifest.json').rewrites.afterFiles.map(x=>x.source).filter(s=>s.startsWith('/ingest'));console.log(r.join(' '))"` prints `/ingest/static/:path* /ingest/array/:path* /ingest/:path*` in that order (the manifest may hold the rewrites as a plain array on some Next versions: read the shape first, the tracker says which);
  - the `/ingest/array/:path*` entry's destination in the manifest is the guide's assets host;
  - `grep -rl 'defaults:"<guide date>"' apps/shadcn-table-docs/.next/static | head -1` prints a file (the minified options chunk; when the minifier writes the key differently, the date text alone with the chunk named in the tracker);
  - `grep -rl '1\.453\.2' apps/shadcn-table-docs/.next/static | head -1` still prints a file, or the bumped version when 1.6.2 bumped.
- The built app is not started with the key and no request is sent to PostHog from this machine.
- Does NOT run the Storybook tests, the docs E2E suite or the installation E2E (the ship is `ci:skip`, the owner's word of D159 and D161: only the analytics setup changes); does NOT touch `packages/shadcn-table/**`.

#### 1.6.4 Shipping (D161, D153, D154, D155, P1, P4)

- Precondition: `claude/review` contains `origin/master`; the tracker `77-posthog-setup-fixes` says `Status: done`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only the commits and the merge of this spec's first milestone; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors of `claude/review`; no PR is open (`gh pr list --state open`).
- The fast-forward of `dev` to the head of `claude/review`, pushed (a plain push of that head to `refs/heads/dev`), never in the root checkout (P2). One push: the PR is created only after it.
- `gh pr create --base master --head dev --title "chore(docs): posthog setup follows the guides" --label release:skip --label ci:skip --body-file <body>`, the body per `.github/pull_request_template.md`: the config rewrite, the dated defaults with the list of what the date changes (from the tracker), and one line that the test jobs are skipped by the owner's word (D161, D153).
- The first run: Head prints `skip=true (label ci:skip)`, the 16 matrix legs succeed with no step run, Validate PR says `No release (release:skip)`. After it ends, `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` with one push and no rerun (D155, proven on PR 146 and PR 147); then `gh pr merge <N> --auto --merge`. Not `CLEAN`: the per-context table of spec 72, 1.6.2 for the head, the cause in the tracker, a fix milestone of this spec (`plan/new_fix.py`), reproduced under `act` where `act` can show it (P3); no rerun, no empty commit, no merge past the checks.
- `release.yml` on the `master` push: Check Release says `none`; the warning that `## Unreleased` holds blocks is expected.
- Vercel builds `master`. The live reads, in a browser with a normal browser user agent (posthog-js drops bot user agents with a console warning since 1.451.2) against `https://www.shadcn-table.com/`, each as one line in the tracker with what was read and pass or fail, the browser closed after:
  - after the first interaction on `/`, the request `/ingest/array/<token>/config` answers 200 with a JSON body; its `cache-control` response header is recorded (the assets host sends one; tracker 76 could not read this path before the change);
  - a request under `/ingest/` (`e/`, `batch/` or `flags/`) answers 200, and its SDK version (`ver` query parameter, else `$lib_version` in the decoded body) is the installed one;
  - a client route change (the header link to an example) sends exactly one `$pageview` (seen in the decoded body of a further 200 under `/ingest/`); two for one route change is a fail (page views from both the defaults and a left-over option);
  - each of the seven events of `lib/analytics.ts` is triggered once and its name is seen in a decoded request body: `base_switched` (the base switcher), `install_command_copied` (copy of an install command), `example_code_opened` (the Code view of an example), `example_file_viewed` (a file in the code panel), `storybook_opened` (the Storybook link), `outbound_clicked` (the GitHub link), `search_used` (the search); the control used for each is named in the tracker, read from the call sites of the `track*` functions;
  - the static assets posthog-js loads after init answer 200 under `/ingest/static/`;
  - no error naming posthog in the console.
- An event the date adds by design (a `$rageclick`, for example) is not triggered on purpose; one that shows up is recorded, not a fail. A session recording request (`/ingest/s/`) within one minute is recorded as seen or not seen; not seen is not a fail (D67).
- A failed live read is fixed forward at once: a fix milestone of this spec (`plan/new_fix.py`) and a second shipping PR with the same two labels; the tracker and the DONE line say what the live site did in between.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.7"`; push both.
- The DONE line to the lead names: the config request's host path and status, the `defaults` date live, whether `capture_pageview` was removed, the seven events seen, every further setup difference fixed or left with its reason, and what only the owner can do (a PostHog or Vercel setting), if anything.
- Does NOT bump a version, tag, or create a GitHub release; does NOT move a `CHANGELOG.md` block; does NOT change a workflow file, the ruleset or the `release` environment (P7); does NOT change a PostHog project setting; does NOT merge `v0.9/filter-input-fixes` or `v0.9/click-to-copy-tooltip-refocus`; does NOT move the owner's worktrees `wt1` and `wt2`; does NOT deploy with the Vercel CLI.

**Stays unchanged:** `apps/shadcn-table-docs/lib/posthog-client.ts`, `components/posthog-provider.tsx`, `lib/analytics.ts`, `proxy.ts`, `app/robots.ts`, the two existing rewrites and the slash redirect in `next.config.mjs`, `packages/shadcn-table/**`, `packages/shadcn-table/package.json` (version 0.9.7), every dependency (unless 1.6.2 bumps `posthog-js`).

### 1.7 Dependencies and env

- No new package. `posthog-js` stays `1.453.2` unless the guide's `defaults` date needs a newer `1.x` (1.6.2); this milestone then owns `apps/shadcn-table-docs/package.json` and `pnpm-lock.yaml` for the epic (P6).
- `gh` authenticated as the owner (the runner's login); a browser for the live reads; network access to `posthog.com` for the two guides.
- `NEXT_PUBLIC_POSTHOG_KEY` is not needed locally: the local proof reads the build output, the live site has the key in its Vercel env.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: PostHog setup fixes

- Files owned: `apps/shadcn-table-docs/next.config.mjs`, `apps/shadcn-table-docs/lib/posthog-options.ts`, `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`, `CONTRIBUTING.md`, `CHANGELOG.md`
- Depends on: none
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm --filter shadcn-table-docs types:check`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm --filter shadcn-table-docs build`, one at a time (P5)
- Task 1: The two guides read again and the red checks (1.6.3, P11). Checks: the tracker quotes the proxy guide's `array` rewrite line and the install guide's `defaults` line with the day they were read; one line per recheck point of tracker 76 that reads differently, or the line that none does; on `origin/claude/review` the manifest check prints no `/ingest/array/:path*` and the `defaults` grep prints nothing, both lines in the tracker
- Task 2: The rewrite and its comment (1.6.1). Checks: `grep -c "source: '/ingest/array/:path\*'" apps/shadcn-table-docs/next.config.mjs` prints `1`; `grep -n "source: '/ingest" apps/shadcn-table-docs/next.config.mjs` lists static, array, catch-all in that order; `grep -c 'components/posthog-provider.tsx sets' apps/shadcn-table-docs/next.config.mjs` prints `0`; the `proxy.ts` matcher line in the tracker
- Task 3: The dated defaults, the option removal, `CONTRIBUTING.md` and the changelog block (1.6.2, 1.6.3). Checks: `grep -c "defaults: '" apps/shadcn-table-docs/lib/posthog-options.ts` prints `1`; the tracker holds the list of keys the date sets (key, before, after, meaning), the quoted source place that explicit options win, and one equal-or-not line for each of the six options of today; `grep -c 'autocapture: false' apps/shadcn-table-docs/lib/posthog-options.ts` prints `1`; `git diff --stat origin/claude/review -- apps/shadcn-table-docs/lib/posthog-client.ts apps/shadcn-table-docs/lib/analytics.ts apps/shadcn-table-docs/components/posthog-provider.tsx` prints nothing; `git diff --stat origin/claude/review -- apps/shadcn-table-docs/package.json pnpm-lock.yaml` prints nothing, or the tracker names the bump and its reason; `grep -c '/ingest/array' CONTRIBUTING.md` prints `1` or more; `grep -c '^#### Spec 77' CHANGELOG.md` prints `1`; `pnpm --filter shadcn-table-docs types:check`, `pnpm test lint` and `pnpm test validate-repo` green
- Task 4: The docs build and the proof in its output (1.6.3). Checks: `pnpm --filter shadcn-table-docs build` exits 0; the manifest check prints `/ingest/static/:path* /ingest/array/:path* /ingest/:path*`; the array entry's destination is the guide's assets host; `grep -rl 'defaults:"<guide date>"' apps/shadcn-table-docs/.next/static | head -1` prints a file; the SDK version text is in `.next/static`; no dev or start server left running, the worktree clean after the commit

### Milestone: Ship the PostHog setup fixes

- Files owned: none
- Depends on: PostHog setup fixes
- Review: none
- Local CI: none (the PR's run is the proof; a red is reproduced under `act`, P3)
- Task 1: The precondition and the fast-forward of `dev` (1.6.4). Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; the tracker `77-posthog-setup-fixes` says `Status: done`; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; `gh pr list --state open --json number --jq length` prints `0`; `git rev-parse origin/dev` equals the head of `claude/review`
- Task 2: The PR with both labels, its first run, the `CLEAN` read, auto-merge and the merge (1.6.4). Checks: `gh pr view <N> --json labels --jq '[.labels[].name] | sort'` prints `["ci:skip","release:skip"]`; the Head log holds `skip=true`; `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` after the first run, with one push and no rerun; `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0`; `gh pr view <N> --json state --jq .state` prints `MERGED`
- Task 3: After the merge (1.6.4): `release.yml` says `none`, the live reads, the branches up to `master`. Checks: `git ls-remote --tags origin v0.9.8` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.7`; one line per live read in the tracker with the text read and pass or fail: the config request with its status and `cache-control`, the capture request with the SDK version and its source, the single `$pageview`, the seven event names each with its control, the static assets, the console; the recording line as seen or not seen; the browser closed; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times

### 2.2 Checks

- PostHog setup fixes: the guide lines and the red checks in the tracker, the rewrite order in `next.config.mjs` and in the built `routes-manifest.json`, the list of what the `defaults` date sets, types, lint, validate-repo and the docs build green, the date text in `.next/static`
- Ship the PostHog setup fixes: the PR run with no test step, the first-run `CLEAN` read, the merge, no tag, the live reads: config 200 through `/ingest/array/`, capture 200, one `$pageview` per route change, the seven events
- Review: none (one rewrite entry and one init option in the docs app, following the vendor's guides; no library file, no public API, no shared state)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2)
