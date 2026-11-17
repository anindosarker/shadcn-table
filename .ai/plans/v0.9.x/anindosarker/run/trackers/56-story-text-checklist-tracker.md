# 56: Story text checklist, tracker

Status: done
Branch `v0.9/story-text-checklist`, worktree 05 (from `origin/v0.9/docs-layout` at 7e13af53, D109)
Checks:

- Task 1 at 7e13af53: `ls apps/shadcn-table-docs/content/docs/examples/more/*.mdx | wc -l` 594 = 127 + 109 + 109 + 115 + 71 + 63 (the six globs); `grep -L "TryIt"` and `grep -L "## Related guides"` on more/*.mdx print nothing; every page has a non-empty `description`: pass
- `pnpm test validate-repo` at 08ab12e5: pass (594 story pages)
- `pnpm test validate-repo` with the Try it block of more/basic--default.mdx removed: fail, "page more/basic--default.mdx: no "### Try it" heading with a <TryIt> block; ..."; reverted
- `pageParts` probe (empty description, 6 steps, text between </TryIt> and the story, no guide link): each named as a problem
- `node lib/story-text-checklist.mjs <main checkout>/.ai/plans/v0.9.x/anindosarker/reference/docs-layout/story-text-checklist.md` at 08ab12e5: 594 lines, in more/meta.json order (script compare): pass; second run: unchanged
- P11, the three new plays on the stories before the fix (2197328c reverted in the three story files), `ST_BASE=base vitest run` filtered to the three: 3 failed; restored
- The three new plays, `ST_BASE=<base> vitest run` filtered to the three, at 8768c856: base, radix, aria 3 passed each
- `pnpm test typecheck --base radix` at 4bcd5130: first run failed, cause not kept (record overwritten); two reruns: pass (tsc clean)
- `pnpm test lint` at 4bcd5130: pass (9 warnings, none in changed files)
- `pnpm test validate-repo` at 4bcd5130: pass
- `pnpm test storybook-tests --base base` at 4bcd5130: pass (636)
- `pnpm test storybook-tests --base radix` at 4bcd5130: pass (636)
- `pnpm test storybook-tests --base aria` at 4bcd5130: pass (636)
- `pnpm test docs-e2e --base base` at 4bcd5130: pass (runs `pnpm --filter shadcn-table-docs build`; examples 1101 passed, 0 failed); no server left on 5340 to 5360

- Task 1 no page left bare: done (no change needed, 7e13af53)
- Task 2 three parts in the parity check: done (08ab12e5)
- Task 3 checklist: done (08ab12e5; checklist committed on claude/review)
- Task 4 cleanup: done (4bcd5130; review leftovers f2f76b14, 8768c856)

## Notes

- Fix milestone (Story and docs fixes found while writing the story texts) changed two config files outside its Files owned list: `apps/shadcn-table-docs/tsconfig.ui-aria.json` and `apps/shadcn-table-docs/tsconfig.ui-base.json`, needed to type-check the story copies.
- The page lines that milestone reworded, read against the four criteria of D104 (wording, no slop, no unnecessary jargon, short enough); all pass, none rewritten: click-to-copy-disabled-per-column description and steps 1 to 3; column-grouping-enabled-custom-aggregate description and step 2; enable-row-numbers-original and enable-row-numbers-original-virtual descriptions; columns-hold-while-dragging and columns-hold-while-resizing descriptions; color-sort-icon description and step 1; disable-full-screen-toggle step 1.
- On aria, in the vitest browser, the First Name copy button (57.5px) is wider than its overflow span (50px), so a hover opens the cell's overflow tooltip (the name) and not `Click to copy`; base and radix show `Click to copy`. The Click To Copy Disabled Per Column play checks the tooltip by keyboard focus, as Click To Copy Enabled does. Not checked at desktop width in the docs; step 1 of that page says "Hover".

## Attention
