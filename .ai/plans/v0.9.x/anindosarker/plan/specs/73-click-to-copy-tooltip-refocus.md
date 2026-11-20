# 73: Click-to-copy tooltip on refocus
- Epic: E21

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On Radix, a keyboard user who presses Tab away from a click-to-copy button and Shift+Tab back within the tooltip's exit animation (about 150 ms) gets no "Click to copy" tooltip until focus moves again (Q140). The copy button sits inside the cell's overflow text, which is itself a tooltip trigger: the focus reaches that trigger too, its tooltip asks to open, and Radix closes every other tooltip on that request, the copy tooltip that is still closing included. The overflow tooltip never shows in this case (its own check refuses it), so the request is pure damage. This spec stops the request at its source (D151) and checks base and aria for the same case.

### 1.2 Goals

- On Radix, focus that returns to a click-to-copy button within the tooltip's exit animation shows the "Click to copy" tooltip again (D151).
- Base UI and React Aria are checked with the same play; a base that fails gets the same fix, a base that passes is left as it is and the tracker says so (D151).
- The overflow tooltip still shows the full text when the pointer or the focus is on cut-off text outside a button; the copy tooltip on hover is unchanged.
- The docs site's library copies follow the fix (`pnpm lib:install <base>`).
- Acceptance: the previous release (0.9.7) for everything but the refocus case: the existing plays of `ClickToCopy.stories.tsx` and of the overflow text pass unchanged. Programmatic: the new play `Tooltip Returns On Quick Refocus` fails on Radix before the fix and passes on the three bases after it.

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/body/ST_OverflowText.tsx
    radix:54-65   ← controlled `Tooltip`; `onOpenChange` refuses to open while a button inside is hovered or focused (`isCutOff`), but the trigger has already asked
    base:53-67    ← same shape on Base UI (`render` span as the trigger)
    aria:56-75    ← standalone `ST_Tooltip`, opened from the span's own pointer handlers and a timer
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/body/ST_TableBodyCell.tsx:402-412 ← `ST_OverflowText` around `ST_CopyButton`
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/buttons/ST_CopyButton.tsx ← the button and its `ST_Tooltip`
node_modules/@radix-ui/react-tooltip/dist/index.mjs:101,191-213,317 ← the trigger's `onFocus` and `onPointerMove` are composed with the props' handlers; an open request dispatches `tooltip.open`; every tooltip content closes on it
packages/shadcn-table/stories/features/ClickToCopy.stories.tsx ← the click-to-copy plays (the spec 69 fix made "Click Copies Value" wait for the open state)
apps/shadcn-table-docs/components/ui-<base>/shadcn-table/components/body/ST_OverflowText.tsx ← the docs copies, generated (P9)
```

### 1.4 Target structure

```
registry/radix/.../body/ST_OverflowText.tsx   ← the trigger makes no open request for a focus or pointer event that comes from a button inside it
registry/base/..., registry/aria/...          ← the same, only where the play fails
stories/features/ClickToCopy.stories.tsx      ← + play `Tooltip Returns On Quick Refocus`
apps/shadcn-table-docs/components/ui-<base>/shadcn-table/components/body/ST_OverflowText.tsx ← regenerated for each base that changed
CHANGELOG.md                                  ← `#### Spec 73` under `## Unreleased`, `### Fixed` (P9)
```

### 1.6 Components

#### 1.6.1 The play (D151, P11)

- `Tooltip Returns On Quick Refocus`, on the story `ClickToCopyEnabled`: focus the first copy button and wait for its tooltip to be open; Tab away and Shift+Tab back with no wait between the two keys; then the copy button's tooltip is open (the trigger's open state, as the "Click Copies Value" play reads it since spec 69) with the text "Click to copy", within the play's default wait. It reads the open state, never the text of a closing tooltip.
- Run on the code before the fix on the three bases: `ST_BASE=<base> pnpm exec vitest run stories/features/ClickToCopy.stories.tsx`. Radix must fail on this play alone; the result of base and aria decides whether those bases are changed. The three results go to the tracker.

#### 1.6.2 The fix (D151)

- In `ST_OverflowText`, the trigger span stops an open request at the event: its `onFocus` and `onPointerMove` call `event.preventDefault()` when the event's target is inside a `button` of the span. Radix composes its own handler after the props' handler and skips it for a prevented event, so no `tooltip.open` is dispatched and the copy tooltip is left alone. Read in the Radix source (1.3); the builder confirms it with the play, and when the play still fails the tracker names what the source shows instead before another mechanism is tried.
- `isCutOff` and the controlled `open` stay: they still decide whether cut-off text outside a button opens the overflow tooltip.
- Base UI and React Aria: only when the play of 1.6.1 fails there, the same rule with that base's own event API; no change for symmetry alone.
- No timer, no delay, no change to the copy tooltip's animation, no new prop, no new export (P7).
- After the registry change: `pnpm lib:install <base>` in `apps/shadcn-table-docs` for each base that changed; `git status` shows only the `ST_OverflowText.tsx` copy of that base under `components/ui-<base>/`.
- `CHANGELOG.md`: `#### Spec 73` under `## Unreleased`, `### Fixed`, one line: the click-to-copy tooltip shows again when focus returns to the button quickly.
- Does NOT move `ST_CopyButton` out of `ST_OverflowText`, does NOT change `ST_Tooltip`, `ST_CopyButton` or `ST_TableBodyCell`, does NOT touch the other plays of the story file.

**Stays unchanged:** `registry.json` item names and `public/r/` paths (P7), `index.ts` exports, `package.json` and the lockfile.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Click-to-copy tooltip on refocus

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/body/ST_OverflowText.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/body/ST_OverflowText.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/body/ST_OverflowText.tsx`, `packages/shadcn-table/stories/features/ClickToCopy.stories.tsx`, `apps/shadcn-table-docs/components/ui-base/shadcn-table/components/body/ST_OverflowText.tsx`, `apps/shadcn-table-docs/components/ui-radix/shadcn-table/components/body/ST_OverflowText.tsx`, `apps/shadcn-table-docs/components/ui-aria/shadcn-table/components/body/ST_OverflowText.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, one base at a time (P5)
- Task 1: The play, run before the fix (1.6.1, P11). Checks: `ST_BASE=radix pnpm exec vitest run stories/features/ClickToCopy.stories.tsx` fails on `Tooltip Returns On Quick Refocus` and passes every other play; the same command with `ST_BASE=base` and `ST_BASE=aria`, each result in the tracker
- Task 2: The fix on Radix and on each base that failed in Task 1, the docs copies and the changelog line (1.6.2). Checks: the command of Task 1 passes on the three bases, every play; `pnpm test storybook-tests --base <base>` green on the three bases (the overflow text plays included); `pnpm test typecheck` green on the three bases; `pnpm test lint` and `pnpm test validate-repo` green; `git diff --stat origin/claude/review -- apps/shadcn-table-docs/components` lists only `ST_OverflowText.tsx` copies of the changed bases; `grep -c '^#### Spec 73' CHANGELOG.md` prints `1`

### 2.2 Checks

- Click-to-copy tooltip on refocus: the red play on Radix, then the story file and the full Storybook tests green on the three bases, typecheck, lint, validate-repo
- Review: none (one event rule in one component, no public API, no shared state)
- Known flake, rerun once before calling it failed: `ClickToCopy` "Click Copies Value" (base, radix) under load (P5)
