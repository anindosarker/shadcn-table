# 77: PostHog setup fixes, tracker

Status: running
Branch `v0.9/posthog-setup-fixes`, worktree 03
Checks:
- Check: proxy guide, `curl https://posthog.com/docs/advanced/proxy/nextjs.md` read 2026-11-23: 200; US rewrite line: `source: '/yourpath/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*',` (after the static entry, before the catch-all; "The static and array rewrites must come before the catch-all")
- Check: install guide, `curl https://posthog.com/docs/libraries/next-js.md` read 2026-11-23: 200; defaults line in `instrumentation-client.ts`: `defaults: '2026-08-30'`
- Check: recheck points of tracker 76 against both guides read 2026-11-23: none reads differently (points 1 to 8 as recorded in tracker 76)
- Check: manifest shape, `apps/shadcn-table-docs/.next/routes-manifest.json` at 14948e64: `rewrites` is an object with `beforeFiles`, `afterFiles`, `fallback`; the PostHog rewrites are in `afterFiles`
- Check: red manifest, `node -e "...rewrites.afterFiles...filter(s=>s.startsWith('/ingest'))"` after `pnpm --filter shadcn-table-docs build` at 14948e64: `/ingest/static/:path* /ingest/:path*`, no `/ingest/array/:path*` (fail as expected)
- Check: red defaults, `grep -rl 'defaults:"2026-08-30"' apps/shadcn-table-docs/.next/static | head -1` at 14948e64: prints nothing (fail as expected)
- Check: one array rewrite, `grep -c "source: '/ingest/array/:path\*'" apps/shadcn-table-docs/next.config.mjs` at d5c01b5a: 1
- Check: rewrite order, `grep -n "source: '/ingest" apps/shadcn-table-docs/next.config.mjs` at d5c01b5a: static (72), array (76), catch-all (80)
- Check: stale comment gone, `grep -c 'components/posthog-provider.tsx sets' apps/shadcn-table-docs/next.config.mjs` at d5c01b5a: 0
- Check: proxy matcher, `apps/shadcn-table-docs/proxy.ts` read at d5c01b5a: `matcher: ['/docs', '/docs/:path*']` does not catch `/ingest/array/x` (pattern read, not run); this also meets the proxy guide's middleware matcher note
- Check: defaults set, `grep -c "defaults: '" apps/shadcn-table-docs/lib/posthog-options.ts` at 00ec323f: 1
- Check: autocapture off, `grep -c 'autocapture: false' apps/shadcn-table-docs/lib/posthog-options.ts` at 00ec323f: 1
- Check: date accepted, installed `@posthog/types@1.427.0` `CONFIG_DEFAULTS_DATES` lists `2026-08-30`; no bump
- Check: untouched files, `git diff --stat origin/claude/review -- apps/shadcn-table-docs/lib/posthog-client.ts apps/shadcn-table-docs/lib/analytics.ts apps/shadcn-table-docs/components/posthog-provider.tsx` at 00ec323f: prints nothing
- Check: no dependency change, `git diff --stat origin/claude/review -- apps/shadcn-table-docs/package.json pnpm-lock.yaml` at 00ec323f: prints nothing
- Check: contributing, `grep -c '/ingest/array' CONTRIBUTING.md` at 00ec323f: 1
- Check: changelog, `grep -c '^#### Spec 77' CHANGELOG.md` at 00ec323f: 1
- Check: types, `pnpm --filter shadcn-table-docs types:check` at 00ec323f (tree as committed): pass
- Check: lint, `pnpm test lint` at 00ec323f (tree as committed): pass (exit 0, 9 existing warnings, none in a changed file)
- Check: validate-repo, `pnpm test validate-repo` at 00ec323f (tree as committed): pass, git status clean after
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 00ec323f: pass
- Check: manifest order, same `node -e` command at 00ec323f: `/ingest/static/:path* /ingest/array/:path* /ingest/:path*`
- Check: array destination, manifest entry `/ingest/array/:path*` at 00ec323f: `https://us-assets.i.posthog.com/array/:path*`
- Check: defaults text, `grep -rl 'defaults:"2026-08-30"' apps/shadcn-table-docs/.next/static | head -1` at 00ec323f: `.next/static/chunks/3oc6rqnabywvn.js`
- Check: SDK version text, `grep -rl '1\.453\.2' apps/shadcn-table-docs/.next/static | head -1` at 00ec323f: `.next/static/chunks/2lvshzfglx-8h.js`
- Check: clean worktree, `git status --short` at 00ec323f: prints nothing; no server started
- Check: verifier files, `git diff --name-only 14948e64..HEAD` at 00ec323f: CHANGELOG.md, CONTRIBUTING.md, lib/posthog-options.ts, next.config.mjs; no extra file, nothing under .ai/
- Check: verifier guides, both guide pages read 2026-11-23: 200; array destination `https://us-assets.i.posthog.com/array/:path*`, `defaults: '2026-08-30'`: match the code
- Check: verifier SDK source, installed `posthog-js@1.453.2` `dist/module.js` at 00ec323f: `capture_pageview:!t||"2025-05-24">t||"history_change"` and `c=Kr({},u,h,...)` with `Kr` skipping `undefined`: removal and explicit-wins proof confirmed
- Check: verifier install, `pnpm install --frozen-lockfile` at 00ec323f: exit 0, git status clean
- Check: verifier manifest order, same `node -e` command on the build output of 00ec323f: `/ingest/static/:path* /ingest/array/:path* /ingest/:path*`, array to `https://us-assets.i.posthog.com/array/:path*`
- Check: verifier build greps, `grep -rl 'defaults:"2026-08-30"'` and `grep -rl '1\.453\.2'` on `.next/static` at 00ec323f: `chunks/3oc6rqnabywvn.js`, `chunks/2lvshzfglx-8h.js`

- Task 1 guides read again and red checks: done (14948e64, no code commit)
- Task 2 array rewrite and its comment: done (d5c01b5a)
- Task 3 dated defaults, option removal, CONTRIBUTING, changelog: done (00ec323f)
- Task 4 docs build and proof in its output: done (00ec323f, no commit needed)

## What defaults '2026-08-30' sets

Source: installed `posthog-js@1.453.2`, `dist/module.js` (no readable `src` in the package; the source map has no `sourcesContent`), the function that builds the default config from the `defaults` date. Before is the SDK with `defaults` unset.

- `capture_pageview`: before `true`, with the date `'history_change'`: a `$pageview` on each client route change (pushState/popstate); the app set this by hand, now removed.
- `rageclick`: before `true`, with the date `{ content_ignorelist: [next, previous, prev, arrow glyphs, +, -], ignore_text_selection: true }`: rage clicks are detected only inside autocapture (`"$autocapture"===i&&"click"===t.type&&...n.rageclick`), which stays off: no `$rageclick` on the docs site.
- `session_recording`: before `{}`, with the date `{ strictMinimumDuration: true, canvasCapture: { resolutionScale: 0.6 }, streamNetworkBody: true, captureJsonLd: true }`: replay, when the PostHog project turns it on (D67), enforces the minimum duration strictly, scales canvas capture, streams network bodies only when network capture is on, and records JSON-LD.
- `external_scripts_inject_target`: before `'body'`, with the date `'head'`: the lazy-loaded recorder and extension scripts under `/ingest/static/` are appended to `<head>`.
- `internal_or_test_user_hostname`: before `undefined`, with the date `/^(localhost|127\.0\.0\.1)$/`: events from a local dev server are marked as internal or test; the live host is not matched.
- `persistence_save_debounce_ms`: before `0`, with the date `250`: writes to the `ph_<token>_posthog` storage are batched within 250 ms.
- `split_storage`: before `false`, with the date `true`: localStorage persistence is split into separate keys per storage group.
- `detect_google_search_app`: before `false`, with the date `true`: visits from the Google Search app get that browser name instead of Mobile Safari or Chrome.
- `disable_capture_url_hashes`: before `false`, with the date `true`: the `#` part of URLs is left out of captured URL properties; docs heading anchors no longer show in `$current_url`.
- `cookieWinsOnConflict`: before `false`, with the date `true`: with `localStorage+cookie` persistence, the cookie wins when it and localStorage disagree on identity properties.

Explicit options win: `const u=sc(e.defaults),h=rc(e),c=Kr({},u,h,{name:s,token:l});` in `init`, where `sc` builds the dated defaults, `rc(e)` is the user config and `Kr` assigns left to right skipping `undefined`, so `autocapture: false` holds. No key the date sets turns autocapture on, calls `identify` or loads eagerly: nothing set explicitly for D161.

Equal or not, the six options of the code before this milestone:
- `api_host: '/ingest'`: not set by the date (plain default `https://us.i.posthog.com`): stays.
- `ui_host: 'https://us.posthog.com'`: not set by the date (plain default `null`): stays.
- `capture_pageview: 'history_change'`: the date gives `'history_change'` (`capture_pageview:!t||"2025-05-24">t||"history_change"`): equal, removed.
- `capture_pageleave: true`: not set by the date (plain default `'if_capture_pageview'`): stays.
- `person_profiles: 'identified_only'`: not set by the date (plain default `identified_only`): stays.
- `autocapture: false`: not set by the date (plain default `true`): stays.

## Notes

- Controls for the ship milestone's live reads (call sites of `lib/analytics.ts`):
	- `base_switched`: the Base menu button (aria-label "Base") in the docs header, or the base tabs of an example; `components/base-selector.tsx`.
	- `install_command_copied`: the copy button of an install command block on `/docs/getting-started/install` (`components/mdx/install-command.tsx`), or "Copy install command" in an example's "More actions" menu (`components/example-playground.tsx`), or the home page install command (`components/dev-home/shared/install-command.tsx`).
	- `example_code_opened`: the "Code" button of the "View mode" group on an example (`components/example-playground.tsx`).
	- `example_file_viewed`: a file other than the open one in the code panel's file tree or file menu, after Code is on (`components/code-explorer.tsx`).
	- `storybook_opened`: the "Storybook" link in an example's "Open example" group (`components/example-playground.tsx`), or a Storybook link in a docs page (`components/mdx/storybook-link.tsx`).
	- `outbound_clicked`: the "GitHub" link (aria-label "GitHub") in the docs header (`components/site-nav.tsx`), or the home page nav or footer link.
	- `search_used`: opening the search dialog (header search button or its shortcut; `components/posthog-provider.tsx` fires on open).
- `capture_pageview` was removed: the dated defaults give `'history_change'`; one `$pageview` per route change is the expected live read.
- No further difference from the two guides beyond the deliberate ones (lazy load D62, `autocapture: false`, no `identify`, `NEXT_PUBLIC_POSTHOG_KEY`); nothing needs a PostHog, Vercel or env setting.
