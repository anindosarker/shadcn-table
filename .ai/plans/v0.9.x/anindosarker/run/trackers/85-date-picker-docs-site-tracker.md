# 85: Date picker docs site, tracker

Status: running
Branch: none (a plan file)
Checks:
- Check: inventory rows equal the shell file list, `git ls-files apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/lib | grep -v -E 'apps/shadcn-table-docs/(components/ui[^/]*/|components/prop-tables/|components/dev-home/v[^/]*/)' | wc -l` at 38e51f9: 132 files, 132 rows: pass
- Check: every row has one of the three marks (25 taken as is, 29 taken trimmed, 78 not taken; a script asserts no file without a mark and no row without a file): pass
- Check: taken as is imports, `grep -n "from '@/"` on the 25 files at 38e51f9: only taken files (lib/source, lib/shared, lib/cn, lib/page-tree-utils, lib/sidebar-state, components/not-found-page, page-switcher, sidebar-section, sidebar-subgroup, sidebar-item, sidebar-group-context) and four parts of components/ui-radix (command, popover, collapsible twice), which the inventory rule leaves out and plan 1.2 takes as is: pass
- Check: the plan names the files that carry the base switch (lib/bases.mjs, lib/base-tabs.mjs, lib/install.ts, components/base-selector.tsx, components/example-variant.tsx, lib/example-variants.mjs, lib/registry-trees.mjs) and the tree each base points at (docs/registry/<base>, a copy of registry/<base>/components and hooks), plan 5.1 to 5.3: pass
- Check: ten page rows with title, sidebar place and source of the text, plan 6.1: pass
- Check: each demo row names the story it follows, seven rows, plan 6.3: pass
- Check: preview of `date-picker-docs-vercel-proof` answers `/` with the one-page app: ends at `/`, body `one-page app (docs service)`: pass (read in the owner's logged-in Chrome, plan 7.4; not a `curl -sI` line, the address answers 302 to the Vercel login without a session)
- Check: preview answers `/storybook/` with the static file: ends at `/storybook/`, title `proof`, body `storybook list (static file)`: pass (same read)
- Check: preview `/base/x` ends at `/storybook/base/x`: ends at `/storybook/base/x/` (the storybook service adds its slash), Vercel `404: NOT_FOUND` as the proof holds no such file; `/base/` and `/base` end at `/storybook/base/` with the static page: pass (same read; hop status codes not read, plan 7.4)
- Check: `git ls-remote --heads https://github.com/anindosarker/shadcn-date-picker date-picker-docs-vercel-proof` prints nothing: pass (`git ls-remote --heads origin` prints `main` 2cf6e6f alone)
- Check: `git -C shadcn-date-picker status --short` prints nothing: pass (worktree removed, `git worktree list` shows the clone alone)
- Check: review round 1, the four majors answered in the plan (7 status and 7.4; 5.1 `lib/bases.mjs`; row 122 `siteUrl`; new 1.4 root lint entries): pass
- Check: no em dash in the plan (`grep -c` prints 0): pass
- Check: the proof's preview is deleted, `vercel inspect dpl_2SHMqgtpbRws56SEZXF5obXb7M3w` answers "Can't find the deployment" and the preview address answers 404 `DEPLOYMENT_NOT_FOUND`: pass

- Task 1 The read, inventory, not-taken list, dependencies, styles: done (c6c0e745, plan sections 1 to 4)
- Task 2 Demos and the base switcher, routes and content: done (c6c0e745, plan sections 5 and 6)
- Task 3 Vercel routing proof and Storybook prefix, checks list: done (c6c0e745 sections 7.1 to 7.3 and 8; e90d91e4 the proof lines of 7.4, branch and worktree deleted)
- Review round 1: 4 majors, 13 minors (one of them the passed checks, for the record); all majors and 11 minors corrected in the plan, one minor answered with proof (the JSDoc of `DatePicker` opens at date-picker.tsx:14 with `/**`, as the plan says), the look picks staged as A2 and A3: e90d91e4
- Review round 2: 0 majors, 7 minors (one of them the round result, for the record); the six others corrected in the plan (rows 87, 102, 122; 1.4 twice; 7.4 with the preview removed by `vercel rm`; two lines added to section 8). Departure from the wording of spec 85, plan Task 3, kept and stated: the three proof lines are browser end addresses, not `curl -sI` lines, because the preview sits behind the Vercel login; the 307 and the 308 are read with `curl -sI` on production after the merge (plan section 8, Live): de7c89e9

Notes:
- The build check of spec 85 ("for each taken trimmed row the diff shows deletions and the import paths only") is wider in the plan: a trimmed row may also list value replacements (names, addresses, NAV_LINKS, one function signature and body, one guard line). Each is named in its row. Without them the header would read shadcn-table.
- Departure from spec 85, 1.6.1 item 3 and 1.7 (versions of the table's docs app), for the closer: `react`, `react-dom`, `lucide-react` and `cn` take the date picker root's range, because the three trees run on them and `cn` `^0.4.0` and `^0.5.0` share no version (plan section 3). Every other package is the table's.
- The proof deployment dpl_2SHMqgtpbRws56SEZXF5obXb7M3w was removed in review round 2 with `vercel rm` (spec 85, 1.6.1 item 7: the preview is deleted after); nothing of the proof is left on GitHub or Vercel.
- No GitHub or Vercel setting was changed. `vercel curl` was not run. The preview was read through the owner's Chrome with AppleScript (tabs opened in the back and closed after; Chrome's remote debugging and JavaScript from Apple Events stayed off).
- Row 122: the public site's canonical links come from a constant in `lib/shared.ts` (`https://date-picker.shadcn-table.com`), no environment variable.

## Attention

### A1 The Vercel preview of the routing proof cannot be read without a login (settled)
- Settled in review round 1: the owner's Chrome was logged in to Vercel and the addresses were read there; the lines are in plan 7.4.
- Kept nothing: the branch and its worktree are deleted.

### A2 The docs sidebar can be one list of nine pages or sections as on the table site
- The plan builds one sidebar list under three labels; the table site shows one section at a time.
- Facts: with the flat list the `// section` line above a page title and the page switcher in the breadcrumb do not show (plan 6.1, with the code lines). fumadocs folder groups keep the addresses of spec 85 and give the table's behaviour, with two sections of one page each (Get started: Install; Reference: Props).
- Options:
  1. Keep the flat list (the plan's default): nine rows always visible, nothing sparse; the eyebrow and the page switcher are absent.
  2. Three root folders in parentheses: sidebar, eyebrow and page switcher as on the table site; two of the three sidebars hold one row.

### A3 Three small look points of the public site have no answer in the spec or on the table site
- The plan takes a default for each so the build can run; the captures of the build show them.
- The code panel's More menu is left with one entry, "Open in GitHub" (plan row 40). Default: keep the menu as trimmed. Other way: a plain GitHub button in its place, which is more than a deletion.
- The home page and the 404 page end without a footer (plan row 60, 6.4). Default: none, the table's footer holds the Dune field, Discord and the table's link columns. Other way: the footer trimmed to the name, the licence line, GitHub and Storybook.
- The home header carries the base select (plan 5.1). Default: on, because the agent bar that held the home's base choice is not taken. Other way: off as on the table's home, and the home demos run on the stored base only.
