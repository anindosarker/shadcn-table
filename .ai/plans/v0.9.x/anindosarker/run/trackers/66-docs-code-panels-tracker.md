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

- Task 1: done, 55d8f0d7
- Task 2: done, 5e7424c8
- Task 3: done, 5e7424c8 (no other change: the 15 failing guide Example items render through the same StoryExample path)
- Task 4: planned
- Task 5: planned

## Attention

## Notes

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
