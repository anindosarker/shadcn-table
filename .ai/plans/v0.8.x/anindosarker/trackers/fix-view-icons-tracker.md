# View settings icons (D75), tracker

Status: running
Branch `v0.8/fix-view-icons`, worktree 02, no PR (P13)
Gates:
- `pnpm check:icons` at [commit]: green (54 keys, 0 problems in 4 maps per base)
- `pnpm check:bases` at [commit]: green
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at [commit]: [result]
- `pnpm lint` at [commit]: [result]
- `pnpm --filter shadcn-table check:tailwind` at [commit]: [result]
- ViewSettings, Toolbar, DensePadding stories per base at [commit]: [result]

- Milestone 01 D75 diff applied to the three bases: done ([commit])

## Notes

- D75's diff applied with `git apply` per base (paths substituted); the drawn glyph file stays for the editions. Main session, P12 and P13.
