# Date picker docs site: design plan

Spec 85, section 1.6.1 (D178, D179, D162, D163). Read on 2026-11-24 from:

- the table docs shell, `shadcn-react-table/apps/shadcn-table-docs` at `origin/claude/review` commit `38e51f9` (paths below without a prefix are in that folder);
- the date picker repository `shadcn-date-picker` at `origin/main` commit `c42b8bb` (paths below with the prefix `picker:`), read again at `2cf6e6f` (v0.1.1) in review round 1: the cited story lines, the `tools/site-build.mjs` lines and the import counts of 5.2 are the same there, and the version in the install command is `0.1.1`;
- Vercel's and Tailwind's documentation, quoted with the address where a claim rests on it.

Target paths are in `shadcn-date-picker/docs/` unless they start with `picker:`. A taken file keeps the table's folder and file name.

Marks. `taken as is`: the file is copied byte for byte. `taken trimmed`: the file is copied and loses what its row lists; a row may also name value replacements (a name, an address, an import path, one function body), and nothing else in the file changes. `not taken`: the file is not copied. For a trimmed row the build's diff against the table file shows the listed deletions and the listed replacements, no other line. A part marked `WAITING (A2)` or `WAITING (A3)` is a look choice staged for the owner in the tracker's Attention section; the build takes the default the plan states unless the owner rules otherwise.

## 1. Shell inventory

### 1.1 The 132 files of app, components and lib

`git ls-files apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/lib` minus `components/ui*`, `components/prop-tables` and `components/dev-home/v*`: 132 files. Rows: 132. Taken as is 25, taken trimmed 29, not taken 78.

| # | File | Mark | What leaves or changes, and why |
|---|---|---|---|
| 1 | `app/(home)/layout.tsx` | taken as is |  |
| 2 | `app/(home)/page.tsx` | taken trimmed | leaves: the two JsonLd elements and their imports (JSON-LD, section 2). HomePage stays, from the trimmed components/dev-home/v12/home-page.tsx (section 1.2) |
| 3 | `app/SKILL.md/route.ts` | not taken | agent skill file of the table (agent bar, section 2) |
| 4 | `app/api/data/db.ts` | not taken | data of the table examples |
| 5 | `app/api/data/route.ts` | not taken | data of the table examples |
| 6 | `app/api/moredata/[phoneNumber]/route.ts` | not taken | data of the table examples |
| 7 | `app/api/search/route.ts` | taken as is |  |
| 8 | `app/api/treedata/route.ts` | not taken | data of the table examples |
| 9 | `app/api/users/route.ts` | not taken | data of the table examples |
| 10 | `app/apple-icon.tsx` | taken as is |  |
| 11 | `app/docs/[[...slug]]/page.tsx` | taken trimmed | leaves: JsonLd elements (JSON-LD), MarkdownCopyButton and ViewOptionsPopover with the st-page-actions group (Copy page, llms routes), the openGraph images line and getPageImageUrl (Open Graph), their imports. With them go the lines that only fed these: the `markdownUrl` line (page.tsx:31) and the names `getPageImageUrl`, `getPageMarkdownUrl` and `gitConfig` of the `@/lib/shared` import (page.tsx:15 to 20; `siteName` stays). The page bar keeps DocsBreadcrumb alone |
| 12 | `app/docs/layout.tsx` | taken trimmed | leaves: IconLibraryProvider (icon library selector). Replaced: DocsTreeLayout by fumadocs DocsLayout from fumadocs-ui/layouts/notebook, the same props (docs-tree-layout only adds the story rows) |
| 13 | `app/global.css` | taken trimmed | see section 4 |
| 14 | `app/icon.svg` | taken as is |  |
| 15 | `app/layout.tsx` | taken trimmed | leaves: PostHogProvider, DesignSystemProvider, ExampleIcons, designSystemScript, designSystemFontVariables, their imports; the `twitter` line (layout.tsx:28: a large image card with no image once both Open Graph image routes are gone). `metadataBase` and the canonical line stay and read `siteUrl` (row 122). Replaced: siteTitle text; the pre-paint style and theme script by static marks on html (section 4.3). TooltipProvider, RootProvider, SearchDialog, Inter, archivo, SIDEBAR_STATE_SCRIPT and searchHighlightStyle stay |
| 16 | `app/llms-full.txt/route.ts` | not taken | llms routes (section 2) |
| 17 | `app/llms.mdx/docs/[[...slug]]/route.ts` | not taken | llms routes (section 2) |
| 18 | `app/llms.txt/route.ts` | not taken | llms routes (section 2) |
| 19 | `app/not-found.tsx` | taken as is |  |
| 20 | `app/og/docs/[...slug]/route.tsx` | not taken | Open Graph image route (section 2) |
| 21 | `app/opengraph-image.tsx` | not taken | Open Graph image route (section 2) |
| 22 | `app/robots.ts` | not taken | robots route (section 2) |
| 23 | `app/sitemap.ts` | not taken | sitemap route (section 2) |
| 24 | `app/version.txt/route.ts` | taken trimmed | replaced: the import path of package.json (../../../package.json, the repository root) and the comment naming release.yml leaves |
| 25 | `components/agent-bar.tsx` | not taken | agent bar and Copy prompt (section 2) |
| 26 | `components/base-selector.tsx` | taken trimmed | leaves: trackBaseSwitched, the Surface type and the surface props, the interacted ref and the six capture and bubble handlers of useBaseTabs (analytics only). Import of TAB_VALUES unchanged |
| 27 | `components/callout.tsx` | taken as is |  |
| 28 | `components/code-explorer.tsx` | taken trimmed | leaves: trackExampleFileViewed and with it the example and base props (analytics only) |
| 29 | `components/design-system-provider.tsx` | not taken | theme customizer (section 2) |
| 30 | `components/dev-home/shared/autoplay-tile-grid.tsx` | not taken | home tiles of the table |
| 31 | `components/dev-home/shared/install-command.tsx` | taken trimmed | leaves: trackInstallCommandCopied and libraryItem (analytics only) |
| 32 | `components/dev-home/shared/intent-link.tsx` | taken as is |  |
| 33 | `components/dev-home/shared/live-table.tsx` | not taken | home tiles of the table |
| 34 | `components/dev-home/shared/outline-tiles.tsx` | not taken | home tiles of the table |
| 35 | `components/dev-home/tokens.css` | taken as is |  |
| 36 | `components/discord-icon.tsx` | not taken | Discord link (section 2) |
| 37 | `components/docs-breadcrumb.tsx` | taken as is |  |
| 38 | `components/docs-tree-layout.tsx` | not taken | only puts the story rows back (story pages, section 2) |
| 39 | `components/example-icons.tsx` | not taken | icon library of the table examples (section 2) |
| 40 | `components/example-playground.tsx` | taken trimmed | leaves: the Storybook button and menu entry, the fullscreen state, effect, button, tooltip and menu entry, Copy prompt (button and menu entry), Copy install command, the two disabled "soon" entries, the ExampleSwitcher and guide branches (switcher is always null), every track call, the props storyId, installCommand, installItem, prompt, and the two attributes the trims of rows 26 and 28 leave without a receiver: `surface="example"` on BaseSwitch (example-playground.tsx:376) and `example={name} base={base}` on CodeExplorer (example-playground.tsx:574). Stays: the Preview, Code, Both group, BaseSwitch, the preview and code slots. Replaced (D181): the More menu and its one entry "Open in GitHub" by a plain GitHub button in the same group, the same link and `GitHubIcon`, accessible name "Open in GitHub" |
| 41 | `components/example-skeleton.tsx` | taken trimmed | leaves: the table shape (the bordered block with its header band and eight rows) and the second bar. One pulsing bar stays as the loading shape of a picker: deletions only, and the table frame would flash where one trigger is about to render |
| 42 | `components/example-switcher.tsx` | not taken | steps between example pages; the playground no longer renders it |
| 43 | `components/example-tabs.tsx` | not taken | example groups of the table |
| 44 | `components/example-variant.tsx` | taken trimmed | replaced: the three loader paths (section 5.3). Nothing else |
| 45 | `components/github-icon.tsx` | taken as is |  |
| 46 | `components/guide-example-switch.tsx` | not taken | guide examples of the table |
| 47 | `components/icon-library-selector.tsx` | not taken | icon library selector (section 2) |
| 48 | `components/json-ld.tsx` | not taken | JSON-LD (section 2) |
| 49 | `components/locale-example-tabs.tsx` | not taken | locale selector (section 2) |
| 50 | `components/locale-selector.tsx` | not taken | locale selector (section 2) |
| 51 | `components/logo.tsx` | taken trimmed | replaced: the icon (Table2 by CalendarDays of lucide-react) and the second word (Table by Date Picker) |
| 52 | `components/mdx.tsx` | taken trimmed | leaves: TableOfContentsList, AgentPrompt, TryIt, GuideExamples, OrDivider, the seven prop tables and seven prop table sources, exampleComponents, StoryExample, InitCommand. Added in place of the exampleComponents spread: ExampleSnippet. Stays: defaultMdxComponents, InstallCommand, StorybookLink, Step, Steps, Tab, Tabs, Callout, CalloutContainer |
| 53 | `components/mdx/agent-prompt.tsx` | not taken | agent bar (section 2) |
| 54 | `components/mdx/copy-button.tsx` | not taken | no taken file renders it |
| 55 | `components/mdx/example-snippet.tsx` | taken trimmed | see section 5.4 |
| 56 | `components/mdx/guide-examples.tsx` | not taken | guide examples and story pages (section 2) |
| 57 | `components/mdx/install-command.tsx` | taken trimmed | leaves: IconLibrarySwitch, LocaleSwitch, ShortFormSwitch, RegistryEntry, InitCommand, the locale, item, overwrite and short branches, trackInstallCommandCopied with copyActions, Label and Switch. Stays: CommandTabs, BaseCommandTabs, and InstallCommand reduced to BaseCommandTabs over addCommand(base, pm) |
| 58 | `components/mdx/storybook-link.tsx` | taken trimmed | leaves: trackStorybookOpened and the development branch of storybookUrl. Replaced: the three addresses by /storybook/<base>/ (same origin) |
| 59 | `components/mdx/try-it.tsx` | not taken | no page uses it |
| 60 | `components/not-found-page.tsx` | taken trimmed | replaced (D181): Footer by the short footer of section 6.4. Stays: Nav with baseSwitch, the 404 block, the search box, the section links from NAV_LINKS, the four dev-home style sheets |
| 61 | `components/or-divider.tsx` | not taken | sits between the agent and the manual path; no agent path here |
| 62 | `components/page-switcher.tsx` | taken as is |  |
| 63 | `components/posthog-provider.tsx` | not taken | PostHog (section 2) |
| 64 | `components/search-dialog.tsx` | taken as is |  |
| 65 | `components/section-tabs.tsx` | taken trimmed | replaced: the signature, the body and the comment of isActive (section-tabs.tsx:48 to 53) and its one call (section-tabs.tsx:37, `isActive(l, pathname)` in place of `isActive(l.url, pathname)`), section 6.2. Nothing else |
| 66 | `components/sidebar-collapse-button.tsx` | taken as is |  |
| 67 | `components/sidebar-group-context.ts` | taken as is |  |
| 68 | `components/sidebar-item.tsx` | taken as is |  |
| 69 | `components/sidebar-resize-handle.tsx` | taken as is |  |
| 70 | `components/sidebar-section.tsx` | taken as is |  |
| 71 | `components/sidebar-separator.tsx` | taken as is |  |
| 72 | `components/sidebar-subgroup.tsx` | taken as is |  |
| 73 | `components/site-nav.tsx` | taken trimmed | leaves: the Discord link, DiscordIcon, DISCORD_URL, trackOutboundClicked. Replaced: the name shadcn-table by shadcn-date-picker |
| 74 | `components/story-example.tsx` | not taken | story pages (section 2) |
| 75 | `components/story-variant.tsx` | not taken | story pages (section 2) |
| 76 | `components/table-of-contents-list.tsx` | not taken | section overview pages; it imports lib/examples-entry.mjs |
| 77 | `components/theme-controls.tsx` | taken trimmed | leaves: Sheet, SheetTrigger, ThemeCustomizerTrigger, ThemeCustomizer (theme customizer). The pill with ModeToggle stays |
| 78 | `components/theme-customizer.tsx` | not taken | theme customizer (section 2) |
| 79 | `components/theme-demo/demo-themes.ts` | not taken | theme demo of the table home |
| 80 | `components/theme-demo/fonts.ts` | not taken | theme demo of the table home |
| 81 | `components/theme-demo/theme-scope.tsx` | not taken | theme demo of the table home |
| 82 | `components/theme-demo/theme-table.tsx` | not taken | theme demo of the table home |
| 83 | `components/theme-demo/use-theme-cycle.ts` | not taken | theme demo of the table home |
| 84 | `components/theme-demo/variants/whole-app-site.tsx` | not taken | theme demo of the table home |
| 85 | `components/theme-demo/variants/whole-app.tsx` | not taken | theme demo of the table home |
| 86 | `lib/analytics.ts` | not taken | PostHog events (section 2) |
| 87 | `lib/base-tabs.mjs` | taken trimmed | replaced: the path `../../../tools/registry/bases.mjs` by `./bases.mjs` (section 5.1) on the three lines that carry it: the import (base-tabs.mjs:1), the JSDoc type import of `TAB_VALUES` (base-tabs.mjs:10) and the file name in the comment (base-tabs.mjs:5, `lib/bases.mjs`). Nothing else |
| 88 | `lib/build-styles.mjs` | taken as is |  |
| 89 | `lib/cn.ts` | taken as is |  |
| 90 | `lib/design-system/color-presets.ts` | not taken | theme customizer and style switcher (section 2) |
| 91 | `lib/design-system/config.ts` | not taken | theme customizer and style switcher (section 2) |
| 92 | `lib/design-system/fonts.ts` | not taken | theme customizer and style switcher (section 2) |
| 93 | `lib/design-system/history.ts` | not taken | theme customizer and style switcher (section 2) |
| 94 | `lib/design-system/themes.ts` | not taken | theme customizer and style switcher (section 2) |
| 95 | `lib/design-system/tokens.ts` | not taken | theme customizer and style switcher (section 2) |
| 96 | `lib/dev-tsconfig.mjs` | not taken | second dev server of the table workspace |
| 97 | `lib/example-files.mjs` | taken as is |  |
| 98 | `lib/example-map.mjs` | not taken | generates examples/map.tsx and registry items of the table |
| 99 | `lib/example-pages.mjs` | not taken | example pages of the table |
| 100 | `lib/example-prompt.ts` | not taken | Copy prompt (section 2) |
| 101 | `lib/example-source.ts` | taken trimmed | see section 5.4 |
| 102 | `lib/example-variant-dir.mjs` | taken trimmed | replaced: the path `../../../tools/registry/bases.mjs` by `./bases.mjs` on the import (example-variant-dir.mjs:1) and the file name in the comment (example-variant-dir.mjs:5, `lib/bases.mjs`). Nothing else |
| 103 | `lib/example-variants.mjs` | taken trimmed | see section 5.2 |
| 104 | `lib/examples-entry.mjs` | not taken | Examples section entry of the table |
| 105 | `lib/fonts.ts` | taken as is |  |
| 106 | `lib/install.mjs` | not taken | installs the table library copies |
| 107 | `lib/install.ts` | taken trimmed | see section 5.1 |
| 108 | `lib/layout.shared.tsx` | taken trimmed | leaves: DiscordIcon, DISCORD_URL, the links array. Replaced: NAV_LINKS (three entries, each with the new field `pages`, section 6.2), the import path of package.json (../../package.json) |
| 109 | `lib/llms.ts` | not taken | llms routes (section 2) |
| 110 | `lib/locales.ts` | not taken | locale selector (section 2) |
| 111 | `lib/more-examples.ts` | not taken | story pages (section 2) |
| 112 | `lib/page-tree-utils.ts` | taken as is |  |
| 113 | `lib/posthog-client.ts` | not taken | PostHog (section 2) |
| 114 | `lib/posthog-options.ts` | not taken | PostHog (section 2) |
| 115 | `lib/prop-tables/cellInstanceAPIs.ts` | not taken | generated prop tables (section 2) |
| 116 | `lib/prop-tables/columnInstanceAPIs.ts` | not taken | generated prop tables (section 2) |
| 117 | `lib/prop-tables/columnOptions.ts` | not taken | generated prop tables (section 2) |
| 118 | `lib/prop-tables/rowInstanceAPIs.ts` | not taken | generated prop tables (section 2) |
| 119 | `lib/prop-tables/stateOptions.ts` | not taken | generated prop tables (section 2) |
| 120 | `lib/prop-tables/tableInstanceAPIs.ts` | not taken | generated prop tables (section 2) |
| 121 | `lib/prop-tables/tableOptions.ts` | not taken | generated prop tables (section 2) |
| 122 | `lib/shared.ts` | taken trimmed | leaves: docsImageRoute, docsContentRoute, getPageMarkdownUrl, absoluteMarkdownUrl, getPageImageUrl, registryRef, libraryItem, createGetUrl. Replaced: appName, siteName, siteDescription, gitConfig (repo shadcn-date-picker, branch main), and the fallback of siteUrl (shared.ts:28): `https://date-picker.shadcn-table.com`, the site's address (spec 85, 1.1), in place of the localhost address. `siteUrl` feeds only `metadataBase` in app/layout.tsx:22 once the other readers are gone (robots, sitemap, llms, structured data, the install prompt), so every page's canonical link is right in production with no environment variable; the Vercel project sets none and no setting is added (spec 85, 1.6.5). `NEXT_PUBLIC_SITE_URL` still wins where it is set. The comment above `siteUrl` (shared.ts:23 to 26) is replaced too: it names "the copy prompt" and "the dev port otherwise", both false here; the new one says the origin of the canonical links, the variable where set, the public address otherwise |
| 123 | `lib/sidebar-state.ts` | taken as is |  |
| 124 | `lib/source.ts` | taken trimmed | leaves: llms and docsLlms, toPlainMarkdown, the more-examples imports with isMoreExamples and lightMoreExamples, includeProcessedMarkdown, docsContentRoute and docsImageRoute. trimNode returns the folder as it builds it |
| 125 | `lib/story-pages.mjs` | not taken | story pages and the story map (section 2) |
| 126 | `lib/story-text-checklist.mjs` | not taken | story pages and the story map (section 2) |
| 127 | `lib/story-variants.mjs` | not taken | story pages and the story map (section 2) |
| 128 | `lib/storybook-map.ts` | not taken | story pages and the story map (section 2) |
| 129 | `lib/storybook-test-stub.ts` | not taken | story pages and the story map (section 2) |
| 130 | `lib/structured-data.ts` | not taken | JSON-LD (section 2) |
| 131 | `lib/use-media-query.ts` | not taken | only components/prop-tables imports it |
| 132 | `lib/utils.ts` | not taken | the shadcn CLI alias target; no taken file imports it |

### 1.2 Files the taken files need from outside the inventory

The inventory rule of spec 85 leaves `components/ui*`, `components/dev-home/v*` and the app root out. Taken files import some of them, so they come over too, under the same names.

| File | Mark | Why, and what leaves |
|---|---|---|
| `components/ui-radix/button.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `collapsible.tsx`, `popover.tsx`, `command.tsx`, `dialog.tsx`, `input-group.tsx`, `input.tsx`, `textarea.tsx` | taken as is | The chrome's own shadcn parts (radix-nova). Imported by base-selector, code-explorer, example-playground (button, dropdown-menu), app/layout.tsx (tooltip), sidebar-section and sidebar-subgroup (collapsible), page-switcher (command, popover); command imports dialog and input-group, input-group imports input and textarea. They are the chrome only: no demo imports them |
| `styles/style-nova.css` | taken as is | The `cn-*` rules of the chrome parts (button.tsx names them on 15 lines); compiled by `lib/build-styles.mjs`. The seven other style files are not taken (style switcher) |
| `components/dev-home/v12/home-page.tsx` | taken trimmed | The home page. Leaves: Starfield, Dune, AgentBar, the demo, theming and features sections, AutoplayTileGrid, CodeStrip, RiseFigure, SignalDemo, ThemeDemo, Footer. Stays: the root div with its classes, Nav, the hero copy block (eyebrow, h1, pitch, the call to action row). Replaced: the texts and the two links (section 6.4); in place of AgentBar the install block and the two live demos (section 6.4). The h1 keeps the table's treatment of its dash (home-page.tsx:40): each of the two dashes of the new name sits in a `v7-wordmark-dash` span |
| `components/dev-home/v12/footer.tsx` | taken trimmed | The home and 404 footer (D181, section 6.4). Leaves: Dune, the column heads, Docs links, Discord, TanStack Table, shadcn/ui, the bottom MIT line, the base lookup, every track call. Stays: the wordmark to `/`, the licence line, GitHub (GITHUB_URL) and Storybook (`/storybook/`, a plain `<a>`) |
| `components/dev-home/v12/nav.tsx` | taken trimmed | The home header. Leaves: the Discord link, trackOutboundClicked. Replaced: the name, LINKS (the tabs of section 6.2) |
| `components/dev-home/v12/v12.css`, `v4/v4.css`, `v5/v5.css`, `v7/v7.css` | taken as is | The home and 404 classes (`v4-root`, `v4-nav`, `v4-shell`, `v4-wordmark`, `v4-display`, `v4-btn`, `v4-link`, `v7-eyebrow`, `v12-hero-copy`, `v12-h1`, `v12-pitch`, `v12-cta`, `v12-gh`). No `url()` in any of them. Rules of removed sections stay unused |
| `components/dev-home/v4/font.ts` | taken as is | Archivo for the home and 404 root |
| `components/dev-home/v4/nav.tsx` | taken trimmed | Replaced: GITHUB_URL (the date picker repository). Leaves: NAV_LINKS (unused) |
| `components/dev-home/v2/github-icon.tsx` | taken as is | The nav's GitHub mark |
| `next.config.mjs` | taken trimmed | Leaves: the examples-entry import, distDir, turbopack.resolveAlias, typescript.tsconfigPath, the rewrites (hosted registry, PostHog), skipTrailingSlashRedirect and the slash redirect that goes with it (next.config.mjs:104 to 113), every redirect but `/docs`. Replaced: the `/docs` destination (`/docs/install`); `permanent: true` stays as the table has it (next.config.mjs:117). Stays: createMDX, reactStrictMode, the four security headers (next.config.mjs:88) |
| `postcss.config.mjs` | taken as is | Tailwind 4 |
| `tsconfig.json` | taken trimmed | Leaves: the examples and stories include lines, the `.next-preview` lines, the examples exclude lines. Added: `demos/.base`, `demos/.radix`, `demos/.aria` and `registry` to include (the directory form: tsc rejects an entry that ends in `**`, TS5010, build task 1); `demos/*.tsx` to exclude, as the table excludes its hand-written `examples/<base>`: a demo imports `@/components/date-picker/`, which resolves only after the install, and its variants under `demos/.<base>` are checked (TS2307, build task 2) |
| `eslint.config.mjs` | taken trimmed | Leaves: the table ignores and rules. Ignores: `.next/**`, `next-env.d.ts`, `.source/**`, `components/ui-radix/**`, `registry/**`, `demos/.*/**`, `lib/bases.d.mts` (eslint-config-next parses `.mts` as JavaScript and stops at its first typed `const`, build task 1) |
| `.gitignore` | taken trimmed | Keeps: node_modules, `.source`, `/public/styles/`, `/.next/`, `*.tsbuildinfo`, `next-env.d.ts`, `.vercel`. Added: `/registry/`, `/demos/.base/`, `/demos/.radix/`, `/demos/.aria/`, `/demos/sources.json` |

Not taken from the app root: `proxy.ts` (markdown negotiation for the llms routes), `components.json`, `registry.json`, the port tsconfigs, `tsconfig.build.json`, `tsconfig.preview.json`, `tsconfig.ui-*.json`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `examples/`, `example-groups/`, `content/`, `public/`.

### 1.3 New files of the docs app (not from the shell)

| File | What it is |
|---|---|
| `package.json` | Section 3 |
| `lib/bases.mjs`, `lib/bases.d.mts` | Section 5.1 |
| `lib/registry-trees.mjs` | Section 5.2 |
| `app/theme.css` | Section 4.3 |
| `.prettierrc` | Section 5.2 |
| `content/docs/meta.json`, nine `.mdx` pages | Section 6 |
| `demos/*.tsx` | Section 6.3 |

### 1.4 Root files of the date picker repository, so its checks pass with docs/ in place

The root `lint` is `eslint . && prettier --check . "!pnpm-lock.yaml" "!registry/*/components/ui" "!registry/*/hooks"` (`picker:package.json:10`). The root `.prettierrc` sets `semi: false` and double quotes; the table's sets `semi: true` and `singleQuote: true` (`shadcn-react-table/.prettierrc`), and a taken file is copied byte for byte. The root eslint config lints every `**/*.{ts,tsx,mjs}` with typescript-eslint and react-hooks (`picker:eslint.config.mjs:15`). So the docs folder is checked by its own `lint` alone (`pnpm --filter docs lint`, eslint-config-next, as the table's app), and the root checks skip it:

| File | Entry |
|---|---|
| `picker:eslint.config.mjs` | `"docs"` added to `globalIgnores` (line 8). Nothing else |
| `picker:.prettierignore` | one line `docs` with a one-line comment (the docs app keeps the table's formatting). Nothing else |
| `picker:.gitignore` | no entry: `node_modules` already matches at any depth, the rest is in `docs/.gitignore` (1.2) |
| `picker:pnpm-workspace.yaml` | new: `packages:` with the one entry `docs`, the form that built on Vercel (proof branch, `git show b438583:pnpm-workspace.yaml`). The root needs no entry: "The root package is always included, even when custom location wildcards are used" (https://pnpm.io/pnpm-workspace_yaml). `pnpm.overrides` (`vite` to `npm:rolldown-vite@7.1.12`, `picker:package.json:58` to 62) stays in the root `package.json`, where a workspace still reads it |
| `picker:package.json` | no script changes: `typecheck` runs four projects whose `include` lists name `registry/<base>`, `stories` and `.storybook` only (`picker:tsconfig.baseui.json`, `tsconfig.stories.json`); `registry:check` reads `registry/`; `test` runs the Storybook project (`picker:vitest.config.ts`, stories from `../stories/**`, `picker:.storybook/main.ts:7`). `typecheck` and `registry:check` do not read `docs/`. `test` and `storybook:build` take no story, type or import from it, but their CSS does scan it: `picker:vite.config.ts:10` runs `@tailwindcss/vite`, `picker:vitest.config.ts:15` merges that config, and `picker:registry/base/index.css:1` imports Tailwind with no `source()` limit, so "Tailwind will scan every file in your project for class names" from "the current working directory as its starting point" (https://tailwindcss.com/docs/detecting-classes-in-source-files). The Storybook's CSS will then also hold the utilities found in the tracked files of `docs/` (app, components, content, demos); the git-ignored copies are skipped (4.1). Unused rules only, the look of a story does not change. No build change: a `source()` limit would be an edit under `registry/**`, which must not change (section 8) |

No prettier check runs on `docs/`; the hand-written files there (demos, `lib/bases.mjs`, `lib/registry-trees.mjs`) are written in the table's style, which `docs/.prettierrc` states (5.2).

## 2. Not taken, fixed by spec 85

| Feature | Files it removes (not taken) | Taken files it empties in part |
|---|---|---|
| Theme customizer and style switcher | `components/theme-customizer.tsx`, `components/design-system-provider.tsx`, `lib/design-system/*` (6), `styles/style-*.css` but nova | `components/theme-controls.tsx`, `app/layout.tsx` |
| Icon library and locale selectors | `components/icon-library-selector.tsx`, `components/example-icons.tsx`, `components/locale-selector.tsx`, `components/locale-example-tabs.tsx`, `lib/locales.ts` | `components/mdx/install-command.tsx`, `app/docs/layout.tsx`, `app/layout.tsx` |
| Agent bar and Copy prompt | `components/agent-bar.tsx`, `components/mdx/agent-prompt.tsx`, `lib/example-prompt.ts`, `app/SKILL.md/route.ts` | `components/example-playground.tsx`, `components/mdx/example-snippet.tsx`, `components/mdx.tsx`, `lib/install.ts`, `components/dev-home/v12/home-page.tsx` |
| Copy page | none | `app/docs/[[...slug]]/page.tsx`, `lib/shared.ts` |
| PostHog and every analytics call | `components/posthog-provider.tsx`, `lib/analytics.ts`, `lib/posthog-client.ts`, `lib/posthog-options.ts` | `app/layout.tsx`, `components/base-selector.tsx`, `components/code-explorer.tsx`, `components/example-playground.tsx`, `components/site-nav.tsx`, `components/mdx/install-command.tsx`, `components/mdx/storybook-link.tsx`, `components/dev-home/shared/install-command.tsx`, `components/dev-home/v12/nav.tsx`, `next.config.mjs` |
| Discord link | `components/discord-icon.tsx` | `components/site-nav.tsx`, `lib/layout.shared.tsx`, `components/dev-home/v12/nav.tsx` |
| llms routes | `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `app/llms.mdx/docs/[[...slug]]/route.ts`, `lib/llms.ts`, `proxy.ts` | `lib/source.ts`, `lib/shared.ts` |
| Open Graph image routes | `app/opengraph-image.tsx`, `app/og/docs/[...slug]/route.tsx` | `app/docs/[[...slug]]/page.tsx`, `lib/shared.ts` |
| JSON-LD | `components/json-ld.tsx`, `lib/structured-data.ts` | `app/(home)/page.tsx`, `app/docs/[[...slug]]/page.tsx` |
| Sitemap and robots routes | `app/sitemap.ts`, `app/robots.ts` | none |
| Story pages and the story map | `components/story-example.tsx`, `components/story-variant.tsx`, `components/docs-tree-layout.tsx`, `lib/more-examples.ts`, `lib/story-pages.mjs`, `lib/story-text-checklist.mjs`, `lib/story-variants.mjs`, `lib/storybook-map.ts`, `lib/storybook-test-stub.ts`, `components/mdx/guide-examples.tsx`, `components/guide-example-switch.tsx` | `lib/source.ts`, `app/docs/layout.tsx`, `components/mdx.tsx`, `components/example-playground.tsx`, `next.config.mjs`, `app/global.css` |
| Generated prop tables | `lib/prop-tables/*` (7), `components/prop-tables/*`, `lib/use-media-query.ts` | `components/mdx.tsx`, `app/global.css` |
| The playground's Storybook and fullscreen controls | none | `components/example-playground.tsx`, `app/global.css` |

Also not taken, table-only: the example data routes (`app/api/data`, `moredata`, `treedata`, `users`), the home tiles and theme demo (`components/dev-home/shared/{autoplay-tile-grid,live-table,outline-tiles}.tsx`, `components/theme-demo/*`), the example groups (`components/example-tabs.tsx`, `components/example-switcher.tsx`, `lib/example-map.mjs`, `lib/example-pages.mjs`, `lib/examples-entry.mjs`, `components/table-of-contents-list.tsx`), `lib/install.mjs`, `lib/dev-tsconfig.mjs`, `components/or-divider.tsx`, `components/mdx/copy-button.tsx`, `components/mdx/try-it.tsx`, `lib/utils.ts`.

## 3. Dependencies of the docs app

`docs/package.json`, name `docs`, private. Every package takes the table docs app's range (package.json of 2026-11-24, resolved version in brackets), as spec 85, 1.6.1 item 3 and 1.7 say, with one exception the plan names here as a departure from that wording: `react`, `react-dom`, `lucide-react` and `cn` take the date picker root's range. The three trees run on these four inside the docs app, the workspace has one lockfile, and `cn` cannot follow the table: `^0.4.0` and `^0.5.0` share no version, so the trees would run on a release the Storybook and the tests never ran. The exception is in the tracker's notes for the closer.

| Package | Range | From | Needed by |
|---|---|---|---|
| `next` | `16.3.8` | table | the app |
| `react`, `react-dom` | `19.3.1` | picker root (table: `^19.3.0`, resolved 19.3.1) | the app |
| `fumadocs-core` | `16.17.5` | table | lib/source.ts, search, page tree |
| `fumadocs-mdx` | `15.4.7` | table | lib/source.ts, next.config.mjs |
| `fumadocs-ui` | `npm:@fumadocs/base-ui@16.17.5` | table | layouts, tabs, code blocks |
| `next-themes` | `^0.4.6` (0.4.6) | table | theme-controls.tsx |
| `lucide-react` | `^1.64.0` | picker root (table: `^1.50.0`) | chrome and trees |
| `cn` | `^0.5.0` | picker root (table: `^0.4.0`) | lib/cn.ts, ui-radix parts, trees |
| `class-variance-authority` | `^0.7.1` | both | ui-radix parts, trees |
| `radix-ui` | `^1.8.1` | both | ui-radix parts, the radix tree |
| `cmdk` | `^1.1.1` | table | ui-radix/command.tsx |
| `@base-ui/react` | `^1.9.0` | both | the base tree |
| `react-aria-components` | `^1.22.1` | both | the aria tree |
| `react-day-picker` | `^10.0.2` | both | the three trees |
| `date-fns` | `^4.4.0` | both | the three trees |
| `tw-animate-css` | `^1.3.8` | both | app/global.css |
| dev: `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/node` | `^4.3.3` (4.3.3) | table | global.css, postcss, lib/build-styles.mjs |
| dev: `postcss` | `^8.5.28` | table | postcss.config.mjs |
| dev: `shadcn` | `^4.22.0` | both | `@import 'shadcn/tailwind.css'` |
| dev: `typescript` | `~5.8.3` | both | types:check |
| dev: `eslint`, `eslint-config-next` | `^9.39.4`, `16.3.8` | table | lint |
| dev: `@types/mdx`, `@types/node`, `@types/react`, `@types/react-dom` | `^2.0.14`, `^26.6.4`, `^19.3.0`, `^19.3.0` | table | types |
| dev: `prettier` | `^3.6.2` | table (its workspace root; the docs app there has none of its own) | lib/example-variants.mjs |

Packages of the table docs app the taken files no longer need: `@faker-js/faker`, the three `@fortawesome/*`, `@hugeicons/core-free-icons`, `@hugeicons/react`, `@phosphor-icons/react`, `@remixicon/react`, `@tabler/icons-react`, `@storybook/react`, `storybook`, `@tanstack/match-sorter-utils`, `@tanstack/react-hotkeys`, `@tanstack/react-query`, `@tanstack/react-store`, `@tanstack/react-table`, `@tanstack/react-virtual`, `export-to-csv`, `highlight-words`, `jspdf`, `jspdf-autotable`, `posthog-js`, `react-colorful`, `recharts`, `schema-dts`.

Scripts of `docs/package.json` (names fixed by spec 85, 1.6.2):

- `prebuild` chain inside `build`: `node lib/registry-trees.mjs && node lib/example-variants.mjs && node lib/build-styles.mjs --minify && next build`
- `predev`: the same three scripts without `--minify`; `dev`: `next dev -p ${PORT:-5340}`; `start`: `next start -p ${PORT:-5340}`
- `types:check`: `node lib/registry-trees.mjs && node lib/example-variants.mjs && next typegen && tsc --noEmit`
- `lint`: `eslint`

## 4. Styles

### 4.1 app/global.css, taken trimmed

- Stays: the five imports of lines 1 to 5, the tokens import of line 9, the `@source not inline` line 14, the shadcn block (`@custom-variant dark`, both `@theme` blocks, `:root`, `.dark`, `scrollbar-none`, `@layer base`), and every docs rule from "docs overrides" to the TOC thumb.
- Replaced: line 18, `@source '../../../packages/shadcn-table/stories'`, by `@source '../registry'` and `@source '../demos'`. The tree copies and the variants are git-ignored (section 5.2), and Tailwind skips "Files that are in your .gitignore file"; "If you need to scan any files that Tailwind is ignoring by default, you can explicitly register those sources" (https://tailwindcss.com/docs/detecting-classes-in-source-files).
- Leaves: the `#nd-page [data-slot='agent-bar'] button` selector (agent bar), the `.docs-playground[data-fullscreen]` rule (fullscreen), the `.docs-index*` rules (section overview list), the API table token block at the end (`--code-tok-*`, `.st-tok-*`: generated prop tables).

### 4.2 Fonts

- `lib/fonts.ts` as is (Archivo, `--font-archivo`) and the Inter loader in `app/layout.tsx` (`--font-inter`) stay. `lib/design-system/fonts.ts` (the customizer's 25 faces) is not taken.
- `--font-sans` reads `--font-inter` through the `@theme` block of global.css; `--font-display` and `--font-mono` come from the "landing look" block. Nothing to add.

### 4.3 Colours and the style sheet without the customizer

The table site paints its default look from a pre-paint script (`lib/design-system/config.ts:515`): it links `/styles/style-nova.css`, adds the class `style-nova` and the attributes `data-design-system`, `data-menu-color="default"`, `data-menu-accent="subtle"` to `<html>`, and writes the token rules of `buildThemeCss(DEFAULT_CONFIG)` under `:root[data-design-system]`. DEFAULT_CONFIG is style nova with the colour preset `default` (`lib/design-system/config.ts:284`, `lib/design-system/color-presets.ts:19`), whose primary differs from the neutral fallback in global.css. The docs site has one look, so the same result is static:

- `app/layout.tsx`: `<html>` carries `className` with `style-nova` and the three attributes; `<head>` carries `<link rel="stylesheet" href="/styles/style-nova.css">`; the designSystemScript line leaves.
- `app/theme.css` (new, imported by `app/layout.tsx` after `./global.css`): the text `buildThemeCss(DEFAULT_CONFIG)` returns, written once by the build milestone from the table repository at the commit above and never edited by hand. The command, run in `shadcn-react-table/apps/shadcn-table-docs` and read-only there: `JITI_ALIAS='{"@":"<that folder>"}' node_modules/.bin/jiti <file>`, where `<file>` is a two-line TypeScript file outside the repository that imports `buildThemeCss` and `DEFAULT_CONFIG` from `@/lib/design-system/config` and writes the result to stdout. `config.ts` imports only `shadcn/preset` and three files of `lib/design-system` (config.ts:4 to 16), so jiti with the `@` alias is enough; run in review round 1 it printed 68 lines, 2,610 bytes, starting `:root[data-design-system] {`. The tracker of the build records the commit and the byte count. It holds the light and dark tokens, `--radius`, `--font-sans`, `--font-heading`.
- `lib/build-styles.mjs` as is compiles `styles/style-nova.css` against `app/global.css` into `public/styles/style-nova.css` (git-ignored). It lists `styles/` itself, so one file gives one sheet.
- Dark stays the default theme, as on the table site (`app/layout.tsx:76`).

### 4.4 The CSS the picker needs

- Tokens: the demos use the docs site's tokens (4.3), not `picker:registry/<base>/index.css`. That file is the Storybook's own page look (its `:root` sets another primary, `--radius: 0` and IBM Plex) and stays the Storybook's. D178: the look is the table's.
- Utilities: the trees' classes are found through the `@source '../registry'` line of 4.1. `tw-animate-css` and `shadcn/tailwind.css` are already imported by global.css, the same two `picker:registry/base/index.css` imports (lines 2 and 3).
- The `cn-*` hook classes: the source trees carry three, one each in `components/date-picker/components/picker-popup.tsx` (`cn-dialog-close`), `components/picker-trigger.tsx` (`cn-button-group-orientation-horizontal`) and `modes/day-range-picker.tsx` (`cn-field`); the `components/ui` parts of the trees carry none. In the Storybook no rule matches them: `picker:.storybook/preview.tsx` imports `@/index.css` alone and `picker:registry/styles/` is git-ignored input of `tools/registry-build.mjs`. On the docs site `<html class="style-nova">` and the nova sheet of 4.3 give the three classes shadcn's nova rules, the values the installed copy carries after `transformStyle` (README, "Three places in the picker carry the classes of shadcn's nova style"). So a demo shows what a user gets after the install (goal of spec 85, 1.2), which is one step closer than the Storybook.
- No `ref={ref}` is added to a calendar part (D179); the trees are copies of `picker:registry/<base>`.

## 5. Demos and the base switcher

### 5.1 The base list and the switch

- `lib/bases.mjs` (new): states `BASES` (`'base'`, `'radix'`, `'aria'`, frozen), `DEFAULT_BASE` (`'base'`) and `BASE_LABELS` (`base: 'Base UI'`, `radix: 'Radix UI'`, `aria: 'React Aria'`, the names of `picker:tools/site-build.mjs:12`) as literals and imports nothing. It cannot re-export `picker:tools/bases.mjs`: that file imports `node:fs`, `node:path` and `node:url` and computes `ROOT` at module top level (`picker:tools/bases.mjs:3` to 10), and the list reaches the browser through `components/base-selector.tsx` (`'use client'`, which imports `@/lib/install` and `../lib/base-tabs.mjs`, base-selector.tsx:19 to 28). The table's list is browser-safe for the same reason: "No node imports, so Vite bundles it" (`shadcn-react-table/tools/registry/bases.mjs:7`). `lib/bases.d.mts` gives the `Base` type. `picker:tools/bases.mjs` does not change.
- The two lists are kept equal by the one Node script that may read both: `lib/registry-trees.mjs` (5.2) imports `BASES` and `DEFAULT_BASE` from `picker:tools/bases.mjs` and from `./bases.mjs` and exits non-zero with both lists in the message when they differ. It runs first in `build`, `predev` and `types:check` (section 3), so a base added to the repository cannot be missed by the docs.
- `lib/base-tabs.mjs`, `lib/example-variant-dir.mjs`: the path of the base list only, on every line that carries it (rows 87 and 102).
- `lib/install.ts`, taken trimmed. Stays: `packageManagers`, `PackageManager`, `runners`, `bases`, `Base`, `defaultBase`, `baseLabels`, `isBase`, `perBase`. Replaced: the import of the base list (`./bases.mjs`); `addCommand(base: Base, pm: PackageManager): string`, which returns `<runner> add anindosarker/shadcn-date-picker/date-picker-<base>#v<version>` (the form of the README's Install section). The version is read in `lib/install.ts` itself, `import pkg from '../../package.json'` (the repository root, the same file `lib/layout.shared.tsx` and `app/version.txt/route.ts` read), not from `LIBRARY_VERSION`: `lib/layout.shared.tsx` imports `Logo` and `ThemeControls`, and `lib/install.ts` stays pure (install.ts:1 to 3). A JSON import already reaches client code this way on the table site (`components/dev-home/v12/nav.tsx:10`, `'use client'`, through `lib/layout.shared.tsx:5`); `libraryAddCommand(base, pm)` stays as its alias for the home block. Leaves: `itemUrl`, `localeAddCommand`, `exampleAddCommand`, `initCommand`, the icon library block, the namespace block, `installDir`, `agentPrompt`, `skillInstallCommand`.
- `components/base-selector.tsx` carries the switch: `useBase`, `setBase`, `BaseSwitch` (the header and playground select), `BaseTabs` (the install block). Storage and tab group as on the table site.
- `components/site-nav.tsx` renders `BaseSwitch` in the header; `components/dev-home/v12/nav.tsx` renders it on the home page and the 404 page (`baseSwitch` prop, set on both). The table's home leaves the prop off (`components/dev-home/v12/nav.tsx:23` to 25) because its base choice sits in the agent bar (`components/agent-bar.tsx:154`, "Choose base"); the agent bar is not taken, so without the prop the home page's two demos and its install line could not change base. WAITING (A3), default the prop set on the home page.

### 5.2 One tree copy and one variant per base

In the docs app `@/` is `docs/`, and the files of a tree import each other through `@/components/ui/...` and `@/hooks/use-mobile` (30 and 1 import lines on base and radix, 31 and 1 on aria). So each tree is copied into the app with those imports pointed at the copy, the way the table docs install one library copy per base.

- `lib/registry-trees.mjs` (new). For each base: copies `picker:registry/<base>/components/**` and `picker:registry/<base>/hooks/**` to `docs/registry/<base>/components/**` and `docs/registry/<base>/hooks/**` (git-ignored), with `rewriteImports` applied. Stale files are removed. It never writes under `picker:registry/`.
- `lib/example-variants.mjs`, taken trimmed. Stays: `rewriteImports(source, base)`, `toVariant`, the prettier formatting, the removal of stale output, the console line. Replaced: the source is the flat folder `demos/` (one hand-written `<name>.tsx` per demo, the same file for every base), the output is `demos/.<base>/<name>.tsx`; the pattern of `rewriteImports` is `@/components/` and `@/hooks/` to `@/registry/<base>/components/` and `@/registry/<base>/hooks/`; one `demos/sources.json` (`{ [name]: ExampleFile[] }`, the hand-written text with the `'use client'` line stripped) in place of one per base. Leaves: `listSlugs` and the per-base source folders. `main` creates `demos/` when it is missing, so the generator also runs before the first demo is written (build task 1).
- `lib/registry-trees.mjs` imports `rewriteImports` from `lib/example-variants.mjs`, so a tree file and a demo are rewritten by the same pattern. For that import to be free of side effects, one more line of `lib/example-variants.mjs` is replaced: the last one, `await main()` (example-variants.mjs:118), runs only when the file is the script Node was started with (`process.argv[1]` equal to the file's own path; `fileURLToPath` is already imported at line 25). Imported, the file writes nothing; run as `node lib/example-variants.mjs` it works as before.
- `.prettierrc` (new, in `docs/`): the four keys of `shadcn-react-table/.prettierrc` (`printWidth: 80`, `semi: true`, `singleQuote: true`, `trailingComma: 'all'`). `toVariant` formats with `prettier.resolveConfig(fileName)` (example-variants.mjs:57), which takes the nearest config file; without this one it would take the root's, with the Tailwind plugin and a stylesheet path of the root package. The hand-written demos follow it too, and they must: `stripDirective` of the as-is `lib/example-files.mjs` (line 19) removes only the line `'use client';` in that exact form.
- Which tree each base's variant points at: `base` to `docs/registry/base` (copy of `picker:registry/base/components/**` and `hooks/**`), `radix` to `docs/registry/radix`, `aria` to `docs/registry/aria`. Never `picker:registry/<base>/generated`.

### 5.3 Loading the variant of the selected base

`components/example-variant.tsx`, taken trimmed: the loaders become `import(\`@/demos/.radix/${name}\`)`, `.base` and `.aria`. `ExampleVariant({ name })` is unchanged: nothing on the server, the chunk of the selected base after hydration, `ExampleTableSkeleton` while it loads.

### 5.4 The code view shows the hand-written file

- `lib/example-source.ts`, taken trimmed: `readExampleFiles(name: string): Promise<ExampleFile[]>` reads `demos/sources.json` (one literal path). Leaves: the per-base map and the `base` parameter.
- `components/mdx/example-snippet.tsx`, taken trimmed: `ExampleSnippet({ name })` builds one `ExampleVariantData` (`files`, `githubUrl`) and passes it for the three bases, so the code view shows `demos/<name>.tsx` whatever the base. `githubUrl` is `https://github.com/anindosarker/shadcn-date-picker/blob/main/docs/demos/<name>.tsx`. Leaves: `buildExamplePrompt`, `exampleAddCommand`, `installCommand`, `prompt`.
- A demo imports `@/components/date-picker/date-picker` (and `@/components/date-picker/types` for `RangeValue`), the path a user has after the install, and nothing from `registry/`.

## 6. Routes and content

### 6.1 The ten pages

Text sources: R is `picker:README.md`, I is `picker:stories/Introduction.mdx`, J is the JSDoc of `DatePicker` (`picker:registry/base/components/date-picker/date-picker.tsx:14`), T is `picker:registry/base/components/date-picker/types.ts`.

| # | Address | Title | Sidebar group, place | File | Source of the text |
|---|---|---|---|---|---|
| 1 | `/` | shadcn-date-picker | none (home) | `app/(home)/page.tsx` | R first paragraph, I first paragraph |
| 2 | `/docs/install` | Install | Get started, 1 | `content/docs/install.mdx` | R "Install", "Usage", "What it does not do", "Differences between the bases" with the Base UI note (D179) |
| 3 | `/docs/date` | Date | Pickers, 1 | `content/docs/date.mdx` | I "One example per type", J |
| 4 | `/docs/date-time` | Date and time | Pickers, 2 | `content/docs/date-time.mdx` | I, the `step` row of I's props table |
| 5 | `/docs/time` | Time | Pickers, 3 | `content/docs/time.mdx` | I, the `step` and `presets` rows |
| 6 | `/docs/week` | Week | Pickers, 4 | `content/docs/week.mdx` | I |
| 7 | `/docs/month` | Month | Pickers, 5 | `content/docs/month.mdx` | I, J example line 2 |
| 8 | `/docs/year` | Year | Pickers, 6 | `content/docs/year.mdx` | I |
| 9 | `/docs/ranges` | Ranges | Pickers, 7 | `content/docs/ranges.mdx` | I "Add `range` to any of them", R "Usage" |
| 10 | `/docs/props` | Props | Reference, 1 | `content/docs/props.mdx` | I "Props" table, checked row by row against T |

- `/docs` goes to `/docs/install` by the one redirect kept in `next.config.mjs` (the table's own rule for `/docs`, next.config.mjs:114 to 118), permanent as there; only the destination changes. The "not permanent" of spec 85, 1.6.4 is for the three old Storybook addresses (7.2).
- `content/docs/meta.json`: `"pages": ["---Get started---", "install", "---Pickers---", "date", "date-time", "time", "week", "month", "year", "ranges", "---Reference---", "props"]`. No folder, so the sidebar lists the nine pages at once under three labels (`components/sidebar-separator.tsx`). WAITING (A2), default this flat list.
- Two parts of the shell show nothing with a flat list, by their own code and not by a fault of the build: the page eyebrow (`// section` above the title), because `findSectionName` returns the name of a top-level folder only (lib/page-tree-utils.ts:230 to 238, read at app/docs/[[...slug]]/page.tsx:32 and 73); and the page switcher in the breadcrumb, because it renders only when `section?.type === 'folder'` (components/docs-breadcrumb.tsx:48 to 51). On the table site the sidebar also shows one section at a time, because each section is a root folder (`content/docs/getting-started/meta.json`, `"root": true`; lib/source.ts:48).
- The other way, for A2: fumadocs keeps flat addresses with folders, "You can wrap the folder name in parentheses to avoid impacting the slugs of child files" (https://fumadocs.dev/docs/page-conventions, Folder Group; `GroupRegex` in fumadocs-core 16.17.5, dist/source/plugins/slugs.js:60). Three such folders with `"root": true` would give the table's behaviour (one section in the sidebar, the eyebrow, the page switcher) at the same ten addresses, with two sections of one page each. The plan does not take it without the owner.
- The type pages and the ranges page set `full: true` in the frontmatter, as the table's example pages render full width.
- The install page: `<InstallCommand />` (tabs per base, tabs per package manager), then the import line, the list of parts the CLI adds, the three nova places, and the differences list.
- The props page: one MDX table. Rows: `type`, `range`, `value`, `onChange`, `min`, `max`, `step`, `presets`, `labels`, `disabled`, `presentation`, `popoverProps`, `dialogProps`, `calendarProps`, and the paragraph on the other attributes. No generated table.

### 6.2 Section tabs (three)

`NAV_LINKS` in `lib/layout.shared.tsx`: `{ text, url, pages }`.

| Tab | Address | Active on |
|---|---|---|
| Get Started | `/docs/install` | `/docs/install` |
| Pickers | `/docs/date` | the six type pages and `/docs/ranges` |
| Props | `/docs/props` | `/docs/props` |

`components/section-tabs.tsx`: `isActive(link: (typeof NAV_LINKS)[number], pathname: string): boolean` is true when `pathname` is one of `link.pages`; its one call passes the link (row 65). The table's rule (first three path segments) cannot mark "Pickers" on `/docs/time`, because the addresses of spec 85 are flat. `components/not-found-page.tsx` and `components/dev-home/v12/nav.tsx` read the same three links.

### 6.3 Demos

One file per row in `docs/demos/`, a client component, controlled, the value printed under the picker in an `<output>` as `picker:stories/support/controlled.tsx` prints it (`JSON.stringify(value)`); the calls counter of the stories is not shown.

| Demo file | Page | Props of DatePicker | Start value | Story it follows |
|---|---|---|---|---|
| `date.tsx` | `/docs/date`, home | `type="date"` | `"2026-11-21"` | Types/Date, Single (`stories/Date.stories.tsx:35`) |
| `date-time.tsx` | `/docs/date-time` | `type="datetime"` | `"2026-11-21T10:30"` | Types/DateTime, Single (`stories/DateTime.stories.tsx:34`) |
| `time.tsx` | `/docs/time` | `type="time"` | `"10:30"` | Types/Time, Single (`stories/Time.stories.tsx:34`) |
| `week.tsx` | `/docs/week` | `type="week"` | `"2026-W47"` | Types/Week, Single (`stories/Week.stories.tsx:29`) |
| `month.tsx` | `/docs/month` | `type="month"` | `"2026-11"` | Types/Month, Single (`stories/Month.stories.tsx:33`) |
| `year.tsx` | `/docs/year` | `type="year"` | `"2026"` | Types/Year, Single (`stories/Year.stories.tsx:28`) |
| `date-range.tsx` | `/docs/ranges`, home | `type="date" range` | `["2026-11-03", "2026-11-12"]` | Types/Date, Range (`stories/Date.stories.tsx:149`) |

- Each page renders its demo with `<ExampleSnippet name="..." />`. The props that matter for the type are a short table under the demo, the rows below and no other, each with the words of I's props table and checked against T (the type named in brackets):

| Page | Rows of the table under the demo |
|---|---|
| `/docs/date` | `min`, `max`; `presets`; `presentation` with `popoverProps` and `dialogProps`; `calendarProps` (`DateProps`: `step` is `never`) |
| `/docs/date-time` | `step`; `min`, `max`; `presets`; `presentation` with `popoverProps` and `dialogProps`; `calendarProps` (`DateTimeProps`) |
| `/docs/time` | `step`; `min`, `max`; `popoverProps`. One sentence: no `presets`, no `presentation`, no `dialogProps`, no `calendarProps` (`TimeProps`: `presets?: never`, no `PresentationProps`) |
| `/docs/week` | `min`, `max`; `presets`; `presentation` with `popoverProps` and `dialogProps`; `calendarProps` without `showWeekNumber` and `ISOWeek` (`WeekProps`) |
| `/docs/month`, `/docs/year` | `min`, `max`; `presets`; `presentation` with `popoverProps` and `dialogProps`; `calendarProps` with `locale`, `startMonth` and `endMonth` only (`MonthYearProps`) |
| `/docs/ranges` | `range`; `value` as `[from, to]`, an empty end is `""`; `onChange` with the pair; `presets` whose `value` is a pair (`Two`, `RangeValue`). One sentence: a time range takes the popover's content props only, not its open state (`TimeProps`, `Two & { popoverProps?: PopoverContentProps }`) |

- No demo for a prop combination the stories do not have. The Options stories (limits, presets, labels, dialog) stay in the Storybook; the pages link there with `<StorybookLink />`.
- `components/example-playground.tsx`: the preview slot wraps its children in `<div className="w-fit max-w-full">`, so the demo picker is as wide as its content, as on the home page, not the full width of the panel (the input group's own `w-full`).

### 6.4 Home

`components/dev-home/v12/home-page.tsx` trimmed to the hero: the eyebrow line ("// A date picker for shadcn/ui"), the h1 `shadcn-date-picker`, one paragraph from R's first paragraph, the install block (`components/dev-home/shared/install-command.tsx`, the command of the selected base, with the class `v12-install`), the two live demos (`<ExampleVariant name="date" />`, `<ExampleVariant name="date-range" />`, no code panel), and the call to action row: "Get started" to `/docs/install`, "Storybook" to `/storybook/` (a plain `<a>`, as `StorybookLink`: the docs app does not own that path, so no router link or prefetch). No tiles, no theme demo; the short footer (D181).

- Where the new parts sit: all inside the `v4-shell v12-hero-copy` block, in the place of AgentBar (home-page.tsx:49 to 53), before the `v12-cta` row. The install block first; then one `<div className="v12-hero-row">` holding the two demos. Both classes are in the as-is `components/dev-home/v12/v12.css`: `.v12 .v12-install` (line 227, as wide as its command) and `.v12-hero-row` (line 218: a centred flex row that wraps, with its own gap), so the two pickers sit side by side where there is room and one under the other where there is not, with no width or breakpoint of the plan's own.
- The h1: `shadcn`, a dash, `date`, a dash, `picker`, each dash in a `v7-wordmark-dash` span as the table's one dash is (home-page.tsx:40).
- `components/dev-home/v12/nav.tsx`: the version link takes `max-sm:hidden`, so below `sm` the name does not run over it (at 390 wide); the base select stays (D181).
- Footer (D181): `components/dev-home/v12/footer.tsx`, the table's footer trimmed to the wordmark, the licence line "MIT licensed. Built on shadcn/ui.", GitHub and Storybook; no Dune, so the footer takes a dashed top rule (`border-t border-dashed border-(--v12-dash)`). The home page and the 404 page render it last. The base select in the home header stays (D181).

### 6.5 Header

`components/site-nav.tsx`: the `//` mark and `shadcn-date-picker`, `v<version>` linking to `https://github.com/anindosarker/shadcn-date-picker/releases` (`LIBRARY_VERSION` from `picker:package.json`, read in `lib/layout.shared.tsx`), search, the GitHub icon, `BaseSwitch`, the light and dark toggle, the sidebar trigger on a phone, then the section tabs row. `/version.txt` is `app/version.txt/route.ts` on the same `package.json`.

## 7. Storybook under /storybook/ and Vercel

Status: proven on the preview of the throwaway branch, review round 1 (7.4). The preview address is behind the Vercel login, so the answers were read in a browser logged in to Vercel, not with `curl`; 7.4 says what that does and does not show. The branch, its worktree and the preview deployment are deleted.

### 7.1 What Vercel documents

- Two builds in one project are services: "Services let you deploy multiple backends and frontends within a single Vercel project" and "A service is internal by default and will not be routable from the Internet unless you expose it. To route a service publicly, include a top-level rewrite rule that targets the service as `destination`" (https://vercel.com/docs/services). The table repository's `vercel.json` already runs its docs and Storybook this way.
- Order and prefix: "Vercel evaluates your top-level rewrites in order and routes each request to the first matching service" and "The service receives the original request path. `GET /api/users` reaches `my_backend` as `/api/users`, not `/users`" (https://vercel.com/docs/services/routing). So the static files must lie under a `storybook/` folder of the output.
- No fallback: "Routing into a service is final. If no route matches inside the service, Vercel does not fall back to your other top-level rewrites" (same page). A missing file under `/storybook/` gets the static service's 404, not the docs app's.
- Build keys: with `services` present, "`functions`, `installCommand`, `buildCommand`, `devCommand`, `ignoreCommand`, `outputDirectory` and `framework` keys should be moved into the relevant service" (https://vercel.com/docs/services). The service object takes `root` ("Required. The path to the service root, relative to `vercel.json`"), `framework`, `buildCommand`, `outputDirectory`, `trailingSlash` (https://vercel.com/docs/services/config-reference).
- Redirect status: `permanent` is "An optional boolean to toggle between permanent and temporary redirect"; "When `false` the status code is 307" (https://vercel.com/docs/project-configuration/vercel-json, redirects). "`redirects` are always processed before `rewrites`" (same page).
- Slash: "When `trailingSlash: true`, visiting a path that does not end with a forward slash will respond with a 308 status code and redirect to the path with a trailing slash" (same page, trailingSlash).

### 7.2 The vercel.json (as pushed on the proof branch)

- `services.docs`: `root: "docs"`, `framework: "nextjs"`.
- `services.storybook`: `root: "."`, `framework: "storybook"`, `buildCommand: "pnpm storybook:build"`, `outputDirectory: "storybook-static"`, `trailingSlash: true`.
- `redirects`, both `permanent: false`: `/:base(base|radix|aria)` to `/storybook/:base/`; `/:base(base|radix|aria)/:path*` to `/storybook/:base/:path*`.
- `rewrites`, in this order: `/storybook` to the storybook service; `/storybook/(.*)` to the storybook service; `/(.*)` to the docs service.
- The top-level `framework`, `installCommand`, `buildCommand` and `outputDirectory` of today's file leave (7.1). The Vercel project's own settings are empty for all four (read with `vercel api /v9/projects/shadcn-date-picker`: framework, rootDirectory, buildCommand, outputDirectory, installCommand all null), so no project setting changes.

### 7.3 What tools/site-build.mjs must change

- Each Storybook is built to `storybook-static/storybook/<base>/` (today `storybook-static/<base>/`, line 16), because the service sees the whole path (7.1).
- The list page is written to `storybook-static/storybook/index.html` (today the output root, line 34). Its links stay `./<base>/` (line 28): relative, so they hold under the prefix once `/storybook` has its slash (7.1, trailingSlash). Its text and look do not change.
- `version.txt` is no longer written (line 58): the docs app answers `/version.txt`.
- A Storybook build uses relative asset addresses; it is already served from a sub-path today (`/base/`, `/radix/`, `/aria/` on the live site), so the files need no change for `/storybook/<base>/`.
- `picker:README.md` and `stories/Introduction.mdx` are not touched by this.

### 7.4 Proof lines

Branch `date-picker-docs-vercel-proof` (commits `b438583`, `8f41b47`): the `vercel.json` of 7.2, a one-page Next.js app in `docs/` with `app/version.txt/route.ts`, and a `tools/site-build.mjs` that writes `storybook-static/storybook/index.html` and `storybook-static/storybook/base/index.html`.

- Build: Vercel deployment `dpl_2SHMqgtpbRws56SEZXF5obXb7M3w`, state READY, both services built in one deployment (log: "Detected Next.js version: 16.3.8", "> next build", then "> shadcn-date-picker@0.0.0-proof storybook:build", "Build Completed in /vercel/output"). The first push failed on the lockfile only (`ERR_PNPM_OUTDATED_LOCKFILE`), fixed by the second commit.
- Read: every path of `https://shadcn-date-picker-7bs28yd3z-anindo-sarkers-projects.vercel.app` answers `HTTP 302` to `https://vercel.com/sso-api?...` (project setting `ssoProtection: all_except_custom_domains`, no protection bypass secret on the project). `vercel curl` would create such a secret, which is a Vercel setting change, so it was not run.
- How the lines below were read (2026-11-24, review round 1): in the owner's Chrome, which is logged in to Vercel, one background tab per address, opened and read through AppleScript: the address the tab ended at, its title, and the saved HTML of the page. No Vercel or GitHub setting was changed and `vercel curl` was not run. A browser shows where a request ends and what answers there; it does not show the status of each hop, so the 307 of the two redirects and the 308 of the slash rest on Vercel's words in 7.1, and the lines are not `curl -sI` lines.
- `GET /` : ends at `/`, body `one-page app (docs service)`. The docs service answers the root.
- `GET /storybook/` : ends at `/storybook/`, title `proof`, body `storybook list (static file)`. The static file of the storybook service answers.
- `GET /base/x` : ends at `/storybook/base/x/`, title `404: NOT_FOUND` (Vercel's own page: the proof holds no such file). The redirect of 7.2 fired, then the storybook service added its slash and answered; the docs app did not.
- `GET /storybook` : ends at `/storybook/`, the same static page.
- `GET /storybook/base/` : ends there, body `storybook base (static file)`.
- `GET /base/` and `GET /base` : both end at `/storybook/base/`, body `storybook base (static file)`.
- `GET /radix/iframe.html` : ends at `/storybook/radix/iframe.html`, no slash added to a file name (`404: NOT_FOUND`, no such file in the proof).
- `GET /aria/a/b?q=1` : ends at `/storybook/aria/a/b/?q=1`: the query string is kept.
- `GET /version.txt` : ends there, body `0.0.0-proof`, the version of the proof's `package.json`, from the docs service.
- `GET /storybook/nope` : ends at `/storybook/nope/`, title `404: NOT_FOUND`: the static service's 404, no fallback to the docs app (7.1).
- `GET /nope` and `GET /docs/x` : end there, title `404: This page could not be found.`: the docs app's 404.
- For the build: a Storybook address without a file name gets a slash at its end (`/storybook/base/x/`); Storybook's own addresses are `/storybook/<base>/` and `/storybook/<base>/iframe.html`, both read above.
- After: `git push origin --delete date-picker-docs-vercel-proof`, the local branch and the worktree removed; `git ls-remote --heads origin` prints `main` alone; `git -C shadcn-date-picker status --short` prints nothing. The preview is deleted too (review round 2): `vercel rm dpl_2SHMqgtpbRws56SEZXF5obXb7M3w --yes` printed "Success! Removed 1 deployment"; `vercel inspect` of the id then answers "Can't find the deployment" and the preview address answers 404 `DEPLOYMENT_NOT_FOUND`. Removing a deployment is not a project setting.

## 8. Checks the build milestone runs

As spec 85, 1.6.6, with the page list of 6.1.

Local, on `pnpm --filter docs build` then `next start` on a port from 5340 to 5360, stopped by pid after; a browser at 1440 and 390 wide, light and dark:

- Each of `/`, `/docs/install`, `/docs/date`, `/docs/date-time`, `/docs/time`, `/docs/week`, `/docs/month`, `/docs/year`, `/docs/ranges`, `/docs/props` answers 200; the nine docs pages show the header, the three tabs with the right one marked (6.2) and the sidebar with the three labels; `/` shows the home header. One tracker line per page and width: 20 lines.
- `/docs` ends at `/docs/install`.
- `/` (both demos) and the seven demo pages: the picker shows, the popup or dialog opens on a click, a value is picked, the printed value changes.
- `/docs/date` and `/docs/ranges` with the header switch on Base UI, Radix UI and React Aria: a working picker each time. Six lines.
- The code view of each demo page shows the text of `docs/demos/<name>.tsx` (with `@/components/date-picker/date-picker`, never `@/registry/`), the same on the three bases.
- No error in the console; nothing runs past the right edge at 390.
- `/version.txt` prints the version of `picker:package.json`; the header shows the same after the name.
- Files: each `taken as is` row of 1.1 and 1.2 has an empty `diff` against the table file at commit `38e51f9`; each `taken trimmed` row differs by its listed deletions and replacements only; `git diff --stat origin/main -- registry stories .storybook tools/bases.mjs tools/registry-build.mjs` prints nothing; `grep -rn "posthog\|discord\|agent-bar\|json-ld" docs --include=*.ts --include=*.tsx` prints nothing.
- Root checks with `docs/` in place (1.4): `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` and `pnpm test` exit 0; `git diff origin/main -- eslint.config.mjs .prettierignore` shows the two entries of 1.4 and no other line.
- The canonical link of `/docs/date` in the built HTML is `https://date-picker.shadcn-table.com/docs/date` (row 122).
- A copy of `lib/bases.mjs` with one base removed makes `node lib/registry-trees.mjs` exit non-zero (5.1); `node -e "import('./lib/example-variants.mjs')"` in `docs/` writes no file (5.2).
- Captures: `https://www.shadcn-table.com/`, `/docs/getting-started/install` and `/docs/examples/basic` beside `/`, `/docs/install` and `/docs/date` of the new site, 1440 and 390, light and dark, under `reference/q149-calendar-library/docs-site/`; every difference named in the tracker with its reason (a control this site does not have, or content).

The preview of the build branch: its address is behind the same Vercel login as the proof's (7.4, `ssoProtection`), so the four lines spec 85 asks of it (`/`, `/docs/date`, `/storybook/base/`, `/version.txt`) are read in the logged-in browser as in 7.4, the end address and the body of each, not with `curl -sI`; the status codes are read on production after the merge (Live, below).

Storybook build: `pnpm storybook:build` leaves `storybook-static/storybook/index.html` and `storybook-static/storybook/{base,radix,aria}/index.html`, and no `version.txt`.

Live, after the merge, on `https://date-picker.shadcn-table.com`: `/` and the nine docs pages answer 200; `/version.txt` prints the version; `/storybook/` lists three bases; `/storybook/base/`, `/storybook/radix/` and `/storybook/aria/` open the Date story; `/base/` ends at `/storybook/base/`; on `/docs/date` one picker is opened and a day picked. One tracker line per read, the browser closed after.

Live, the hop statuses the proof could not show (7.4), read with `curl -sI`, as the custom domain has no login wall: `curl -sI https://date-picker.shadcn-table.com/base/x` answers 307 with `location: /storybook/base/x`; `curl -sI https://date-picker.shadcn-table.com/storybook` answers 308 with `location: /storybook/`; `curl -sI` of `/`, `/docs/date`, `/storybook/base/` and `/version.txt` answers 200 each.
