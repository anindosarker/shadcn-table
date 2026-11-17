# 59: Lighter story pages, tracker

Status: running
Branch `v0.9/lighter-story-pages`, worktree 07
Checks:
- Check: Task 1 load before the build (`top -l 1`, `memory_pressure`): CPU 42 percent idle, memory free 35 percent
- Check: Task 1 production build of the branch point e0700242 (`next build` after the prebuild scripts, `.next` removed first): `du -sm .next` 2146 MB (cache 518), `du -sm .next/server/app/docs/examples/more` 1166 MB
- Check: Task 1 byte split at e0700242, story page `more/basic--default`: HTML 835106 B = rendered sidebar (`<aside>`, 641 links) 384123 + inline RSC scripts 407789 (the page tree line of the docs layout, 331885 B in the RSC) + rest 43194; RSC 379234 = tree 331885 + rest 47349; segment files `_full` 379234, `docs.segment` 323313 (the tree again), page 23205; about 1.74 MB of the page's 1.98 MB is the sidebar
- Check: Task 1 byte split at e0700242, example page `basic`: HTML 488703 B = `<aside>` 30378 (folder closed, no story rows) + inline RSC scripts 413726 (tree) + rest 44599; RSC 384880 = tree 331885 + rest 52995
- Check: Task 1 cost of one row at e0700242: 471 B in the tree (331885 B / 704 page nodes), carried four times per page (inline HTML, `.rsc`, `_full`, `docs.segment`), about 1.9 KB; 599 B of rendered HTML per row in an open folder (384123 B / 641 links)
- Check: Task 1 captures at e0700242 (`next start` on 5341, stopped): scratchpad `captures/before-{basic-closed,basic-open,story}-{light,dark}-{desktop,mobile}.png`, story page `features-column-pinning--column-pinning-initial`
- Check: Task 2 first means (02cdea98, tree nodes trimmed to name, label, URL, icon, external flag): build output `.next` 1525 MB, `more` 640 MB; misses 900 and 250, Task 3 runs

- Task 1 Baseline and measurement: done (e0700242, no commit)
- Task 2 First means: done (02cdea98), sizes missed
