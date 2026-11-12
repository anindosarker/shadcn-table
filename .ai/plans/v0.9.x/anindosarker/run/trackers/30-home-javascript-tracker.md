# 30: Home JavaScript, tracker

Status: merged (5735b0ee)
Branch `v0.9/home-javascript`, worktree `shadcn-react-table.worktrees/05`
Checks:
- `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build` at e5f078cd: pass
- Baseline Lighthouse x3 (`npx lighthouse@12 http://localhost:5349/ --preset=desktop ...`, Acceptance `node -e` line) at e5f078cd: 711 KB / 137 ms, 711 KB / 82 ms, 711 KB / 145 ms; median 711 KB, 137 ms (KB over target)
- `grep -lE 'jspdf|recharts' .next/static/chunks/*.js` at e5f078cd: `0y4jmym2_y-p3.js`, `3uo436fj_z6e4.js`; neither referenced by the `/` HTML nor fetched in the Lighthouse runs: pass
- `pnpm exec next experimental-analyze -o` (apps/shadcn-table-docs) at e5f078cd: pass, report in `.next/diagnostics/analyze` (Notes)
- `pnpm --filter shadcn-table-docs types:check` at 8d0f2850: pass
- `pnpm --filter shadcn-table-docs lint` at 8d0f2850: pass (0 errors, 9 warnings, none in dev-home)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build` at 8d0f2850: pass
- After Lighthouse x3 at 8d0f2850: 437 KB / 158 ms, 437 KB / 146 ms, 437 KB / 160 ms; median 437 KB, 158 ms: pass
- `grep -lE 'jspdf|recharts' .next/static/chunks/*.js` at 8d0f2850: `0y4jmym2_y-p3.js`, `3uo436fj_z6e4.js`, neither referenced by the `/` HTML: pass
- Playwright probe on port 5349 at 8d0f2850 (1350x940 and 1920x1400): pass (Notes)
- `pnpm format` at 8d0f2850: pass, no changes
- `pnpm test typecheck --base base` at 8d0f2850: pass
- `pnpm test lint` at 8d0f2850: pass (9 warnings)
- `pnpm test validate-repo` at 8d0f2850: pass
- `pnpm test docs-e2e --base base` at 8d0f2850: fail, getting-started `/` @1440 "icons: the pick survives a reload stored=tabler class=" (not a P5 flake: after the reload no input reaches the page, so the intent-gated demo table never loads); cause of the revert below
- Signal table gating reverted (`v12/signal-demo.tsx` back to e5f078cd), IntentLink kept: `pnpm --filter shadcn-table-docs types:check` pass; build pass; Lighthouse x3: 580 KB / 210 ms, 580 KB / 158 ms, 580 KB / 71 ms, median 580 KB, 158 ms: KB fail (target 450), ms pass; jspdf/recharts grep: same two chunks, not referenced by `/`: pass
- `pnpm test docs-e2e --base base` with the revert: pass (107 pages, 939 examples)

- Task 1 baseline: done (8a9493b9)
- Task 2 defer and split: done as far as reachable (8d0f2850, table gating reverted in the Task 3 commit); KB target not met (Attention)
- Task 3 format, changelog, Local CI: done (see Checks)

## Baseline (e5f078cd)

- Lighthouse desktop, three runs: 711 KB / 137 ms; 711 KB / 82 ms; 711 KB / 145 ms (35 script requests each). Median 711 KB, 137 ms.
- `/` HTML 141652 bytes; 21 `<script src>` values. First-load chunk list, bytes on disk / Lighthouse transfer: 04khzrr6r53n1.js 38121/12744, 0bdryt_ic0367.js 33761/9367, 0cz1d0mv5g_q7.js 112594/not fetched (nomodule polyfills), 0e91pl0k5_tbm.js 5612/2430, 0t-0fg56ogvie.js 229044/72090 (react-dom), 0xm4182l47hkl.js 24364/8740, 1_c6vfv8os6as.js 25746/9475, 1n5grx6_y5td_.js 16611/6242, 1t92h_cggzt30.js 41490/16995, 1u1imhr-kmb1u.js 72016/23826, 2dmw2pwzd_snn.js 39251/11632, 2f_mx1qudi1tp.js 23960/8694, 2ljqm8td6c6v0.js 23491/8687, 2u7p081-chmlk.js 14434/4083, 300id0lsj28q9.js 161699/44631, 37afhsoyqinxc.js 16949/6602, 3_nspdrsocfzc.js 146480/33632, 3cvfw3sg57tn1.js 33628/9359, 3fq8swxb-eibm.js 57180/19416, 3k2u1uzzoqg_6.js 343009/113834 (posthog-js), turbopack-16p7p4t38eskz.js 10947/4702. Total 1470387 bytes on disk, 427181 bytes transfer.
- Of those 21, only 04khzrr6r53n1.js and 1n5grx6_y5td_.js (19 KB transfer) are not in the `/docs/[[...slug]]` first load (`.next/diagnostics/route-bundle-stats.json`): the rest is the shared root layout (react-dom, Next runtime, posthog-js, fumadocs, design system), out of scope (1.6.2).
- Scripts fetched after load, 300631 bytes transfer: (a) the signal demo table (`dynamic(..., { ssr: false })`, in view at 1350x940, demo top at 670 px): 14u38_62-t4zl.js 4297, 0l6n68pab3myc.js 10017, 232887h55q_2a.js 66506 (ui-radix shadcn-table, radix), 1bt1pmvqpb93v.js 41725 (@tanstack/table-core, lucide-react, virtual), 20hvl1sj0nkq7.js 24540, 2quift96t15cq.js 6804, 01mdz3ax1gwgh.js 13072; (b) Link viewport prefetch of the nav and hero docs links (`/`, introduction, api, examples, guides, install RSC prefetches) pulling the docs route chunks: 3ohmamwo-wfq_.js 11333, 2vtsrr1eyaru0.js 15047, 2fpqw7hja_sk-.js 18138, 1qt7wn42jaaz0.js 8949, 3_b2a70b5xeb9.js 11177, 23gvproqfbzfe.js 10448, 2z3m004ppy9qx.js 44715 (fumadocs search, cmdk), 43e0vtnlum3sr.js 13863 (133670 bytes).

## After (Task 2)

- Lighthouse desktop, three runs: 437 KB / 158 ms; 437 KB / 146 ms; 437 KB / 160 ms (22 script requests each). Median 437 KB, 158 ms.
- `/` HTML 142186 bytes; 21 `<script src>` values, bytes on disk / transfer: 0bdryt_ic0367.js 33761/9367, 0cz1d0mv5g_q7.js 112594/not fetched (nomodule), 0e91pl0k5_tbm.js 5612/2430, 0t-0fg56ogvie.js 229044/72090, 0xm4182l47hkl.js 24364/8740, 1_c6vfv8os6as.js 25746/9475, 1n5grx6_y5td_.js 16611/6242, 1ootfg5f1u75s.js 343049/113860 (posthog-js), 1t92h_cggzt30.js 41490/16995, 1u1imhr-kmb1u.js 72016/23826, 2dmw2pwzd_snn.js 39251/11632, 2f_mx1qudi1tp.js 23960/8694, 2ljqm8td6c6v0.js 23491/8687, 2u7p081-chmlk.js 14434/4083, 300id0lsj28q9.js 161699/44631, 3_nspdrsocfzc.js 146480/33632, 3b6v5pt-ahp4e.js 38920/13016, 3cvfw3sg57tn1.js 33628/9359, 3fq8swxb-eibm.js 57180/19416, 3pd_0eh1o66nd.js 16909/6582, turbopack-16p7p4t38eskz.js 10947/4702. Total 1471186 bytes on disk, 427459 bytes transfer.
- Fetched after load: 2quift96t15cq.js 6804 and 01mdz3ax1gwgh.js 13072 only. The demo table chunks and the docs route chunks no longer load until the visitor acts.

## Final state

- Kept: nav and hero links prefetch on intent (`shared/intent-link.tsx`). Reverted: the intent-gated demo table. Lighthouse median 580 KB, 158 ms; `/` first load unchanged (shared layout); post-load fetches are the demo table's 7 chunks only.

## Notes

- ANALYZE=1 writes no report under Turbopack (milestone 24, Q56); `next experimental-analyze -o` (Turbopack analyzer, read-only, no config change) wrote `.next/diagnostics/analyze/data/analyze.data`; it named @tanstack/table-core, lucide-react and the ui-radix shadcn-table files in the demo table chunks and posthog-js in the largest first-load chunk.
- The first load itself barely moved (427181 to 427459 bytes): it is the shared root layout. The 274 KB saving is the post-load fetches: the demo table now loads once its placeholder is wholly on screen or on the visitor's first scroll, wheel, pointer, touch or key (`useLoadOnIntent`, `v12/signal-demo.tsx`); the nav and hero links prefetch on pointer, touch or focus (`shared/intent-link.tsx`) instead of on entering the viewport.
- Playwright probe: at 1350x940 the table is absent before any input, present 2.5 s after one mouse move, the replay runs after a scroll ("Now showing: Search"); at 1920x1400 the table loads without input (placeholder wholly in view); hovering the API nav link fires the `/docs/api` RSC prefetch; clicking it navigates.
- TBT was already under 300 ms on this machine at baseline (median 137 ms), against the audit's 1040 ms.

## Attention

- Stopped, not merged, not retried (runner 2026-11-10, Q30): the 450 KB script target on `/` is unreachable inside `components/dev-home/**`; 711 KB before, 580 KB on branch `v0.9/home-javascript` at b2bcf60d (kept for salvage, every check green). The owner's ruling on Q30 decides merge, retry or drop.

- Acceptance's 450 KB is unreachable inside `components/dev-home/**` while visible behaviour stays unchanged: the `/` first load is 427 KB transfer, all but 19 KB of it the shared root layout (posthog-js alone 114 KB, react-dom 72 KB; `app/layout.tsx` is out of scope, 1.6.2), and the live demo table (167 KB transfer, @tanstack/table-core plus the ui-radix shadcn-table) is in view at 1350x940 and must load without input (docs-e2e `/` "icons: the pick survives a reload" waits for its rows after a reload with no input). Gating the table on intent reached 437 KB but failed that check, so it is reverted; the branch stands at 580 KB. Owner choice: defer posthog-js / the layout providers (another spec), accept intent loading of the demo table and change that docs-e2e check, or move the 450 KB target.
- The nav and hero docs links prefetch on hover, touch or focus instead of on entering the viewport (saves the 131 KB docs route chunks per home visit). A click without a prior hover or focus navigates without a warm prefetch.
- 1.6.2's "every client component below the hero through `next/dynamic` from `home-page.tsx`" is not applied: the home-only first-load JavaScript is two chunks, 19 KB transfer, and `SignalDemo`/`ThemeDemo` already lazy-load their heavy parts; a server-component `dynamic()` keeps SSR and saves nothing, and `ssr: false` would drop the tiles, install strip and footer text from the HTML. Starfield and Dune stay in the first load (source 1.2 KB and 5.2 KB plus 3.8 KB field).
- Merged by the runner on D62 (Q30 option a): target now under 600 KB script and 300 ms TBT, met at b2bcf60d (580 KB, 158 ms). The branch's `CHANGELOG.md` was corrupted (the Spec 30 block repeated 80139 times, 321530 lines); the merge kept the `claude/review` changelog and added the one block under `### Changed`.
