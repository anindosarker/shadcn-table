# 59: Lighter story pages, tracker

Status: waiting (lead: the `.next` size of 1.2: 1107 MB against 900; 524 MB of it is the turbopack build cache `.next/cache/turbopack`, 518 MB at the branch point too; see Attention)
Branch `v0.9/lighter-story-pages`, worktree 07
Checks:
- Check: Task 1 load before the build (`top -l 1`, `memory_pressure`): CPU 42 percent idle, memory free 35 percent
- Check: Task 1 production build of the branch point e0700242 (`next build` after the prebuild scripts, `.next` removed first): `du -sm .next` 2146 MB (cache 518), `du -sm .next/server/app/docs/examples/more` 1166 MB
- Check: Task 1 byte split at e0700242, story page `more/basic--default`: HTML 835106 B = rendered sidebar (`<aside>`, 641 links) 384123 + inline RSC scripts 407789 (the page tree line of the docs layout, 331885 B in the RSC) + rest 43194; RSC 379234 = tree 331885 + rest 47349; segment files `_full` 379234, `docs.segment` 323313 (the tree again), page 23205; about 1.74 MB of the page's 1.98 MB is the sidebar
- Check: Task 1 byte split at e0700242, example page `basic`: HTML 488703 B = `<aside>` 30378 (folder closed, no story rows) + inline RSC scripts 413726 (tree) + rest 44599; RSC 384880 = tree 331885 + rest 52995
- Check: Task 1 cost of one row at e0700242: 471 B in the tree (331885 B / 704 page nodes), carried four times per page (inline HTML, `.rsc`, `_full`, `docs.segment`), about 1.9 KB; 599 B of rendered HTML per row in an open folder (384123 B / 641 links)
- Check: Task 1 captures at e0700242 (`next start` on 5341, stopped): scratchpad `captures/before-{basic-closed,basic-open,story}-{light,dark}-{desktop,mobile}.png`, story page `features-column-pinning--column-pinning-initial`
- Check: Task 2 first means (02cdea98, tree nodes trimmed to name, label, URL, icon, external flag): build output `.next` 1525 MB, `more` 640 MB; misses 900 and 250, Task 3 runs
- Check: Task 3 tsc (`next typegen`, `tsc --noEmit -p tsconfig.build.json`) and eslint on the changed files at 2814e174: pass
- Check: Task 3 load before the build: CPU 40 percent idle, memory free 40 percent
- Check: Task 3 production build at 2814e174 (`.next` removed first): `du -sm .next` 1107 MB (cache 526, server 549 of which `server/chunks` 180, static 31), `du -sm .next/server/app/docs/examples/more` 245 MB; story page `more/basic--default` HTML 144570 B (`<aside>` 31268, one story link), RSC 63748, `docs.segment` 23990
- Check: Task 3 served HTML of `/docs/examples/more/features-column-pinning--column-pinning-initial` at 2814e174 (`next start` on 5341): "More examples (596)" with `aria-expanded="true"`, active row "124. Column Pinning Initial", its label "Features/Column Pinning (7)", one story link
- Check: Task 3 the same page in Chromium at 2814e174: 596 story rows after load, active row scrolled into view (y 485 of 900), no console errors
- Check: Task 4 `pnpm test docs-e2e --base base --url <next start of 2814e174> --section site` at 6ce7fcb8: pass (58 checks; the story page entry adds the served-HTML row, open folder, count, row count, numbering, active row, sub-group label without toggle, basic closed, opened by a click, open after a reload)
- Check: Task 4 captures retaken at 2814e174: scratchpad `captures/after-*.png`, pixel compare of the sidebar area against `before-*.png` (`cmp.mjs`, pngjs): 0 differing pixels on all 12 desktop and mobile captures except the two story mobile ones, 74 and 62 pixels at y 780 to 834, the page behind the drawer (faker table data), not the sidebar
- Check: Task 5 story pages listed at 2814e174: sitemap 596, `/llms.txt` 596, content files 596; `app/sitemap.ts`, `lib/llms.ts` and `content/` unchanged since e0700242, so the branch point lists the same 596
- Check: Task 6 `pnpm format` at 49cbea14: only CHANGELOG.md touched, committed
- Check: Local CI `pnpm test typecheck --base radix` at 49cbea14: pass (tsc clean)
- Check: Local CI `pnpm test lint` at 49cbea14: pass (0 errors, 9 warnings in example files)
- Check: Local CI `pnpm test validate-repo` at 49cbea14: pass (596 story pages match, 40 unit tests), tree clean after
- Check: Local CI `pnpm test docs-e2e --base base --url <next start of 2814e174, app code equal to 49cbea14>` at 49cbea14: getting-started 264/1 (known flake P5 "theme: Shift+R returns to the default"), api 111/0, guides 974/0, examples 1101/0, site 58/0; getting-started rerun 265/0
- Check: Acceptance 1.2 at 49cbea14 on that server: `/nope` and `/docs/examples/sticky-heder` 404; virtualization guide repeats no example id; `more` 245 MB (at most 250: pass); `.next` 1107 MB (at most 900: miss, see Attention); server stopped

- Task 1 Baseline and measurement: done (e0700242, no commit)
- Task 2 First means: done (02cdea98), sizes missed
- Task 3 Second means: done (2814e174)
- Task 4 Sidebar unchanged, site checks: done (6ce7fcb8)
- Task 5 Nothing dropped: done (no commit)
- Task 6 Cleanup: done (49cbea14)

## Attention

- `.next` stays above 900 MB: 1107 MB, of which 524 MB is `.next/cache/turbopack` (Next 16.3 build cache, not served, 518 MB at the branch point); the rest is 583 MB, below the 644 MB of 1.2. The story pages themselves are 245 MB (from 1166) and `server/chunks` 180 MB holds the compiled story MDX. Reaching 900 with the cache counted needs the cache off for builds (`next.config.mjs`, spec 58's file) or a measure without `.next/cache`; nothing in this milestone's files gets there.
- The "More examples" rows come from the folder's meta.json bundled once in the docs JavaScript (`lib/more-examples.ts`, `components/docs-tree-layout.tsx`), not from a fetched `/docs/more-examples.json` route: the breadcrumb, the page switcher and the row numbers on a story page read the full tree on the server render, which a fetched list would only give after load. The HTML still carries only the current row; the build fails if the rows built from meta.json differ from the page tree.
- `components/sidebar-separator.tsx` (not in the files owned) gained the `ActiveRowOnly` filter so a sub-group shows only the current row before the list renders; `components/docs-tree-layout.tsx` is new.

