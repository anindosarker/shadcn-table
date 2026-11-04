# 07: release 0.8.0, tracker

Status: blocked (runtime gate: 2 checks fail, see Attention; release held for the owner)
Branch claude/review (inline, no spec branch), registry on 5310 (served from worktree 01 `.dev`, rebuilt 16:25 at bc21b6da; `git diff bc21b6da..7c2717aa -- packages/` empty, so it is claude/review's build; `pnpm -w registry:build` rerun at 7c2717aa, tree unchanged)
Gates:
- gate-base `next build` at 7c2717aa: green
- gate-radix `next build` at 7c2717aa: green
- gate-aria `next build` at 7c2717aa: green
- gate-base `npx eslint components/ui/shadcn-table` at 7c2717aa: green (exit 0, 0 problems, 0 warnings)
- Edition check per app at 7c2717aa: green
- Browser console, gate, persisted and RTL pages, `next dev` per app at 7c2717aa: base green (0/0), radix green (0/0), aria red (58 React Aria warnings, 0 errors)
- 1.6.2 chrome checks at 7c2717aa: red in all three (D22 scroll chevron centre click)

- Milestone 01 Runtime gate: blocked (checks recorded, two failures under Attention)
- Final milestone Release and cleanup: not started (held: owner reviews locally before release)

Runtime gate (agent-browser 0.27.0, viewport 1800x1150, `next dev` on 5341 base, 5342 radix, 5343 aria, one base after another (P4 override); driver `gate.mjs` in the gate agent's scratchpad):
- Apps: `pnpm dlx shadcn@latest init --template next --base <base> --preset nova --name gate-<base> --yes` under `test-projects/checks/` (Next 16.4.3); `iconLibrary` set in `components.json` before the add (`lucide`, `tabler`, `phosphor`); `shadcn add http://localhost:5310/r/shadcn-table-base.json`, `/r/shadcn-table-radix-tabler.json`, `/r/shadcn-table-aria-phosphor.json` `--yes`, all exit 0; base and radix layouts wrapped in `TooltipProvider` (aria's tooltip has no provider)
- Editions: `icons.ts` imports only `lucide-react` (base), `@tabler/icons-react` (radix), `@phosphor-icons/react` (aria); 1 import in `icons.ts` plus 9 in the stock parts and gate pages, same package, no other icon package; `table.options.icons` 54 keys, 0 undefined, in all three
- Pages: `release-gate` (18 columns with `columnDef.icon`, `enableColumnOrdering: false` on Name and Due, `enableRowActions` with Edit, Duplicate, Delete, 50 rows), `release-gate/persisted` (same, `persistViewSettings: true`), `release-gate/rtl`; identical sources in the three apps
- Builds: `next build` exit 0 in all three, the three routes prerendered static, no warning lines
- eslint (gate-base): exit 0, empty output
- Checks, base, radix and aria identical unless noted:
  - persistence off: 0 `shadcn-table:` localStorage keys after interaction, 0 `<script>` in `[data-slot=st-table-layout]`: pass
  - toolbar order (D8): Show/Hide search, Filter, Sort, Show/Hide columns, Toggle density, Toggle full screen, View settings: pass
  - column menu (D4) (D5) (D25): chevron and label open the same menu; unsorted Sort ascending, Sort descending, Filter, Pin to start, Pin to end, Hide; sorted adds Clear sort with Sort ascending disabled; pinned shows Pin to end, Unpin; second click closes: pass
  - filter (D9): Status menu Filter adds the Status chip and opens its popover, "Done" filters 50 to 12 rows, Clear filters removes the chip, 50 rows: pass
  - sort (D10): picker lists 18 columns, Due becomes the chip and the editor opens with 1 rule, Add sort then Status gives due, status, drag handle reorders to status, due (synthetic DragEvent, headless native drop not delivered), Delete sort clears: pass
  - view settings (D11): Columns, Density, Wrap cell text, Grid lines, Sticky header, Alternating row colors, Row numbers, Reset view present, Columns and Density pinned; Row numbers adds `#` at index 0, sticky, pinned start `st-row-numbers`; Reset view removes it: pass
  - header drag (D20) (D37): mid-drag Project th translate -180px, Assignee 180px, 0 body cells translated; Escape restores order and 0 shifted headers; drop (synthetic sequence, headless native drop not delivered) gives name, status, project, assignee; 21 animations on the moved column: pass
  - locked Name (D21): body cell `::after` repeating-linear-gradient at opacity 1 while dragging, dragover dropEffect none (not-allowed), Name menu has disabled "Fixed position": pass
  - overflow (D22) at 1200 px wide: pinned-end edge cells carry the drop-shadow filter, hovering shows Scroll right; a click on the lower half scrolls 882 px of 1102 px visible unpinned width (ratio 0.800); a click at the chevron's centre does not scroll: fail (Attention)
  - search (D35): toggle focuses the field, "Design" filters to 26 rows, one toggle click clears and closes (50 rows), 0 `[aria-label=Clear search]` in the field: pass
  - actions column (D14): last column `st-row-actions`, th and td `position: sticky`, `right: 0px`, 48 px, horizontal dots (lucide `ellipsis`, tabler `dots`, phosphor dots-three), menu Edit, Duplicate, Delete: pass
  - persisted page (D36): after a reorder the stored order is name, status, project, assignee; on reload `data-st-view-pending` observed before DOMContentLoaded (base 104 of 106 ms, radix 115 of 117 ms, aria 83 of 94 ms) with `aria-busy="true"`, removed at 417, 412, 370 ms, then absent with no `aria-busy`; restored order matches: pass
  - RTL page: `direction: rtl`, Name th 1515 to 1775, resize handle 1511 to 1519 (inline-end edge), th and td sticky with `inset-inline-start: 0px`, drag resize 260 to 320 px: pass
- Console (`agent-browser console` and `errors` collected before every navigation): base 0 warnings, 0 errors; radix 0, 0; aria 58 warnings, 0 errors, all "<Focusable> child must be focusable. Please ensure the tabIndex prop is passed through." (20 while the filter chip editor is open, 38 while the sort editor is open; 18 the moment Due is chosen in the sort picker); `next dev` logs 0 warnings, 0 errors in all three
- Judge verdicts: pending (main session)

## Notes

- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/base-default-light.png
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/base-default-dark.png
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/radix-default-light.png
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/radix-default-dark.png
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/aria-default-light.png
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/07/aria-default-dark.png
- Stopped: the three `next dev` servers (5341, 5342, 5343) and the agent-browser sessions; the 5310 registry left running (P4); gate apps deleted after the run

## Attention

- D22 scroll chevron, all bases (spec 02): `ST_ScrollButtons` button carries `active:not-aria-[haspopup]:translate-y-px` from `buttonVariants`, which replaces `-translate-y-1/2` on press: the chevron jumps from y 109 to 122, the pointer at its centre then hits the header cell and the click does not scroll; only the lower half works
- Aria React Aria warnings (spec 04): 58 "<Focusable> child must be focusable" warnings while the filter chip editor and the sort editor are open (18 on choosing Due in the sort picker); each sort rule renders its drag handle as a non-focusable `span[role=img]` (unverified as the source)
