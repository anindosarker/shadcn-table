# 03: PostHog, tracker

Decisions and deviations only. Branch `v0.4/03`, commits `973416f`, `0e7059f`, `02d5452`, `393d9b1`, `c59dcbb`, merge `e22efbd`. Reviewer verdict pass with one minor finding, gate agent green with the production check recorded as an owner item.

## Decisions

- Search event name is `search_used`, as `decisions.md` records; the part file said `search_opened` and was corrected in `c59dcbb`. The event fires from fumadocs' `useSearchContext().open` flag inside the provider, because `RootProvider` exposes no search callback; the part file's fallback was to drop the event.
- `install_command_copied` on docs pages: fumadocs' `DynamicCodeBlock` renders its own copy button with no copy callback, so the block's Actions slot in `components/mdx/install-command.tsx` carries an `onClickCapture` that reports the copy with the real package manager. `InitCommand` and `NamespaceCommand` report nothing.
- `base_switched` is reported only from the control that received the user event. fumadocs fans every group change to every Tabs in the group and once more on mount from the persisted value; a flag set in the capture phase of focus, click and keydown on the Tabs root and cleared in the bubble phase keeps the fan-out and the mount silent (`393d9b1`). Base UI activates a tab on focus of the mouse press, not on click, which is why the focus phase is included.
- Surfaces: `header` for `site-nav.tsx` and the header base switch, `nav` for the home nav and the Storybook entry of the examples index, `footer`, `mdx_link`, `command_bar`, `home`, `docs_page`, `example`, `tabs`. Home page install copies report `package_manager` `pnpm`, the only manager those surfaces offer.
- The Playwright gate uses a desktop Chrome user agent and clears `navigator.webdriver`, because posthog-js drops events from a browser it classifies as a bot.

## Deviations

- 1.6.3 names `components/mdx/copy-button.tsx` as the `install_command_copied` hook point through an `onCopied` prop. That component has no importers in the app, so the hook went to the CodeBlock Actions slot instead. The dead `copy-button.tsx` was left in place; removing it is its own commit outside this part.
- 1.7 says `.env*.local` is added to the docs `.gitignore`; the line already existed, nothing was added.
- The keyed Playwright run logs three console errors that are the real PostHog backend answering the invalid test key through the proxy (404 on `/ingest/array/<key>/config.js` and `/config`, 401 on `/ingest/flags/`). Event posts to `/ingest/e/` return 200. With a real key these do not occur.
- Owner items: set `NEXT_PUBLIC_POSTHOG_KEY` in the Vercel project (Production and Preview) and in `apps/docs/.env.local`; after the first production deploy confirm that PostHog "Verify installation" turns green and `$pageview` events show the production host.
- `footer.tsx`, `v12/nav.tsx`, `table-of-contents-list.tsx` and `mdx/install-command.tsx` became client components because they now call hooks or pass handlers.

## Gate numbers

- Keyed Playwright run: 2 `$pageview`, 2 `base_switched`, 1 `install_command_copied`, 1 `example_code_opened`, 1 `example_file_viewed`, 1 `search_used`, every event carrying the `base` super property, every request to `/ingest/e/`, zero requests to a posthog.com origin.
- No-key run: zero `/ingest` requests, zero console errors, zero page errors.
- Library gates on the merged result: `test` and `test:base` 400 of 400, `check:bases` 129 files, 23 allowed to differ.
