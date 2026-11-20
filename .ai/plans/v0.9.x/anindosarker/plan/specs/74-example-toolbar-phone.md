# 74: Example toolbar on a phone
- Epic: E21

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On a phone the toolbar above a docs example wraps into three rows of different lengths: previous, the example name and next; then Preview, Code, Both and the base switcher; then Storybook, Copy prompt with its arrow, and full screen (Q145, the owner's phone capture of `/docs/examples/basic` on 0.9.7). The owner picked variant A of `reference/q145-example-toolbar-phone.excalidraw`: two rows, with the actions behind one More button (D156). The toolbar is one component, `ExamplePlayground`, used by example pages, story pages and guide panels, so the change is made once there. Desktop and tablet keep today's layout.

### 1.2 Goals

- At phone width the toolbar has two rows. Row 1: previous, the example name stretched between the two arrows, next. Row 2: Preview, Code, Both, the base switcher, and a More button at the right end (D156).
- The More button opens the stock dropdown menu with labelled entries, in this order: Open in Storybook, Copy prompt, Copy install command, Fullscreen (D156). The entries the arrow menu has today (Open in GitHub, the two "soon" entries) follow after a separator, so a phone reader loses nothing.
- An entry a page does not have today is left out there too: a story page has no Copy prompt and no install command (`example-playground.tsx:59-73`).
- A panel without a switcher (a plain guide panel) has no row 1 on a phone beyond what it shows today in that place; row 2 is the same everywhere.
- Phone width is below Tailwind's `sm` breakpoint. From `sm` up, and inside guide panels by their container rules, the toolbar is as it is today, markup order and classes included.
- Acceptance: variant A of `reference/q145-example-toolbar-phone.excalidraw` for the phone layout; a capture of `claude/review` before the change at 390 wide (`/docs/examples/basic`, taken in Task 1) for the before; the previous release (0.9.7) at 1440 and 768 wide for desktop and tablet, which must not change. Programmatic: the new checks of 1.6.3 pass on the three bases.

### 1.3 Current structure

```
apps/shadcn-table-docs/components/example-playground.tsx:327-336  ← <header>: flex-wrap, justify-between; guide panels one row from @xl
apps/shadcn-table-docs/components/example-playground.tsx:337      ← {switcher}: ExampleSwitcher on example pages, the picker or link in guide panels
apps/shadcn-table-docs/components/example-playground.tsx:338-343  ← the right-hand group, `ml-auto flex flex-wrap`
apps/shadcn-table-docs/components/example-playground.tsx:344-362  ← view mode group (Preview, Code, Both)
apps/shadcn-table-docs/components/example-playground.tsx:364-367  ← BaseSwitch
apps/shadcn-table-docs/components/example-playground.tsx:368-482  ← "Open example" group: Storybook link, Copy prompt, the arrow menu (`aria-label="More actions"`: Copy install command, Open in GitHub, two "soon" entries)
apps/shadcn-table-docs/components/example-playground.tsx:484-509  ← full screen button with its tooltip
apps/shadcn-table-docs/components/example-switcher.tsx:44,55,92-109 ← previous, the name select (`min-w-0 shrink`), next
apps/shadcn-table-docs/app/global.css:256-272                     ← the header's rule, group and step button sizes
apps/shadcn-table-docs/components/story-example.tsx:136           ← story pages render the same ExamplePlayground
test/docs-e2e/lib/helpers.mjs:294,333                             ← helpers that find the full screen button and the More actions button
test/docs-e2e/lib/examples.mjs, guides.mjs                        ← the toolbar checks, at desktop width
```

### 1.4 Target structure

```
components/example-playground.tsx  ← phone: row 2 ends in the More button; Storybook, Copy prompt and Fullscreen are entries of that one menu; from `sm` unchanged
components/example-switcher.tsx    ← phone: the row spans the toolbar and the name select takes the space between the arrows
app/global.css                     ← only when a rule there fights the phone layout (the fixed step sizes stay)
test/docs-e2e/lib/{examples,guides,helpers}.mjs ← + the phone checks; the helpers find the controls at both widths
CHANGELOG.md                       ← `#### Spec 74` under `## Unreleased`, `### Docs` (P9)
```

### 1.6 Components

#### 1.6.1 Layout (D156)

- Row 1 on a phone is the switcher alone, as wide as the toolbar; in `ExampleSwitcher` the name select grows to fill the space between the previous and next buttons and truncates a long name.
- Row 2 on a phone is the view mode group, the base switcher, and the More button pushed to the right end.
- Sizes come from the content and the space left: stock Tailwind utilities and the `sm` breakpoint only, no pixel or rem width for a row or a control, no JavaScript that reads the viewport (`matchMedia`, a resize listener). The two layouts are one markup with responsive classes.
- From `sm` up nothing moves: the Storybook link, Copy prompt, the arrow menu and the full screen button render where they are today.

#### 1.6.2 The More menu (D156)

- One `DropdownMenu`, the one that exists (`aria-label="More actions"`). On a phone its trigger is the More button of row 2, with the stock horizontal dots icon; from `sm` it is today's arrow inside the "Open example" group.
- On a phone the menu starts with the entries that leave the row: Open in Storybook (the same link, target and `trackStorybookOpened` call as the button), Copy prompt (the same `copy('prompt', …)` call, reads "Copied" after it like the install entry, menu stays open), then today's Copy install command, then Fullscreen (calls `toggleFullscreen`, reads "Exit fullscreen" while the panel is full screen, closes the menu). After a separator: today's remaining entries, unchanged.
- Those phone-only entries are hidden from `sm` up, where the buttons exist; the buttons are hidden on a phone. No handler is written twice: each entry calls the function its button calls.
- Leaving full screen on a phone: the same menu entry, and Escape as today.
- Does NOT change the menu's desktop content or order, the copy events, the Storybook address, the full screen behaviour or its tooltip on desktop, the guide panels' container rules, `BaseSwitch`, or the view modes. Does NOT add a dependency or a new component file.

#### 1.6.3 Checks (P11)

- New checks in `test/docs-e2e/lib/examples.mjs`, at 390 wide on `/docs/examples/basic` and on one story page:
  - `phone toolbar: two rows`: the visible controls of the panel header sit on exactly two distinct rows; row 1 holds previous, the name select and next, and the select's right edge is next to the next button; row 2 holds the view mode group, the base switcher and the More button, whose right edge is at the header's content edge.
  - `phone toolbar: More menu`: the More button opens a menu whose entries read, in order, Open in Storybook, Copy prompt, Copy install command, Fullscreen, then the old entries (on the story page: without the two entries that page does not have); no Storybook, Copy prompt or full screen button is visible in the header.
  - `phone toolbar: Fullscreen entry`: the entry sets `data-fullscreen` on the panel; the entry then reads Exit fullscreen and removes it.
- One check in `test/docs-e2e/lib/guides.mjs`, at 390 wide on one guide with a panel: `phone toolbar: guide panel`, row 2 as above and the More menu opens.
- One check at 1440 and one at 768 wide on `/docs/examples/basic`: `toolbar: desktop unchanged`, the Storybook link, Copy prompt, the arrow and the full screen button are visible in the header and the menu holds today's entries only.
- The helpers of `helpers.mjs` that find the full screen button and the More actions button work at both widths.
- Each new phone check is run once on `origin/claude/review` before the change and must fail there; the failure lines go to the tracker with the 390 capture named in 1.2, saved as `.ai/plans/v0.9.x/anindosarker/reference/q145-before-390.png` (P10).
- After the change: captures at 390 of `/docs/examples/basic` with the menu closed and open, saved beside it as `q145-after-390.png` and `q145-after-390-menu.png`, and compared by the builder with variant A of the diagram; the tracker says in one line each what matches and what differs.
- `CHANGELOG.md`: `#### Spec 74` under `## Unreleased`, `### Docs`, one line: on a phone the example toolbar is two rows with a More menu.

**Stays unchanged:** every registry file and `public/r/` (P7), `components/ui-<base>/` (P9), `components/base-selector.tsx`, `components/agent-bar.tsx`, `components/story-example.tsx`, `package.json` and the lockfile.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Example toolbar on a phone

- Files owned: `apps/shadcn-table-docs/components/example-playground.tsx`, `apps/shadcn-table-docs/components/example-switcher.tsx`, `apps/shadcn-table-docs/app/global.css`, `test/docs-e2e/lib/examples.mjs`, `test/docs-e2e/lib/guides.mjs`, `test/docs-e2e/lib/helpers.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`, the last three one at a time (P5)
- Task 1: The checks of 1.6.3, run red on `origin/claude/review`, and the before capture. Checks: the four phone checks fail and `toolbar: desktop unchanged` passes at 1440 and 768, each line in the tracker; `.ai/plans/v0.9.x/anindosarker/reference/q145-before-390.png` exists and is committed
- Task 2: The layout and the menu (1.6.1, 1.6.2). Checks: `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` green with the four phone checks and `toolbar: desktop unchanged` in the passed list; `grep -c -E 'matchMedia|innerWidth|resize' apps/shadcn-table-docs/components/example-playground.tsx apps/shadcn-table-docs/components/example-switcher.tsx` prints the counts of `origin/claude/review`; `pnpm test typecheck --base radix` and `pnpm test lint` green
- Task 3: The after captures, the comparison with variant A, and the changelog block (1.6.3). Checks: the two after captures exist and are committed, with the two comparison lines in the tracker; `grep -c '^#### Spec 74' CHANGELOG.md` prints `1`; `pnpm test validate-repo` green

### 2.2 Checks

- Example toolbar on a phone: the red phone checks before, docs E2E green on the three bases after, the desktop and tablet check unchanged, typecheck, lint, validate-repo
- Review: none (docs site chrome, no library file, no public API)
- Known flakes of the docs E2E, rerun once before calling a check failed: the getting-started `/` theme and perf checks under load (P5)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2)
