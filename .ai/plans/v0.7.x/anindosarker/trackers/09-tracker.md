# 09: release, tracker

Status: running
Branch `claude/review` (inline, no spec branch), registry `pnpm registry:dev` on 5310 at 56eaad0e
Gates:
- gate-radix `next build` at 56eaad0e: green
- gate-aria `next build` at 56eaad0e: green
- next-app: not run (blocked, see Attention)

- Milestone 01 Runtime gate: done (radix and aria checked; base blocked, A21; misses A22 to A25)
- Release run 1 (41210269119) green: version PR #78 merged as e9a7282c (`merge: version 0.7.0 (#78)`); run 2 (41210330158) tagged v0.7.0, production wait green, smoke red: `shadcn-table.json dependencies pin @tanstack/react-table@9.3.1` for every base (the pin lives on `shadcn-table-core.json` since spec 11); fixed forward in `scripts/release/smoke.mjs` (pin on the core item, lucide-react and the core dependency on the Lucide item; 28 passed against production), merged on `claude/review`, then `dev` into `master` and `gh workflow run release.yml --ref master -f version=0.7.0 -f dry_run=false` per P3
- Final milestone Release: running; CHANGELOG regrouped at 4a4cea21 (A1), `dev` fast-forwarded, PR #77 `release: 0.7.0` (dev into master, release:minor) opened; gate apps deleted, the run's registry serve on 5310 stopped

Runtime gate (Playwright 1.64.1, real mouse clicks, `next dev` on 5351 radix and 5352 aria; search traces also on `next start` 5353 and 5354):
- base (next-app): not installed, not checked (pre-step failed)
- radix (gate-radix): edition `shadcn-table-radix-tabler`, `icons.ts` imports `@tabler/icons-react`; `grep -c lucide-react package.json` 1 (FAIL); build green; console gate 0, rtl 0
- aria (gate-aria): edition `shadcn-table-aria-phosphor`, `icons.ts` imports `@phosphor-icons/react`; `grep -c lucide-react package.json` 1 (FAIL); build green; console gate 276 warnings, rtl 192 warnings (FAIL)
- Menus, radix and aria identical:
  - column action: Escape closes, focus `BUTTON[Column Actions]` (opener), aria-expanded false/true/false, second click closes
  - filter option: Escape closes, focus `BUTTON[Change filter mode]`, aria-expanded flips, second click closes
  - row action: Escape closes, focus `BUTTON[Row Actions]`, aria-expanded flips, second click closes
  - cell action (right-click on td): Escape closes, focus the `td` it opened from, no aria-expanded (td has none by D26), second right-click does not close (accepted in spec 10 tracker Attention)
  - show/hide columns: Escape closes, focus `BUTTON[Show/Hide columns]`, aria-expanded flips, second click closes
- Search field, radix and aria: opens with the input focused (open width 224 px), `inert` at rest (rest width 48 px), no snap; per-frame trace after the toggle:
  - dev: 224 until about 50 to 55 ms, then 148, 103, 79, 65, 57, 53, 50, 49, 48 by about 190 ms; setTimeout samples radix 63 ms 224, 144 ms 57; aria 64 ms 224, 143 ms 57 (60 ms sample not strictly below 14rem)
  - production: 224 until about 8 to 16 ms, then the same curve; about 60 ms 65 to 79, about 140 ms 48 to 49 (140 ms sample reaches 3rem in some runs)
- Column resize: drag +60 px, 180 to 240 px, both; page change: first row age 20 to 30, both
- RTL page, radix and aria: `dir` rtl; First Name th 1067 to 1247, resize handle 1067 to 1079, left side on screen (the inline-end edge in RTL); pinned th and td `position: sticky`, computed `inset-inline-start: 0px`, pinned column at the right (start) edge of the table; RTL drag 180 to 240 px

## Attention

- next-app install skipped: `git -C ../test-projects/next-app status --short` shows `?? v0.8-default-look-review.md` (untracked, not ours); no re-install and no gate pages there; base edition unchecked (09)
- Edition check D30 fails in gate-radix and gate-aria: `lucide-react` in `package.json` (1) because the stock parts the table pulls (`dropdown-menu`, `checkbox`, `select`, `dialog`, `pagination`, `spinner`, `combobox`, `native-select`) are written with the app's `components.json` `iconLibrary: lucide` from `shadcn init --preset nova`; the table's `icons.ts` imports only the edition package. The gate as written cannot pass unless the gate app is inited with the matching `iconLibrary` or the check scopes to `components/ui/shadcn-table` (11, gate wording 09)
- Aria console warnings, gate page 276, RTL page 192, all React Aria dev warnings: `<Pressable> child must be focusable. Please ensure the tabIndex prop is passed through.` (100), `If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility` (84), `<Focusable> child must have an interactive ARIA role.` (82), `<Focusable> child must be focusable...` (10); sources not traced (10, D28 tooltip triggers likely)
- Search width samples: no snap in either base, but the fixed 60 ms and 140 ms samples are timing bound: in dev the transition starts about 50 ms after the toggle (60 ms sample still 224 px, equal to 14rem), in production the ease-out curve reaches 48 px (3rem) by about 140 ms; the strict bounds fail on one sample in each mode (10 for the curve, 09 for the sample times)
- RTL handle: on screen left as the gate asks, which is the inline-end edge (D31 direction-neutral `end`); the spec text "inline-start edge" and "left side" disagree, the spec 10 RTL story asserts inline-end (09 wording)
- Gate pages left in the scratchpad gate apps (`app/release-gate/page.tsx`, `app/release-gate/rtl/page.tsx`, pinning `columnPinning: { start: ['firstName'] }`); scripts in the session scratchpad `gate.mjs`, `search.mjs`
