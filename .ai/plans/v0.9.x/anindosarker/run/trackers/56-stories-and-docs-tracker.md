# 56: Story pairing audit, tracker

Status: merged 7022d816
Branch `v0.9/story-pairing-audit`, worktree 05
Checks:
- Check: rows of lists 1 to 3, `grep -c "^| [0-9]" story-pairing-audit.md` at Task 1 commit: pass (42: exact 0, close 34, no partner 8)
- Check: exact rows name one story each, none twice: pass (list 1 empty; no story shares an example's rows, columns and options, read per example in `examples/base/<name>/` against the stories of its feature)
- Check: list 4 rows, a TypeScript-AST script (scratchpad `stories.mjs`: parses all 81 story files, keys each story by its body without play/name/tags plus meta args and render, resolves renders that only mount another story, groups equal keys per file) at 0b58a168: pass (652 stories, 269 with a play, 59 groups, 80 rows)
- Check: `Basic` RendersRows and `SearchField` OpenCloseAndEscape in list 4: pass (rows 1 and 77)
- Check: counts header, `sed -n '/^## N/,/^## N+1/p' story-pairing-audit.md | grep -c '^| [0-9]'` per list and `grep -c '| no: merge'` on list 4, story total from `grep -c '^export const'` summed over the 81 story files: pass (new 34+8=42; merge 59; pages 652-59+42-42=593)
- Check (verifier, a0daeddd): recount of lists 1 to 3: pass (exact 0, close 34, no partner 8 = 42; the 42 slugs equal the 42 `content/docs/examples/*.mdx` pages besides `index`, none twice; list 1 empty, so no story named twice)
- Check (verifier, a0daeddd): list 4 recount: pass (80 rows = 59 `no: merge` + 21 `yes: both stay`; 5 `nothing to move`; 59 distinct file and copied-story groups; 12 copied stories receive two or more plays; `Basic` RendersRows row 1, `SearchField` OpenCloseAndEscape row 77)
- Check (verifier, a0daeddd): header formulas: pass (new 34+8=42; copies 59; pages 652-59+42-42=593; 652 `export const` in 81 story files)
- Check (verifier, a0daeddd): five pair spot-checks against sources, close pairs in place of exact pairs since list 1 is empty: pass (`basic` vs fullscreen-with-appbar: same nested-name columns and literal rows; `column-ordering` = `enable-column-ordering`, 5 columns, fixed rows vs ColumnOrderingEnabled 7 columns with email and phone over faker; `faceted-values` `enableFacetedValues` in `enable-filter-facet-values`; `popover-filters` `columnFilterDisplayMode: 'popover'` in `alternate-column-filtering` and PopoverDisplayMode; `column-virtualization` page renders `EnableColumnVirtualizationExample`)
- Check (verifier, a0daeddd): five list 4 spot-checks against sources: pass (row 1 Default `{}` vs RendersRows play only; row 77 PositionRight and OpenCloseAndEscape same render, PositionRight no play; row 12 ColumnOrderingWithPinning same body as ColumnOrderingEnabled, neither has a play; row 41 GridWithResizing same props as Grid; row 69 MaxVirtualization has `MaxVirtualization.play` :414 so both stay; row 5 MenuSortStacks and LabelOpensMenu same render, both with plays)
- Check (verifier, a0daeddd): epic Acceptance of 1.2: not runnable at this milestone (needs the story pages, the parity check and `lib/storybook-map.ts` of the later milestones); the audit part it depends on, an exact story named per example, is empty by design (list 1), recorded under Attention by the builder

- Task 1 lists 1 to 3: done, 0b58a168
- Task 2 list 4: done, ffe3a744
- Task 3 counts header: done, see branch head

## Attention

- List 4 is far larger than the 24 pairs of spec 1.1: 80 rows in 59 groups. Most are a demo story plus test stories that render it (`render: () => <Demo />`). The strict rule of 1.6.3 makes 59 of them merges, so 12 demo stories receive two or more plays, and 5 pure duplicates without any play (`ColumnOrdering` ColumnOrderingWithPinning, `LayoutMode` GridWithResizing and GridNoGrowWithResizing, `Pagination` CustomPaginationPagesDisplayMode, `Virtualization` EnableRowVirtualizationWithColumnResizing) count as merges with nothing to move. The audit applies the rule literally; the owner may want a narrower merge (one copy per story, or plays kept as separate test stories).
- No example has an exact story (spec 1.1 assumed 33 do): every example keeps its own rows, so all 42 need a new story.
