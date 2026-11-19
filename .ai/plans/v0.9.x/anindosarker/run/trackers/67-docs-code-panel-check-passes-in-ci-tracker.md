# 67: Docs code panel check passes in CI, tracker

Status: running
Branch `v0.9/docs-code-panel-check-ci`, worktree 08
Cause: a check defect, no product defect. fumadocs DynamicCodeBlock shows its Placeholder (bare `span.line`, no newline between lines) until Shiki highlights; on the slow CI runner two reads agreed on it. Every CI FAIL text equals the story's expected text with the newlines removed (all 20 FAIL lines of the three logs compared). Fix: the check waits for Shiki's token spans (`code .line > span`, up to 60 s, else a named FAIL) before reading; comparison unchanged. No CHANGELOG line (check only).
Reproduction: act not used: the docs-e2e job needs pnpm install, a full docs build and Chromium in the amd64 act image under emulation on this arm64 Mac, too slow and heavy for the shared machine. Instead the unchanged check (`node test/run.mjs docs-e2e --base base --url <host> /docs/examples/more/features-aggregation--aggregation`) ran in a Linux container (`mcr.microsoft.com/playwright:v1.64.1-noble`, `--cpus=2`, Linux oxc/lightningcss/tailwind/esbuild bindings via NODE_PATH from a scratch dir) against `next start` of this worktree's production build.
Checks:
- Check: reproduction before the fix, Linux container check at 6a1e09c4: fail (594 of 599, basic--default and the aggregation pages among the 5, text without newlines as in CI, 291 s)
- Check: reproduction after the fix, same container run at ec56d00f: pass (599 of 599, 321 s)
- Check: typecheck, `pnpm test typecheck --base radix` at ec56d00f: pass
- Check: lint, `pnpm test lint` at ec56d00f: pass (9 warnings, none new)
- Check: validate-repo, `pnpm test validate-repo` at ec56d00f: pass
- Check: docs-e2e base, `pnpm test docs-e2e --base base` at ec56d00f: pass (117 pages; panels 599 of 599, 70 s)
- Check: docs-e2e radix, `pnpm test docs-e2e --base radix` at ec56d00f: pass (117 pages; panels 599 of 599, 74 s)
- Check: docs-e2e aria, `pnpm test docs-e2e --base aria` at ec56d00f: pass (117 pages; panels 599 of 599, 78 s)

- Task 1 Docs code panel check passes in CI: ec56d00f
