# Bundle analyzer wrap (D63), tracker

Status: done
Files owned: `apps/shadcn-table-docs/next.config.mjs`, `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`
Depends on: none
Branch `v0.9/fix-bundle-analyzer-wrap`, worktree `../shadcn-react-table.worktrees/06`
Checks:
- Check: grep, `grep -c bundle-analyzer apps/shadcn-table-docs/next.config.mjs apps/shadcn-table-docs/package.json` at 02db8a92: pass (0, 0)
- Check: lockfile, `grep -c '@next/bundle-analyzer' pnpm-lock.yaml` at 02db8a92: pass (0)
- Check: docs types, `pnpm --filter shadcn-table-docs types:check` at 02db8a92: pass
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 02db8a92: pass
- Check: typecheck, `pnpm test typecheck --base base` at 02db8a92: pass
- Check: lint, `pnpm test lint` at 02db8a92: pass (0 errors, 9 warnings)
- Check: validate-repo, `pnpm test validate-repo` at 02db8a92: pass

- Task 1 remove analyzer wrap and devDependency: done (02db8a92)

Notes:
- No CHANGELOG block: CHANGELOG.md never mentioned the analyzer.
- The lockfile diff also moves the optional wasm peer pick of rolldown-vite from @emnapi 1.11.0 to 1.9.2; that is pnpm's own re-resolution in the one `pnpm install`.
