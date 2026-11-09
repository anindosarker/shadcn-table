# 30: Home JavaScript, tracker

Status: running
Branch `v0.9/home-javascript`, worktree `shadcn-react-table.worktrees/05`
Checks:
- `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build` at e5f078cd: pass
- Baseline Lighthouse x3 (`npx lighthouse@12 http://localhost:5349/ --preset=desktop ...`, Acceptance `node -e` line) at e5f078cd: 711 KB / 137 ms, 711 KB / 82 ms, 711 KB / 145 ms; median 711 KB, 137 ms (KB over target)
- `grep -lE 'jspdf|recharts' .next/static/chunks/*.js` at e5f078cd: `0y4jmym2_y-p3.js`, `3uo436fj_z6e4.js`; neither referenced by the `/` HTML nor fetched in the Lighthouse runs: pass
- `pnpm exec next experimental-analyze -o` (apps/shadcn-table-docs) at e5f078cd: pass, report in `.next/diagnostics/analyze` (Notes)

- Task 1 baseline: done (see Baseline)

## Baseline (e5f078cd)

- Lighthouse desktop, three runs: 711 KB / 137 ms; 711 KB / 82 ms; 711 KB / 145 ms (35 script requests each). Median 711 KB, 137 ms.
- `/` HTML 141652 bytes; 21 `<script src>` values. First-load chunk list, bytes on disk / Lighthouse transfer: 04khzrr6r53n1.js 38121/12744, 0bdryt_ic0367.js 33761/9367, 0cz1d0mv5g_q7.js 112594/not fetched (nomodule polyfills), 0e91pl0k5_tbm.js 5612/2430, 0t-0fg56ogvie.js 229044/72090 (react-dom), 0xm4182l47hkl.js 24364/8740, 1_c6vfv8os6as.js 25746/9475, 1n5grx6_y5td_.js 16611/6242, 1t92h_cggzt30.js 41490/16995, 1u1imhr-kmb1u.js 72016/23826, 2dmw2pwzd_snn.js 39251/11632, 2f_mx1qudi1tp.js 23960/8694, 2ljqm8td6c6v0.js 23491/8687, 2u7p081-chmlk.js 14434/4083, 300id0lsj28q9.js 161699/44631, 37afhsoyqinxc.js 16949/6602, 3_nspdrsocfzc.js 146480/33632, 3cvfw3sg57tn1.js 33628/9359, 3fq8swxb-eibm.js 57180/19416, 3k2u1uzzoqg_6.js 343009/113834 (posthog-js), turbopack-16p7p4t38eskz.js 10947/4702. Total 1470387 bytes on disk, 427181 bytes transfer.
- Of those 21, only 04khzrr6r53n1.js and 1n5grx6_y5td_.js (19 KB transfer) are not in the `/docs/[[...slug]]` first load (`.next/diagnostics/route-bundle-stats.json`): the rest is the shared root layout (react-dom, Next runtime, posthog-js, fumadocs, design system), out of scope (1.6.2).
- Scripts fetched after load, 300631 bytes transfer: (a) the signal demo table (`dynamic(..., { ssr: false })`, in view at 1350x940, demo top at 670 px): 14u38_62-t4zl.js 4297, 0l6n68pab3myc.js 10017, 232887h55q_2a.js 66506 (ui-radix shadcn-table, radix), 1bt1pmvqpb93v.js 41725 (@tanstack/table-core, lucide-react, virtual), 20hvl1sj0nkq7.js 24540, 2quift96t15cq.js 6804, 01mdz3ax1gwgh.js 13072; (b) Link viewport prefetch of the nav and hero docs links (`/`, introduction, api, examples, guides, install RSC prefetches) pulling the docs route chunks: 3ohmamwo-wfq_.js 11333, 2vtsrr1eyaru0.js 15047, 2fpqw7hja_sk-.js 18138, 1qt7wn42jaaz0.js 8949, 3_b2a70b5xeb9.js 11177, 23gvproqfbzfe.js 10448, 2z3m004ppy9qx.js 44715 (fumadocs search, cmdk), 43e0vtnlum3sr.js 13863 (133670 bytes).

## Notes

- ANALYZE=1 writes no report under Turbopack (milestone 24, A20); `next experimental-analyze -o` (Turbopack analyzer, read-only, no config change) wrote `.next/diagnostics/analyze/data/analyze.data`; it named @tanstack/table-core, lucide-react and the ui-radix shadcn-table files in the demo table chunks and posthog-js in the largest first-load chunk.

## Attention
