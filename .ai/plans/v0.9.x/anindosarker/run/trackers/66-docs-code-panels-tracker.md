# 66: Code panels show the table's code, Docs code panels, tracker

Status: running
Branch `v0.9/docs-code-panels`, worktree 08
Checks:
- Check: Task 1 reading check on the shipped panels (P11), `pnpm test docs-e2e --base base --widths 1440 /docs/examples/more/features-aggregation--aggregation` (production docs build of the branch point 8859af54, built and served by the run; check file of 55d8f0d7 uncommitted beside it): fail as required, 0 of 599 story code panels show the story's own text (584 story pages, 15 guide items), every one shows the whole story file; reading 98 s
- Check: typecheck radix, `pnpm test typecheck --base radix` at 0753964b plus the Task 2 files: tsc clean
- Check: lint, `pnpm test lint` at 0753964b plus the Task 2 files: pass, 9 warnings (docs examples advanced and expanding-tree-flat-parse, not this milestone's files)
- Check: unit, `node --test tools/story-source/extract.test.mjs` at 0753964b: 3 pass; story texts of all 626 stories on base, radix and aria equal before and after the extractor repairs (in-memory compare against 55d8f0d7's extract.mjs): 0 differ
- Check: docs-e2e base, `pnpm test docs-e2e --base base` at 96b4acda (build by the run): fail, 599 panels "text differs" (the reader used innerText, which drops the empty lines of the flex-column code); reader fixed to textContent at 5e7424c8
- Check: docs-e2e base, `pnpm test docs-e2e --base base --url <next start of the 96b4acda build>` with the check of 5e7424c8: pass, 5 sections, 117 pages, 0 failed; story code panels 599 of 599 (584 story pages, 15 guide items), reading 69 s; guides 1056 passed (production-ready-tables 5 files in the tree); server stopped
- Check: docs-e2e reading check radix and aria, `pnpm test docs-e2e --base radix|aria --widths 1440 --url <same server> /docs/examples/more/features-aggregation--aggregation` at 5e7424c8: pass each, 599 of 599, reading 75 s (radix), 70 s (aria); server stopped
- Check: validate-repo, `pnpm test validate-repo` at 5e7424c8: pass, story-source 626 of 626 with a code text, 0 problems, 43 unit tests (3 new)
- Check: format, `pnpm format` at 5e7424c8 plus CHANGELOG.md: only CHANGELOG.md of this milestone; it also rewrote `test/docs-e2e/lib/site.mjs` (not owned) and `reference/code-panels/read-panels.mjs` (P8), both reverted
- Check: Task 4 audit rerun, Storybook, `pnpm --filter shadcn-table storybook:build:base` at 2543c800, then `node read-panels.mjs storybook <python http.server>`: 626 ids read in 1081 s; 624 pass, 2 "other" (no table in the story), 0 fail; server stopped
- Check: Task 4 audit rerun, docs, `node read-panels.mjs docs <next start of the 96b4acda build> --pages <225 pages>` three times (docs app unchanged to 2543c800): 673 pages, all 200, 881 s; story pages 582 pass and 2 "other" (same two stories), guide story items 15 of 15 pass, every other kind unchanged at 0 fail; servers stopped
- Check: 2.2 library untouched, `git diff origin/master --stat -- packages/shadcn-table/registry apps/shadcn-table-docs/examples registry.json` at 2543c800: prints nothing
- Verifier, 2026-11-19, at 2543c800 from a clean tree, each through heavy.sh one at a time. Not rerun: typecheck radix (recorded tree equals HEAD for TypeScript), validate-repo and docs-e2e base (5e7424c8..HEAD is CHANGELOG.md only), 2.2 library diff (recorded at HEAD); lint recorded green before the one-line reader change of 5e7424c8, left to CI with tsc
- Check (verifier): docs build, `pnpm --filter shadcn-table-docs build` at 2543c800: pass
- Check (verifier): docs-e2e radix, `pnpm test docs-e2e --base radix --url <next start of that build on 5340>`: pass, 5 sections, 117 pages, 0 failed; story code panels 599 of 599 (584 story pages, 15 guide items), reading 71 s; guides 1056 passed; whole run 391 s; server stopped
- Check (verifier): docs-e2e aria, same build and port: pass, 5 sections, 117 pages, 0 failed; story code panels 599 of 599, reading 74 s; guides 1056 passed; whole run 393 s; server stopped
- Check (verifier): storybook-static base, `pnpm test storybook-static --base base` (build by the run): pass, Code tab 626 of 626 equal, reading 382 s
- Check (verifier): storybook-static radix: pass, 626 of 626, reading 380 s
- Check (verifier): storybook-static aria: pass, 626 of 626, reading 381 s
- Check (verifier): storybook-tests base, radix, aria, `pnpm test storybook-tests --base <base>` one at a time: pass, 626 passed each (85 files)
- Check (verifier): Acceptance 1.2 at 2543c800: green, validate-repo and docs-e2e base by the recorded runs at 5e7424c8 (CHANGELOG.md only since), storybook-static, docs-e2e radix and aria, storybook-tests by the verifier above; audit rerun all failing rows pass (Task 4 lines above)

- Task 1: done, 55d8f0d7
- Task 2: done, 5e7424c8
- Task 3: done, 5e7424c8 (no other change: the 15 failing guide Example items render through the same StoryExample path)
- Task 4: done, 2543c800 (audit.md rerun section, plan commit c1286cd9)
- Task 5: done, 2543c800

## Attention

- Judgment: two stories read "other", not "pass", in the audit rerun (Storybook and docs): `features-table-provider--no-provider-throws` and `features-view-settings--edition-icons-render` render no table (a pagination part without its provider, an icon grid). Their panels show the story's complete code and no test, which is D142's measure; the reader's class needs `ShadcnTable` or `useShadcnTable`. Taken as meeting D142, as validate-repo's story-source check already allows the icon grid. Revert: give the two stories a table, or drop them.
- `test/docs-e2e/run.mjs` (not owned) lists no `tools/story-source/**` path, so `pnpm test --changed` skips docs-e2e when only the extractor changes, although the docs story panels are built from it now (lib/story-variants.mjs). One line for the lead.
- `pnpm format` rewrites `test/docs-e2e/lib/site.mjs` on claude/review at 8859af54 (unformatted there already); left as is, not owned.

## Notes

- Reading check run time per base: about 70 s for 599 panels (4 tabs), inside the examples section of docs-e2e; the full docs-e2e base run with it was 6 min 30 s against a served build. Coverage is every story page and every guide story item, nothing sampled.
- Extractor repairs (0753964b): a story object with `render() {...}` throws "a story writes render as a method"; package imports are merged per module and import kind across the story file and the story files it imports from; `tools/story-source/extract.test.mjs` (3 tests: args without render, relative import from another story file with one library import line, render as a method) runs in validate-repo's unit step through its `tools/**/*.test.mjs` glob. All 626 texts on the three bases are unchanged by the repairs.
- `stories/.<base>/sources.json` now exists for every base (about 1.4 MB each): the texts name `ST_BASE` per base, so the docs Code view shows the text of the base the reader selected, as each Storybook does.

- Task 1 ran on a production build of the branch point 8859af54, not origin/master: the check imports tools/story-source/extract.mjs, which master (0.9.5) does not have; the docs panels at 8859af54 are the 0.9.5 code (whole story file), with the 19 merged copies gone. First lines of a failing panel, `/docs/examples/more/basic--default`: `import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';` / `import { expect, within } from 'storybook/test';` / `import {`.
- The reading check sits on the `/docs/examples/more/features-aggregation--aggregation` entry of test/docs-e2e/lib/examples.mjs (storyCodePanels): every page of more/meta.json plus every `more/<id>` slug of a guide's `<GuideExamples>` except the codeFrom story (D131), opened in Code view, 4 tabs in one context, compared with `storySources({ base })` after trimming line ends; one FAIL line per failing panel. Run time about 70 s per base (599 panels), inside the examples section.
- Guide Example items after the fix (Task 3), first three lines of each panel (base; the reading check proved each equals its text):
  - /docs/guides/click-to-copy (features-click-to-copy--click-to-copy-enabled-with-copy-button-props): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import { Building2Icon, MailIcon, UserIcon } from 'lucide-react';` / ``
  - /docs/guides/column-hiding (features-column-hiding--column-hidden-on-load): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import {` / `MailIcon,`
  - /docs/guides/column-resizing (features-column-resizing--column-widened-on-load): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import {` / `MailboxIcon,`
  - /docs/guides/column-size (styling-custom-column-widths--custom-widths-semantic): `import { ShadcnTable } from '@/components/ui/shadcn-table';` / `import { CakeIcon, HashIcon, MapPinIcon, UserIcon } from 'lucide-react';` / `import { faker } from '@faker-js/faker';`
  - /docs/guides/customize-icons (features-icons--provider-icon-set): `import {` / `type ST_ColumnDef,` / `ST_DefaultsProvider,`
  - /docs/guides/density-toggle (features-dense-padding--default-to-dense-padding): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import {` / `Building2Icon,`
  - /docs/guides/display-columns (styling-styling-display-columns--customize-display-columns): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import { Button } from '@/components/ui/button';` / `import { CakeIcon, MapPinIcon, UserIcon } from 'lucide-react';`
  - /docs/guides/filter-chips (features-filter-chips--chips-seeded): `import {` / `type ST_ColumnDef,` / `type ST_TableOptions,`
  - /docs/guides/global-filtering (features-search--searched-on-load): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import {` / `CakeIcon,`
  - /docs/guides/localization (features-localization--spanish): `import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';` / `import {` / `ST_Localization_ES,`
  - /docs/guides/overflow-tooltip (styling-default-look--overflow-tooltip): `import {` / `type ST_ColumnDef,` / `type ST_TableOptions,`
  - /docs/guides/row-actions (features-row-actions--custom-row-action-buttons): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import { Button } from '@/components/ui/button';` / `import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';`
  - /docs/guides/sort-editor (features-sort-popover--sort-popover-seeded): `import {` / `type ST_ColumnDef,` / `type ST_TableOptions,`
  - /docs/guides/sorting (features-sorting--sorted-on-load): `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import { Building2Icon, DollarSignIcon, MapIcon, UserIcon } from 'lucide-react';` / ``
  - /docs/guides/toolbar-customization (features-toolbar--custom-top-toolbar-actions): `import {` / `type ST_ColumnDef,` / `ST_Tooltip,`
