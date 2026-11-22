# 76: PostHog SDK update, tracker

Status: done (404f2fec)
Branch `v0.9/posthog-sdk-update`, worktree 03
Checks:
- Check: latest 1.x, `npm view posthog-js version` at f9ed2a79: 1.453.2 (a 1. version)
- Check: no app code change, `git diff --stat origin/claude/review -- apps/shadcn-table-docs/lib apps/shadcn-table-docs/components apps/shadcn-table-docs/next.config.mjs` at f9ed2a79: prints nothing
- Check: no app code change, same command at c78a1df5: prints nothing
- Check: old range gone, `grep -c '"posthog-js": "\^1\.438\.13"' apps/shadcn-table-docs/package.json` at c78a1df5: 0
- Check: frozen install, `pnpm install --frozen-lockfile` at c78a1df5: exit 0
- Check: one version, `pnpm why posthog-js --filter shadcn-table-docs` at c78a1df5: posthog-js 1.453.2 only
- Check: lockfile diff, `git diff origin/claude/review -- pnpm-lock.yaml | grep -E '^[+-] ' | grep -v -i posthog` at c78a1df5: only lines of the posthog-js and @posthog/* blocks; @posthog/browser-common 0.12.2 now depends on dompurify 3.4.17 and preact 10.29.8, both already locked at those versions, no other package moved
- Check: contributing, `grep -c 'lib/posthog-client.ts' CONTRIBUTING.md` at c78a1df5: 1
- Check: changelog, `grep -c '^#### Spec 76' CHANGELOG.md` at c78a1df5: 1
- Check: types, `pnpm --filter shadcn-table-docs types:check` at c78a1df5: pass
- Check: lint, `pnpm test lint` at c78a1df5: pass (exit 0, 9 existing warnings, none in a changed file)
- Check: validate-repo, `pnpm test validate-repo` at c78a1df5: pass
- Check: docs build, `pnpm --filter shadcn-table-docs build` at c78a1df5: pass
- Check: new version text, `grep -rl '1\.453\.2' apps/shadcn-table-docs/.next/static | head -1` at c78a1df5: `.next/static/chunks/2lvshzfglx-8h.js`
- Check: old version text, `grep -rl '1\.438\.13' apps/shadcn-table-docs/.next/static | head -1` at c78a1df5: prints nothing
- Check: clean worktree, `git status --short` at c78a1df5: prints nothing; no server started
- Check: verifier files, `git diff --name-only f9ed2a79..HEAD` at c78a1df5: CHANGELOG.md, CONTRIBUTING.md, apps/shadcn-table-docs/package.json, pnpm-lock.yaml only; nothing under .ai/
- Check: verifier lockfile diff, `git diff f9ed2a79..HEAD -- pnpm-lock.yaml | grep -E '^[+-] ' | grep -v -i posthog` at c78a1df5: only posthog block lines; dompurify 3.4.17 and preact 10.29.8 already locked at f9ed2a79
- Check: verifier frozen install, `pnpm install --frozen-lockfile` at c78a1df5: exit 0, git status clean
- Check: verifier one version, `pnpm why posthog-js --filter shadcn-table-docs` at c78a1df5: posthog-js 1.453.2 only
- Check: verifier new version text, `grep -rl '1\.453\.2' apps/shadcn-table-docs/.next/static | head -1` at c78a1df5 (build of 05:45, after the commit): `.next/static/chunks/2lvshzfglx-8h.js`
- Check: verifier old version text, `grep -rl '1\.438\.13' apps/shadcn-table-docs/.next/static | head -1` at c78a1df5: prints nothing
- Check: verifier recheck spot-check, points 1, 3 and 8 against both guide pages fetched 2026-11-23: as recorded (`instrumentation-client.ts`, `/yourpath/array/:path*` to `us-assets.i.posthog.com/array/:path*`, `defaults: '2026-08-30'`)

- Task 1 release notes and setup recheck: done (9b768869, plan commit)
- Task 2 bump, CONTRIBUTING sentence, changelog block: done (c78a1df5)
- Task 3 docs build and version text: done (c78a1df5, no commit needed)

## Release notes, 1.438.13 to 1.453.2

Source: `packages/browser/CHANGELOG.md` of PostHog/posthog-js (gh api), entries 1.438.14 to 1.453.2; source read in the npm tarballs of both versions.

- 1.453.1: `$sdk_debug_retry_queue_size` and `$sdk_debug_extensions_init_*` are attached only when the queue is backed up or extensions took measurable time: events carry fewer debug properties; event names and the seven custom events unchanged.
- 1.453.0: gzip output validation does less main-thread work: every `/ingest` request, no change in content.
- 1.451.2, 1.447.7: a bot user agent that the filter drops now gets one console warning, even outside debug: the ship milestone's "no error naming posthog in the console" read should use a normal browser user agent.
- 1.451.1: the replay sampling decision in the `ph_<token>_posthog` cookie loses its `!` prefix, old values are rewritten on the next load: session replay (D67), no change in what is sent; with 100 percent sampling no visitor is sampled out.
- 1.451.0: remote config now loads as JSON with `fetch` from `/array/<token>/config` on the assets endpoint, which with `api_host: '/ingest'` is `/ingest/array/<token>/config` through the catch-all rewrite to `us.i.posthog.com`; 1.438.13 loaded `/ingest/array/<token>/config.js` as a script through the same rewrite (and fell back to the same JSON URL). Remote config drives session replay (D67); see recheck point 3.
- 1.450.1: page-unload beacon bodies are sent as bare `text/plain`: `$pageleave` (capture_pageleave) is accepted when compression is off; same event.
- 1.447.8: debug-mode warning when `capture_pageview: 'history_change'` is set without the history autocapture extension: the app imports the default bundle (`dist/module.js`), which includes it; page views on route changes unchanged.
- 1.447.4, 1.438.22: `capture()` no longer parses the persistence entry on every call: faster `capture` and `register`; same events.
- 1.445.6: flags requests over XHR retry on timeout: `/ingest/flags/` only in browsers without `fetch`; the app uses no flags.
- 1.441.1: UUID generation falls back to `Math.random` when `crypto.getRandomValues` throws: `capture` no longer breaks there.
- 1.439.2: identity restored correctly from the back-forward cache: anonymous distinct id on back and forward; no `identify` here.
- 1.439.0: new `defaults: 'latest'` option: not set here; see recheck point 8.
- 1.438.23: `__preview_replay_sync_fetch` defaults to true: replay network capture, active only when the PostHog project enables network capture (D67).
- 1.438.21: IE11 polyfills ship only in `array.full.es5.js`: the default module bundle the app imports gets smaller.
- 1.438.20: query params read with form-encoding rules: UTM, click id and search keyword properties on page views keep an encoded `+` and values with `=`; more correct values, same properties.
- 1.453.0, 1.449.2, 1.447.15, 1.447.14, 1.447.13, 1.447.9, 1.447.8, 1.447.6, 1.447.5, 1.447.3, 1.447.2, 1.446.3, 1.446.2, 1.445.4, 1.444.2, 1.444.1, 1.441.2, 1.439.1, 1.438.17, 1.438.16: session replay recorder fixes and opt-in masking options (replay fidelity, masking of hidden inputs and dropdowns, a large-render freeze): the recorder still loads under `/ingest/static/`; replay follows the project setting (D67); nothing set here.
- Not used by the docs app (no entry line): autocapture (off), surveys, conversations, product tours, web experiments, feature flags API, metrics, the slim bundle, the snippet loaders, subresource integrity, trace propagation.

## Setup recheck

Read 2026-11-23 from `https://posthog.com/docs/libraries/next-js.md` and `https://posthog.com/docs/advanced/proxy/nextjs.md` (both fetched, 200), against `lib/posthog-client.ts`, `lib/posthog-options.ts`, `components/posthog-provider.tsx`, `lib/analytics.ts`, `next.config.mjs`.

- 1 Init place: differs: the guide calls `posthog.init` at module load in `instrumentation-client.ts`; the app imports `posthog-js` on the first idle moment or interaction after hydration (`lib/posthog-client.ts`) to keep it out of the first script load, deliberate (D62, Q30).
- 2 Key and host: differs: the env var is `NEXT_PUBLIC_POSTHOG_KEY` where the guide names `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and `api_host` is the literal `'/ingest'` where the install guide reads `NEXT_PUBLIC_POSTHOG_HOST`; a name only, the value is the same project token from the Vercel env; `api_host: '/ingest'` and `ui_host: 'https://us.posthog.com'` match the proxy guide's US form.
- 3 Rewrites: differs: `/ingest/static/:path*` to `us-assets.i.posthog.com/static/:path*` and `/ingest/:path*` to `us.i.posthog.com/:path*` match; the guide now adds `/yourpath/array/:path*` to `https://us-assets.i.posthog.com/array/:path*` before the catch-all, which the app lacks: remote config goes through the catch-all to `us.i.posthog.com`, which the guide says serves it without the asset server's `cache-control` headers; the same route 0.9.7's `config.js` took. Not added (Attention).
- 4 Trailing slash: matches: `skipTrailingSlashRedirect: true` as the guide; the extra redirect `/:path((?!ingest).*)/` that spares `/ingest` (D53) is the guide's own troubleshooting fix for the SEO side.
- 5 Page views: matches: `capture_pageview: 'history_change'` is what the guide's `defaults: '2026-08-30'` gives (any date from 2025-05-24); `capture_pageleave: true` equals the SDK default `'if_capture_pageview'` with page views on.
- 6 Profiles, autocapture, identify: differs: `person_profiles: 'identified_only'` is the SDK default (matches); `autocapture: false` where the guide keeps the SDK default on, deliberate (the seven custom events of `lib/analytics.ts` are the signal, `lib/posthog-options.ts`); no `identify`, which the guide calls required after login: the docs site has no login, the guide's own case "no ID available, skip the identify".
- 7 Session replay: matches: neither the guide nor the app sets `disable_session_recording`; replay follows the PostHog project setting (D67).
- 8 Options the guide sets that the app does not: differs: `defaults: '2026-08-30'`; the app sets none (SDK `'unset'`). The date would change rageclick, `external_scripts_inject_target` (`head`), `internal_or_test_user_hostname` (localhost), `persistence_save_debounce_ms`, `split_storage`, `detect_google_search_app`, `disable_capture_url_hashes`, cookie conflict handling and replay defaults (`captureJsonLd`), so what the site sends; named, not added.

## Attention

- The lead decides whether `next.config.mjs` gets the guide's `/ingest/array/:path*` rewrite to `https://us-assets.i.posthog.com/array/:path*`; not added here.
	- Since 1.451.0 remote config is a `fetch` of `/ingest/array/<token>/config`; today it reaches `us.i.posthog.com` through the catch-all, the route 0.9.7 used for `config.js`, served without cache headers per the guide.
	- If that host does not answer the JSON path, replay falls back to defaults or saved settings (D67). The ship milestone's live read of a 200 on `/ingest/array/<token>/config` settles it; no request was sent to PostHog from this machine.
	- The guide's `defaults: '2026-08-30'` (recheck point 8) is named, not added; adopting it changes what the site sends.

## Notes

- Ship milestone: add one live read, `/ingest/array/<token>/config` answers 200 (remote config, 1.451.0).
