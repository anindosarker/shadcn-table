# View settings icons (D75), tracker

Status: merged (f4251455)
Branch `v0.8/fix-view-icons`, worktree 02, no PR (P13)
Files owned: `icons.ts` in the three bases
Depends on: 06.3
Checks:
- `pnpm check:icons` at 88171214: green (54 keys, 0 problems in 4 maps per base)
- `pnpm check:bases` at 88171214: green
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at 88171214: green
- `pnpm lint` at 88171214: green (0 errors, 9 docs warnings)
- `pnpm --filter shadcn-table check:tailwind` at [commit]: [result]
- ViewSettings, Toolbar, DensePadding stories per base at 88171214: green (3 files, 34 tests each base)

- Milestone 01 D75 diff applied to the three bases: done (88171214)

## Notes

- D75's diff applied with `git apply` per base (paths substituted); the drawn glyph file stays for the editions. Main session, P12 and P13.
