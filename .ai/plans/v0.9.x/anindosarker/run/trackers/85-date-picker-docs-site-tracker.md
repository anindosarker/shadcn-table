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
- Check: preview of `date-picker-docs-vercel-proof` answers `/` with the one-page app: not read, the address answers HTTP 302 to vercel.com/sso-api (Vercel login) on every path: fail (A1)
- Check: preview answers `/storybook/` with the static file: not read, same: fail (A1)
- Check: preview `/base/x` ends at `/storybook/base/x`: not read, same: fail (A1)
- Check: `git ls-remote --heads https://github.com/anindosarker/shadcn-date-picker date-picker-docs-vercel-proof` prints nothing: fail, the branch is kept at 8f41b47 until A1 is settled
- Check: `git -C shadcn-date-picker status --short` prints nothing: pass (the proof lives in its own worktree, which is kept)

- Task 1 The read, inventory, not-taken list, dependencies, styles: running
- Task 2 Demos and the base switcher, routes and content: running
- Task 3 Vercel routing proof and Storybook prefix, checks list: blocked on A1 (plan sections 7.1 to 7.3 and 8 written; 7.4 waits)

Notes:
- The build check of spec 85 ("for each taken trimmed row the diff shows deletions and the import paths only") is wider in the plan: a trimmed row may also list value replacements (names, addresses, NAV_LINKS, one function body). Each is named in its row. Without them the header would read shadcn-table.
- The proof deployment built both services: Vercel deployment dpl_2SHMqgtpbRws56SEZXF5obXb7M3w, READY. Only reading it is blocked.
- No GitHub or Vercel setting was changed. `vercel curl` was not run: the project has no protection bypass secret and the command would create one.

## Attention

### A1 The Vercel preview of the routing proof cannot be read without a login
- The preview of the proof branch is behind the Vercel login, so the three routing answers the plan needs are not proven.
- Facts: deployment dpl_2SHMqgtpbRws56SEZXF5obXb7M3w of branch date-picker-docs-vercel-proof built (docs service and storybook service, READY). Every path of https://shadcn-date-picker-7bs28yd3z-anindo-sarkers-projects.vercel.app answers HTTP 302 to vercel.com/sso-api. Project setting: ssoProtection all_except_custom_domains; no protection bypass secret exists. The Chrome extension was not connected, so the owner's logged-in browser could not read it either. A local static serve is not a proof of Vercel's behaviour (run rule).
- Options:
  1. The owner opens the six addresses of plan 7.4 in a browser logged in to Vercel, or connects the Chrome extension, and the runner records the answers. No setting changes.
  2. The owner allows `vercel curl` once: it creates a protection bypass secret on the project (a Vercel setting), the runner reads the lines, the secret can be deleted after.
  3. The routing is proven on the preview of the build branch instead (spec 85, build task 3 already reads `/`, `/docs/date`, `/storybook/base/` and `/version.txt` there), with the same login question.
- Kept until settled: branch date-picker-docs-vercel-proof on origin (8f41b47, never merged) and its worktree shadcn-date-picker.worktrees/date-picker-docs-vercel-proof.
