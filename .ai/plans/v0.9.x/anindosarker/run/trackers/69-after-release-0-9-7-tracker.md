# 69: Release 0.9.7, After release 0.9.7, tracker

Status: done (42cbe04f)
Branch `master`, worktree 03 for Task 3 (detached, operations only)
Checks:
- Check: release.yml, run 44477578442 at f88bb263: Check Release, Verify Deployment, Validate Production, Publish Release all `success`
- Check: tag, `git ls-remote --tags origin v0.9.7` at f88bb263: one line (f88bb263), pass
- Check: release, `gh release view v0.9.7 --json tagName --jq .tagName`: `v0.9.7`, pass
- Check: version files, `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.7`, pass
- Check: live docs header, `https://www.shadcn-table.com/docs/examples/basic` at 1440: pass. Read `v0.9.7`, href `https://github.com/anindosarker/shadcn-table/releases`; the next link after the home link `//shadcn-table`, not inside it; visible
- Check: live docs header, `https://www.shadcn-table.com/docs/examples/basic` at 390: pass. Same text and href, visible
- Check: live docs header, `https://www.shadcn-table.com/` at 1440 and at 390: fail. No version text on the page: the home page has its own header (`header.v4-nav`) without the label; reloaded with the cache off, same. Card Q141, no fix on `master` (spec 1.6.3)
- Check: live Storybook toolbar (D150 in place of the title check of 1.6.3, per the lead's brief `reference/q138-storybook-toolbar-version/brief.md`), `https://storybook.shadcn-table.com/base/?path=/story/basic--basic`: pass. Toolbar item `v0.9.7`, a link, href ends in `/releases`, the next item after the base switcher; title `shadcn-table (Base UI)`
- Check: live Storybook toolbar, `/radix/`: pass. `v0.9.7`, same href, after the switcher; title `shadcn-table (Radix UI)`
- Check: live Storybook toolbar, `/aria/`: pass. `v0.9.7`, same href, after the switcher; title `shadcn-table (React Aria)`
- Check: branches, `git rev-parse origin/claude/review origin/dev origin/master`: `claude/review` 42cbe04f (`merge: master 0.9.7`), `dev` and `master` f88bb263. Not one sha three times: `claude/review` carries plan commits and the play fix 07c626e9 past `master`, as for 0.9.6
- Check: `git ls-remote --heads origin v0.9/filter-input-fixes v0.9/docs-version-label`: two lines, pass
- Check: validate-repo, `pnpm test validate-repo` at 42cbe04f: pass

- Task 1: done (f88bb263, run 44477578442)
- Task 2: done (f88bb263); 7 of 9 live reads pass, the home page has no label (Q141); browser closed
- Task 3: done (42cbe04f)

## Attention

## Notes

- 0.9.7 does not hold the play fix 07c626e9 (`69 Click to copy play passes in CI`): it merged into `claude/review` after `dev` was fast-forwarded to a328a4c0. Test-only; it ships with the next release.
- At 390 wide the Storybook toolbar item `v0.9.7` ends past the right edge (365 to 413), with two of Storybook's own buttons: fact on card Q139.
- process.md P5 still lists `ClickToCopy` "Click Copies Value" (base, radix) as a known flake; the play fix removes its cause (tracker `69-click-to-copy-play-passes-in-ci`). The line is the lead's to drop.
