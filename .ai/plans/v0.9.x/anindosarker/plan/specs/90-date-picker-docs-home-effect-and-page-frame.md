# 90: Date picker docs home effect and page frame
- Epic: E31

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`https://date-picker.shadcn-table.com/` was built by spec 85 from the table docs shell with parts left out, and spec 86 put the theme changer back. The owner compared the live site with the table site: "the home page effect doesn't match", "I think the layout is also missing then." D186 puts the table home page's star field and dune back on the home page and in the footer. D187 gives the docs pages the table's page frame: the sidebar by section, with the page switcher and the section line that come with it, Copy page, and a Changelog link. Nothing else of spec 85's not-taken list comes back.

One spec and one milestone, by choice: the two decisions own different files, but each alone would pay its own production build, capture round, merge and live read on the same small app.

Paths without a prefix are in the docs app of the date picker repository as spec 89 leaves it: `shadcn-date-picker/apps/shadcn-date-picker-docs/` (clone `shadcn-date-picker/` beside the table repository; `docs/` before spec 89). `table:` paths are in `shadcn-react-table/apps/shadcn-table-docs` at the tag `v0.9.8` (`a594a8a4`), the table site as it is live; read-only here.

### 1.2 Goals

- The home page draws the table's star field behind the page and the table's dune behind the hero; the footer of the home page and of the 404 page draws the table's dune (D186).
- The dune takes the chosen theme's accent and follows a theme or mode change without a reload, as on the table site (D186).
- The sidebar of a docs page lists one section at a time, the section of the open page: Get Started, Pickers or Props (D187).
- The breadcrumb's page switcher and the `// section` line above the page title show on every docs page (D187).
- Every docs page carries Copy page and the page options menu, as on the table site; the page's text answers at its own address (D187).
- The sidebar carries a Changelog link that opens `https://github.com/anindosarker/shadcn-date-picker/releases` (D187).
- The ten addresses of spec 85, the three section tabs, the page content and the Discord icon's absence do not change (D187).
- Acceptance: the table site as captured in a fresh browser profile, `reference/q149-calendar-library/docs-site/q179/table-home-dark-1440-fresh.png` and `table-home-light-1440.png` for the home effect, `reference/q149-calendar-library/docs-site/q180/table-docs-dark-1440.png`, `table-docs-dark-390.png` and `table-home-dark-390.png` for the page frame; after captures of the new build at the same widths and modes set beside them and looked at, the tracker names every difference and why. Programmatic: the checks of 1.6.5.

### 1.3 Current structure

```
shadcn-date-picker/apps/shadcn-date-picker-docs/ (after spec 89; origin/main 5404817 before it, under docs/)
├── components/dev-home/v12/home-page.tsx ← Nav, the hero copy, two demo pickers, Footer; no Starfield, no Dune (spec 85 plan row 162)
├── components/dev-home/v12/footer.tsx    ← wordmark, licence line, GitHub, Storybook; no Dune; root class has two border classes added (row 163, D181)
├── components/dev-home/v4/                ← font.ts, nav.tsx, v4.css; no starfield.tsx, no field.ts
├── components/dev-home/v{4,5,7,12}/*.css  ← equal to the table's: .v4-stars, .v4-star, .v12-field, .v4-footer-dune are present
├── components/not-found-page.tsx          ← renders Footer (55)
├── components/docs-breadcrumb.tsx         ← equal to the table's; the switcher shows only under a folder (48-51)
├── content/docs/meta.json                 ← one flat list under three separators (D180)
├── content/docs/*.mdx                     ← nine pages
├── app/docs/[[...slug]]/page.tsx          ← the table's less Copy page, the options menu, JSON-LD and the image line
├── lib/shared.ts                          ← no docsContentRoute, no getPageMarkdownUrl
├── lib/source.ts                          ← no llms, no includeProcessedMarkdown, no docsLlms
└── app/global.css                         ← the three .st-page-actions rules are present

table: (read-only)
├── components/dev-home/v12/home-page.tsx  ← <Starfield /> (28), <Dune className="v12-field" fps={9} /> (33)
├── components/dev-home/v12/footer.tsx     ← <Dune fps={6} className="v4-footer-dune" /> (57), root class v4-footer (56)
├── components/dev-home/v4/starfield.tsx (46), v4/field.ts (130), v12/dune.tsx (195; imports @/lib/cn and v4/field only)
├── content/docs/meta.json                 ← section folders, then external:[Changelog](...) (8)
├── content/docs/getting-started/meta.json ← "root": true
├── app/docs/[[...slug]]/page.tsx          ← the st-page-actions group with MarkdownCopyButton and ViewOptionsPopover (55-71), markdownUrl (31)
├── lib/shared.ts                          ← docsContentRoute (14), getContentUrl and getPageMarkdownUrl (31-37)
├── lib/source.ts                          ← llms import (1), toPlainMarkdown import (4), postprocess (31-33), docsLlms (201-205)
├── lib/llms.ts (227)                      ← toPlainMarkdown (114), renderLlmsIndex (208)
└── app/llms.mdx/docs/[[...slug]]/route.ts (28)
```

### 1.4 Target structure

```
shadcn-date-picker/apps/shadcn-date-picker-docs/
├── components/dev-home/v4/starfield.tsx   ← new: the table's, as is
├── components/dev-home/v4/field.ts        ← new: the table's, as is
├── components/dev-home/v12/dune.tsx       ← new: the table's, as is
├── components/dev-home/v12/home-page.tsx  ← refactor: the table's Starfield and Dune lines and their two imports
├── components/dev-home/v12/footer.tsx     ← refactor: the table's Dune line and import; root class as the table's
├── content/docs/meta.json                 ← refactor: the three section folders, then the Changelog link
├── content/docs/(get-started)/            ← new folder: meta.json, install.mdx (moved)
├── content/docs/(pickers)/                ← new folder: meta.json, the seven picker pages (moved)
├── content/docs/(reference)/              ← new folder: meta.json, props.mdx (moved)
├── app/docs/[[...slug]]/page.tsx          ← refactor: the table's page actions group and markdownUrl
├── lib/shared.ts                          ← refactor: docsContentRoute, getContentUrl, getPageMarkdownUrl
├── lib/source.ts                          ← refactor: the table's four llms places
├── lib/llms.ts                            ← new: the table's, as is
└── app/llms.mdx/docs/[[...slug]]/route.ts ← new: the table's, as is
```

### 1.5 Flow

```
branch date-picker-docs-home-effect-and-page-frame from origin/main (after spec 89's two milestones have merged)
     ──> home effect files and lines ──> content folders ──> Copy page ──> local production build read and captures
     ──> merge into main ──> Vercel production ──> live reads
```

### 1.6 Components

#### 1.6.1 The home effect (D186)

- `components/dev-home/v4/starfield.tsx`, `components/dev-home/v4/field.ts` and `components/dev-home/v12/dune.tsx` are the table's files, byte for byte, under the table's names. Their imports resolve in the docs app as it is (`@/lib/cn`, `@/components/dev-home/v4/field`); one that does not is a queue card with the file and the line, never a rewrite of the taken file.
- `components/dev-home/v12/home-page.tsx` takes the table's lines and nothing else: the `Starfield` and `Dune` imports, `<Starfield />` as the first child of the root div (`table:` 28), `<Dune className="v12-field" fps={9} />` as the first child of the hero section (`table:` 33). The hero copy, the install command, the two demo pickers, the call to action row and `<Nav baseSwitch />` stay as built.
- `components/dev-home/v12/footer.tsx` takes the `Dune` import and `<Dune fps={6} className="v4-footer-dune" />` as the first child of `<footer>` (`table:` 57). The root class becomes the table's `v4-footer` (`table:` 56): the two border classes spec 85 added stood in for the missing dune. The wordmark, the licence line and the two links stay (D181). The footer is one component, so the 404 page gets the dune with it.
- The four style sheets are equal to the table's already; no CSS is written. A rule the effect needs and the app lacks is taken from the table's file as it is, one tracker line each.
- The dune reads `--dh-accent` and re-reads it when the design system is applied or the mode changes (`table:components/dev-home/v12/dune.tsx:28`); the provider of spec 86 is the table's, so no wiring is added. Under reduced motion it is static, as on the table site.
- Not taken: the agent bar, the live demo, the theming demo, the feature tiles, the code strip (`table:components/dev-home/v12/home-page.tsx`, the rest of the file). Few code comments: none added.

#### 1.6.2 The sidebar by section (D187)

- The nine pages move into three folder groups, names in parentheses so the addresses do not change (fumadocs Folder Group, https://fumadocs.dev/docs/page-conventions; `GroupRegex`, fumadocs-core 16.17.5 `dist/source/plugins/slugs.js:60`):

  | Folder | `meta.json` | Pages, in order |
  |---|---|---|
  | `content/docs/(get-started)/` | `"title": "Get Started"`, `"root": true`, `"defaultOpen": true` | `install` |
  | `content/docs/(pickers)/` | `"title": "Pickers"`, `"root": true`, `"defaultOpen": true` | `date`, `date-time`, `time`, `week`, `month`, `year`, `ranges` |
  | `content/docs/(reference)/` | `"title": "Props"`, `"root": true`, `"defaultOpen": true` | `props` |

- The titles are the three tab names of `lib/layout.shared.tsx` (`NAV_LINKS`), so the `// section` line and the tab agree. The keys of each `meta.json` are those of `table:content/docs/getting-started/meta.json`.
- `content/docs/meta.json` becomes `"pages": ["(get-started)", "(pickers)", "(reference)", "external:[Changelog](https://github.com/anindosarker/shadcn-date-picker/releases)"]`, the shape of `table:content/docs/meta.json`. The three `---label---` separators leave.
- Proven before anything else changes: after the move, the build lists the same nine `/docs/<page>` addresses as `origin/main`. If the folder groups change an address, the milestone stops with a queue card; no redirect is written to hide it.
- The page files move with `git mv`, content unchanged. A relative link between pages that breaks by the move is fixed in that link only, one tracker line each.
- `components/docs-breadcrumb.tsx`, `lib/page-tree-utils.ts`, `components/section-tabs.tsx`, `lib/layout.shared.tsx`, `app/docs/layout.tsx` and `components/sidebar-separator.tsx` do not change: the switcher and the section line show by their own code once a page sits in a folder (`components/docs-breadcrumb.tsx:48-51`, `app/docs/[[...slug]]/page.tsx`, the `findSectionName` read), and the tabs match on the page list, which keeps its addresses.
- Where the Changelog link shows (in each section's sidebar, as on the table site) is read from the build and set beside `q180/table-docs-dark-1440.png`; a place that differs from the table site is a tracker line with its cause, and a queue card if the table's own files cannot give it.

#### 1.6.3 Copy page (D187)

- `lib/llms.ts` and `app/llms.mdx/docs/[[...slug]]/route.ts` are the table's files, byte for byte.
- `lib/shared.ts` gets back, as the table writes them: the `createGetUrl` import, `docsContentRoute = '/llms.mdx/docs'`, `getContentUrl` and `getPageMarkdownUrl` (`table:lib/shared.ts:1,14,31-37`). `docsImageRoute`, `getPageImageUrl`, `absoluteMarkdownUrl`, `libraryItem` and `registryRef` stay out.
- `lib/source.ts` gets back the table's four places: `llms` in the import (1), the `toPlainMarkdown` import (4) with `docsContentRoute` in the shared import (3, without `docsImageRoute`), `postprocess: { includeProcessedMarkdown: true }` (31-33) and `docsLlms` (201-205). The more-examples code stays out.
- `app/docs/[[...slug]]/page.tsx` gets back `MarkdownCopyButton` and `ViewOptionsPopover` in the import, `getPageMarkdownUrl` and `gitConfig` in the shared import, `markdownUrl` (`table:` 31) and the `st-page-actions` group (`table:` 55-71) with one value replaced: the `githubUrl` path segment `apps/shadcn-table-docs/content/docs/` becomes `apps/shadcn-date-picker-docs/content/docs/`. JSON-LD and the image line stay out.
- The options menu is the stock one of `fumadocs-ui`, as on the table site; its entries are not edited.
- Not taken: `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `proxy.ts` (D187 names the page-as-text routes Copy page needs, and it needs only the per-page one). `renderLlmsIndex` of `lib/llms.ts` then has no caller; the file is not trimmed for it.
- `toPlainMarkdown` drops capitalised JSX elements and keeps their prose children (`table:lib/llms.ts`, the comment above `toPlainMarkdown`, 114). The copied text of each of the nine pages is read once; a page whose text loses what the page is about (the install command of `/docs/install`, a picker page left with a heading only) is a queue card with the page and the text, not a change to the taken file.

#### 1.6.4 What is not touched

- No file under `packages/shadcn-date-picker/` (the registry trees, stories, Storybook), `demos/`, `components/ui-*`, `lib/registry-trees.mjs`, `components/theme-*`, `lib/design-system/`, `styles/`.
- The milestone "Docs demo parts follow the chosen style" of spec 89 (Q181) changes the demo parts in the same app and merges first; this milestone starts from `origin/main` with that merge on it.

**Stays unchanged:** the ten addresses; `next.config.mjs` (the `/docs` redirect); the three section tabs; the header (no Discord icon, the base select on the home header, D181); the page content; `package.json` and `pnpm-lock.yaml` (no new package: every taken file imports what the app has); `vercel.json`; the tags `v0.1.0` and `v0.1.1`; the table repository outside `.ai/plans/v0.9.x/`; the Vercel project's settings.

#### 1.6.5 Checks on the production build and live (D186, D187)

- Every browser read and capture uses a fresh, empty browser profile (a new context of the test browser). No real browser profile on the machine is read, copied or attached to.
- Local: `pnpm --filter shadcn-date-picker-docs build`, then `next start` on a port from 5340 to 5360 (P6), stopped after. At 1440 and 390 wide, dark and light:
  - `/`: the star field and the hero dune are drawn (the canvas has a non-zero size and painted pixels); the footer dune is drawn; with a second colour preset chosen in the customizer the dune's colour changes without a reload; with reduced motion set the dune does not animate; nothing runs past the right edge at 390;
  - a 404 address: the footer dune is drawn;
  - `/docs/install`, `/docs/time`, `/docs/props`: the sidebar lists only the pages of that page's section and the Changelog link; the `// section` line reads Get Started, Pickers, Props; the breadcrumb's switcher opens and lists that section's pages; the tab of the section is the active one; previous and next cards are read and named in the tracker;
  - the Changelog link's `href` is `https://github.com/anindosarker/shadcn-date-picker/releases` and it opens as the table's Changelog link does;
  - Copy page on `/docs/install` and `/docs/date`: the clipboard holds the page's text; the options menu opens; its GitHub entry points at `apps/shadcn-date-picker-docs/content/docs/(get-started)/install.mdx` on `main`, an address that answers 200 after the merge;
  - `/llms.mdx/docs/<page>/content.md` answers 200 with `text/markdown` for the nine pages;
  - search finds "Ranges" and opens `/docs/ranges`;
  - no error in the console.
  One tracker line per read.
- The captures of 1.2 Acceptance under `reference/q149-calendar-library/docs-site/frame/`, set beside the q179 and q180 captures and looked at one pair at a time; the difference list in the tracker. A text search of the served page is not a read of the look.
- No preview read by the owner and no wait on the branch preview (E27 Notes): after the local read the branch merges; then on `https://date-picker.shadcn-table.com/`: `/` and a 404 address draw the dunes, the nine `/docs/<page>` addresses answer 200 with the sectioned sidebar, Copy page works on `/docs/install`, `/llms.mdx/docs/install/content.md` answers 200, `/storybook/base/` still opens. A red there is fixed forward.

### 1.7 Dependencies and env

- No new package.
- Clone, branch, worktree, merge and tracker rules: spec 78, 1.6.1. Branch `date-picker-docs-home-effect-and-page-frame`, created from `origin/main` only after both milestones of spec 89 have merged.
- No tag and no picker release (E31 Notes); the table's `DATE_PICKER_TAG` stays `v0.1.1`.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker docs home effect and page frame

- Files owned: `shadcn-date-picker/apps/shadcn-date-picker-docs/components/dev-home/v12/home-page.tsx`, `shadcn-date-picker/apps/shadcn-date-picker-docs/components/dev-home/v12/footer.tsx`, `shadcn-date-picker/apps/shadcn-date-picker-docs/components/dev-home/v12/dune.tsx`, `shadcn-date-picker/apps/shadcn-date-picker-docs/components/dev-home/v4/starfield.tsx`, `shadcn-date-picker/apps/shadcn-date-picker-docs/components/dev-home/v4/field.ts`, `shadcn-date-picker/apps/shadcn-date-picker-docs/content/docs/**`, `shadcn-date-picker/apps/shadcn-date-picker-docs/app/docs/[[...slug]]/page.tsx`, `shadcn-date-picker/apps/shadcn-date-picker-docs/lib/shared.ts`, `shadcn-date-picker/apps/shadcn-date-picker-docs/lib/source.ts`, `shadcn-date-picker/apps/shadcn-date-picker-docs/lib/llms.ts`, `shadcn-date-picker/apps/shadcn-date-picker-docs/app/llms.mdx/docs/[[...slug]]/route.ts`
- Depends on: Docs demo parts follow the chosen style
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm --filter shadcn-date-picker-docs lint`, `pnpm --filter shadcn-date-picker-docs types:check`, `pnpm --filter shadcn-date-picker-docs build`, in the milestone's worktree of the date picker repository, one at a time (P5)
- Task 1: The home effect (1.6.1, D186). Checks: for `v4/starfield.tsx`, `v4/field.ts` and `v12/dune.tsx` `diff` against the table's at `v0.9.8` prints nothing; the diff of `home-page.tsx` and of `footer.tsx` against `origin/main` shows only the lines 1.6.1 names; `pnpm --filter shadcn-date-picker-docs types:check` and `lint` exit 0
- Task 2: The sidebar by section and the Changelog link (1.6.2, D187). Checks: the address list of the build equals `origin/main`'s, both lists in the tracker; `git diff -M100% --diff-filter=R --stat origin/main -- apps/shadcn-date-picker-docs/content` lists the nine pages as renames with no content change (a fixed relative link is named in the tracker); `git diff origin/main --stat -- apps/shadcn-date-picker-docs/components/docs-breadcrumb.tsx apps/shadcn-date-picker-docs/lib/page-tree-utils.ts apps/shadcn-date-picker-docs/components/section-tabs.tsx apps/shadcn-date-picker-docs/lib/layout.shared.tsx apps/shadcn-date-picker-docs/app/docs/layout.tsx` prints nothing; `pnpm --filter shadcn-date-picker-docs build` exits 0
- Task 3: Copy page (1.6.3, D187). Checks: for `lib/llms.ts` and the `llms.mdx` route `diff` against the table's at `v0.9.8` prints nothing; the diff of `page.tsx`, `lib/shared.ts` and `lib/source.ts` against the table's shows no line the table lacks except the `githubUrl` segment; `test ! -e apps/shadcn-date-picker-docs/proxy.ts`; `git diff origin/main --stat -- apps/shadcn-date-picker-docs/package.json pnpm-lock.yaml` prints nothing; the copied text of the nine pages read, one tracker line each; types:check, lint and build exit 0
- Task 4: The local production build read and the captures (1.6.5). Checks: one tracker line per read of 1.6.5 with pass or the fault; the captures committed under `reference/q149-calendar-library/docs-site/frame/` and the difference list against the q179 and q180 captures in the tracker; every browser used a fresh profile; the server stopped (`lsof -nP -iTCP:<port> -sTCP:LISTEN` prints nothing)
- Task 5: After the merge: the live reads (1.6.5). Checks: one tracker line per live read with the address; the CI run of the merged commit is `success`; the milestone worktree removed and `git -C <clone> status --short` prints nothing

### 2.2 Checks

- Date picker docs home effect and page frame: the taken files equal the table's at `v0.9.8`, the edited files carry only the table's lines, the ten addresses are unchanged, the dunes and the star field are drawn and follow the theme, the sidebar is by section with the switcher, the section line and the Changelog link, Copy page and the per-page text route work, the production build read at two widths and two modes in a fresh profile, the captures looked at beside the table site's, the live reads
