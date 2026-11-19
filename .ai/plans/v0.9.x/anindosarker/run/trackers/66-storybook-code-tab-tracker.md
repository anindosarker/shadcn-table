# 66: Code panels show the table's code, Storybook Code tab, tracker

Status: running
Branch `v0.9/storybook-code-tab`, worktree 08
Checks:
- Check: Code tab read on 0.9.5 (P11), `pnpm --filter shadcn-table storybook:build:base` at detached origin/master da4f513f, then `pnpm test storybook-static --base base --url <served build> --ids 0:215|215:430|430:700` (test at 88aaec58): fail as required, 645 of 645 ids fail (0 pass; 3 slices, 456 s, 452 s, 444 s), `basic--basic` shows its story object with its play (quoted under Notes)
- Check: validate-repo, `pnpm test validate-repo` at 7c280699 (with the Task 3 files uncommitted beside it): pass, story-source 645 stories, 645 with a code text, 0 problems
- Check: typecheck, `pnpm test typecheck --base base` and `--base radix` at 7c280699 plus the Task 3 files, `--base aria` at 35c2af48: tsc clean, each
- Check: stories tsconfig (not in `pnpm test typecheck`; it holds .storybook/), `pnpm exec tsc -p tsconfig.stories.json --noEmit` in packages/shadcn-table at 35c2af48: clean
- Check: eslint on .storybook, `pnpm exec eslint --max-warnings 0 .storybook` in packages/shadcn-table at 35c2af48: clean
- Check: storybook-static base, `pnpm test storybook-static --base base` at 35c2af48: pass, Code tab of 645 of 645 ids read and equal, reading 399 s, whole run 6 min 53 s with the build
- Check: storybook-static radix, `pnpm test storybook-static --base radix` at 35c2af48: pass, 645 of 645, reading 394 s, whole run 6 min 48 s
- Check: storybook-static aria, `pnpm test storybook-static --base aria` at 35c2af48: pass, 645 of 645, reading 399 s, whole run 6 min 53 s
- Check: merged plays, `ST_BASE=base pnpm exec vitest run` on the 10 changed story files at e505b8b3 (before commit): 10 files, 123 tests pass
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at e505b8b3: pass, 626 passed (645 minus the 19 merged copies)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at e505b8b3: pass, 626 passed
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at e505b8b3: pass, 626 passed
- Check: lint, `pnpm test lint` at eb6ced96: pass, 9 warnings (docs app, no limit; package 0)
- Check: validate-repo, `pnpm test validate-repo` at eb6ced96: pass, story pages match (584), story code complete
- Check: typecheck base, `pnpm test typecheck --base base` at eb6ced96: tsc clean; `pnpm exec tsc -p tsconfig.stories.json --noEmit` at eb6ced96: clean
- Check: storybook-static base, `pnpm test storybook-static --base base` at eb6ced96: pass, index.json 626 ids, Code tab 626 of 626 equal, reading 384 s; story pages match index.json 584 pages; servers stopped
- Check: 2.2 library untouched, `git diff origin/master --stat -- packages/shadcn-table/registry apps/shadcn-table-docs/examples registry.json` at eb6ced96: prints nothing

- Check (review fixes): ST_BASE texts per base, `storySources({ base })` for base, radix, aria at fd635b9a, the 15 texts that use ST_BASE compiled in memory under strict: 0 TS2367 on each base (constant `const ST_BASE = '<base>' as 'base' | 'radix' | 'aria';`); every other line of all 626 texts equal to eb6ced96's
- Check (review fixes): `pnpm test typecheck --base base`, `--base radix`, `--base aria` at fd635b9a: tsc clean, each; `pnpm exec tsc -p tsconfig.stories.json --noEmit` and `pnpm exec eslint --max-warnings 0 .storybook stories` in packages/shadcn-table: clean
- Check (review fixes): `pnpm test lint` at fd635b9a: pass
- Check (review fixes): `pnpm test validate-repo` at fd635b9a: pass, story-source 626 stories, 626 with a code text, 0 problems
- Check (review fixes): `pnpm test storybook-tests --base base` at fd635b9a: pass, 626 passed; `--base aria`: pass, 626 passed; `--base radix`: first run 1 failed (`dragging-virtual-when-filtered` "Dragging Row When Filtered", a file this milestone does not touch, row count 2 for 1), rerun pass, 626 passed
- Check (review fixes): `pnpm test storybook-static --base base` at fd635b9a: pass, Code tab 626 of 626, 383 s; `--base radix`: pass, 626 of 626, 380 s; `--base aria`: pass, 626 of 626, 383 s; servers stopped
- Check (verifier, HEAD fd635b9a, clean tree): Local CI recorded green at HEAD (typecheck base, radix, aria; lint; validate-repo; storybook-tests base, radix, aria; storybook-static base, radix, aria; tsconfig.stories and eslint on .storybook and stories), not rerun
- Check (verifier): 2.2 library untouched, `git diff origin/master --stat -- packages/shadcn-table/registry apps/shadcn-table-docs/examples registry.json` at fd635b9a: prints nothing
- Check (verifier): Acceptance 1.2 rerun, `pnpm test validate-repo` at fd635b9a: pass, story pages match (626 stories, 42 example pages, 584 story pages), story-source 626 stories, 626 with a code text, 0 problems; tree clean after
- Check (verifier): Acceptance 1.2, docs side, `pnpm test docs-e2e --base base` at fd635b9a (regression check for the 19 removed more/ pages; the code panel read is the Docs code panels milestone's): pass, 5 sections, 117 pages, 2634 checks, 0 failed, 346 s; server stopped
- Check (verifier): Acceptance 1.2 storybook-static and storybook-tests on the three bases: recorded green at fd635b9a above; docs-e2e radix and aria with the code panel read and the audit rerun belong to the Docs code panels milestone
- Task 1: done, 88aaec58
- Task 2: done, 7c280699
- Task 3: done, 35c2af48
- Task 4: done, e505b8b3
- Task 5: done, eb6ced96

## Attention

- Review fix: `tools/story-source/extract.d.mts` (the type file of extract.mjs, added by this milestone but not on its Files owned line) was edited with the major fix: `storySources({ base })`, `storyCode({ base })`, `TEST_WORDS`, and `usedNames` dropped. Revert: add the path to the milestone's Files owned line, or move the types into extract.mjs JSDoc.
- Review fix: `csfPluginOptions: { disableSource: true }` on addon-docs (main.ts) removes `docs.source.originalSource` for every story, so the Code tab is empty until the code text arrives; anything else that read the original source (docs blocks Source/Canvas "Show code") now gets the emitted text instead. Revert: drop the option from main.ts.
- `dragging-virtual-when-filtered` "Dragging Row When Filtered" (radix) failed once under load at fd635b9a and passed on rerun; not in P5 known flakes.
- The 19 removed story pages under more/ held reviewed text (description, Try it steps, Related guides); story-pages.mjs refused to drop them, so they were deleted by hand and their text was not moved onto the pages of the stories they copied (those keep their own 2 to 4 steps). Revert: restore any page's Try it steps onto its target page from git (e505b8b3^).

## Notes

- Task 4: 13 groups, 19 copies merged exactly as the audit's last list. Each target's play runs its own check, then each copy's play as a `context.step` named after the copy, the story mounted again between steps (`remountStory()` in each file calls `__stRemountStory`, .storybook/preview.tsx, which re-keys ResetAfterPlay and resolves after the commit). The copies' plays are `const <name>Play` in their files. Removed ids and their former addresses (public since 0.9.5, no redirect):
  - `features-column-action--label-opens-menu`: https://www.shadcn-table.com/docs/examples/more/features-column-action--label-opens-menu
  - `features-column-dragging--column-dragging-cancelled`: https://www.shadcn-table.com/docs/examples/more/features-column-dragging--column-dragging-cancelled
  - `features-column-dragging--drop-highlights-column`: https://www.shadcn-table.com/docs/examples/more/features-column-dragging--drop-highlights-column
  - `features-column-resizing--double-click-resets-width`: https://www.shadcn-table.com/docs/examples/more/features-column-resizing--double-click-resets-width
  - `features-column-resizing--drag-resizes-column`: https://www.shadcn-table.com/docs/examples/more/features-column-resizing--drag-resizes-column
  - `features-column-resizing--resize-menu-item-resets`: https://www.shadcn-table.com/docs/examples/more/features-column-resizing--resize-menu-item-resets
  - `features-filtering--chip-editor-escape-keeps-typed-date`: https://www.shadcn-table.com/docs/examples/more/features-filtering--chip-editor-escape-keeps-typed-date
  - `features-filtering--chip-editor-escape-keeps-typed-text`: https://www.shadcn-table.com/docs/examples/more/features-filtering--chip-editor-escape-keeps-typed-text
  - `features-filtering--half-typed-year-applies-nothing`: https://www.shadcn-table.com/docs/examples/more/features-filtering--half-typed-year-applies-nothing
  - `features-filtering--mode-menu-next-to-button-during-popover-animation`: https://www.shadcn-table.com/docs/examples/more/features-filtering--mode-menu-next-to-button-during-popover-animation
  - `features-filtering--mode-menu-next-to-button-popover`: https://www.shadcn-table.com/docs/examples/more/features-filtering--mode-menu-next-to-button-popover
  - `features-row-ordering--drag-reorders-rows`: https://www.shadcn-table.com/docs/examples/more/features-row-ordering--drag-reorders-rows
  - `features-row-ordering--drop-no-slide-reduced-motion`: https://www.shadcn-table.com/docs/examples/more/features-row-ordering--drop-no-slide-reduced-motion
  - `features-virtualization--column-virtualization-scrolls-headers`: https://www.shadcn-table.com/docs/examples/more/features-virtualization--column-virtualization-scrolls-headers
  - `miscellaneous-headless-full-screen--escape-in-search-keeps-full-screen`: https://www.shadcn-table.com/docs/examples/more/miscellaneous-headless-full-screen--escape-in-search-keeps-full-screen
  - `miscellaneous-headless-full-screen--pointer-click-then-escape`: https://www.shadcn-table.com/docs/examples/more/miscellaneous-headless-full-screen--pointer-click-then-escape
  - `miscellaneous-menu-focus-return--show-hide-columns-menu`: https://www.shadcn-table.com/docs/examples/more/miscellaneous-menu-focus-return--show-hide-columns-menu
  - `miscellaneous-menu-openers--show-hide-columns`: https://www.shadcn-table.com/docs/examples/more/miscellaneous-menu-openers--show-hide-columns
  - `styling-render-counts--columns-hold-while-dragging`: https://www.shadcn-table.com/docs/examples/more/styling-render-counts--columns-hold-while-dragging
- Implementation facts: `storyCode({ fileText, exportName, file })` takes one object (the spec writes two arguments; `file` resolves relative imports inside stories/, none exist today); `storySources()` in the same file gives every id's text (the plugin and the storybook-static check use it; the docs milestone can use it for sources.json). `ST_BASE` of .storybook/themes is written as `const ST_BASE: 'base' | 'radix' | 'aria' = 'base';`. The component is `const <Export> = () => ...; export default <Export>;` so the story's own formatting is kept. validate-repo story-source allows one story without a table: `features-view-settings--edition-icons-render` (an icon grid).
- The Code tab gets the text through a preview decorator that calls `emitTransformCode` once per story id (Storybook sends a snippet itself only for args stories); `docs.source.transform` maps the id to its text. Also new: .storybook/story-sources.d.ts (the virtual module's type) and `tools/story-source/**` in test/storybook-static/run.mjs paths; `pnpm test typecheck` does not cover tsconfig.stories.json (.storybook), so it was run by hand.
- Reading check run time per base: about 400 s for 645 ids (384 s for 626), about 7 minutes per base with the build; the three bases one after another about 21 minutes.

- `basic--basic` on 0.9.5, the whole Code tab text:

```
{
  render: () => <BasicExample />,
  play: async ({
    canvasElement
  }: StoryContext) => {
    await within(canvasElement).findByText('Rolluffs');
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(addresses.length);
    rows.forEach((row, index) => {
      const entry = addresses[index]!;
      expect([...row.querySelectorAll('td')].map(cell => (cell.textContent ?? '').trim())).toEqual([entry.name.firstName, entry.name.lastName, entry.address, entry.city, entry.state]);
    });
  }
}
```

- Code texts at 7c280699 (`storySources()` of tools/story-source/extract.mjs, as the Code tab shows them):
  - `basic--basic` (one-line wrapper of `BasicExample`), whole text:

```tsx
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

type Address = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

const addresses: Address[] = [
  {
    name: { firstName: 'John', lastName: 'Doe' },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: { firstName: 'Jane', lastName: 'Doe' },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: { firstName: 'Joe', lastName: 'Doe' },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: { firstName: 'Kevin', lastName: 'Vandy' },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: { firstName: 'Joshua', lastName: 'Rolluffs' },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const addressColumns: ST_ColumnDef<Address>[] = [
  {
    accessorKey: 'name.firstName',
    icon: UserIcon,
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'name.lastName',
    icon: UserIcon,
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'address',
    icon: MapPinIcon,
    header: 'Address',
    size: 200,
  },
  {
    accessorKey: 'city',
    icon: Building2Icon,
    header: 'City',
    size: 150,
  },
  {
    accessorKey: 'state',
    icon: MapIcon,
    header: 'State',
    size: 150,
  },
];

const BasicExample = () => {
  const table = useShadcnTable({ columns: addressColumns, data: addresses });
  return <ShadcnTable table={table} />;
};

const Basic = () => <BasicExample />;

export default Basic;
```

  - `basic--default` (args story: the meta's `args: { columns, data }` and its `render`), whole text:

```tsx
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { Building2Icon, CakeIcon, UserIcon } from 'lucide-react';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  city: string;
};

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace', age: 36, city: 'London' },
  { firstName: 'Alan', lastName: 'Turing', age: 41, city: 'Manchester' },
  { firstName: 'Grace', lastName: 'Hopper', age: 85, city: 'Arlington' },
  { firstName: 'Linus', lastName: 'Torvalds', age: 54, city: 'Portland' },
  { firstName: 'Margaret', lastName: 'Hamilton', age: 88, city: 'Boston' },
  {
    firstName: 'Dennis',
    lastName: 'Ritchie',
    age: 70,
    city: 'Berkeley Heights',
  },
  { firstName: 'Barbara', lastName: 'Liskov', age: 85, city: 'Cambridge' },
  { firstName: 'Ken', lastName: 'Thompson', age: 81, city: 'Murray Hill' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
  { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
  { accessorKey: 'age', header: 'Age', icon: CakeIcon },
  { accessorKey: 'city', header: 'City', icon: Building2Icon },
];

const Default = () => <ShadcnTable columns={columns} data={data} />;

export default Default;
```

  - `features-creating--create-row-appears` (`render: function CreateRowAppearsStory()`), whole text:

```tsx
import { useState } from 'react';
import {
  type ST_TableOptions,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';

type Person = {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
};

const data: Person[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

const CreateRowAppears = () => {
  const [tableData, setTableData] = useState(() => data.slice(0, 3));
  const handleCreate: ST_TableOptions<Person>['onCreatingRowSave'] = ({
    exitCreatingMode,
    values,
  }) => {
    setTableData((rows) => [...rows, values]);
    exitCreatingMode();
  };
  return (
    <ShadcnTable
      columns={[
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
      ]}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="row"
      enableEditing
      onCreatingRowSave={handleCreate}
      positionCreatingRow="top"
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export default CreateRowAppears;
```

  - `features-server-data--dynamic-columns` (`<WithQueryClient>` wrapper, 535 lines): imports from react, @tanstack/react-query, the library, lucide-react; declarations in file order: `UserApiResponse`, `User`, `DbRow`, `userRows`, `randomDate`, `dbRows`, `isLessThan`, `ColumnFilterWithMode`, `DATE_ONLY`, `toTime`, `filterTime`, `isDayOnly`, `matchesDate`, `getUsers`, `columnNames`, `columnIcons`, `DynamicColumnsExample`, `WithQueryClient`, `DynamicColumns`; no play, expect, userEvent or storybook/test. Its last lines:

```tsx
const WithQueryClient = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const DynamicColumns = () => (
  <WithQueryClient>
    <DynamicColumnsExample />
  </WithQueryClient>
);

export default DynamicColumns;
```

- Review round (fable, eb6ced96): fixed at ff8b98f0 (ST_BASE per base; extractor dead code, object parameters, fileURLToPath, header comment, TEST_WORDS once), 085e9796 (Code tab never shows the story as written; eslint-disable reason), fd635b9a (remountStory throws when `__stRemountStory` is unset). Declined: `tools/story-source/extract.test.mjs` (not owned; the two spec-named paths it would cover, meta component with args and a relative import inside stories/, are kept), one shared `remountStory` (a `.storybook/` file is not owned and the docs copies rewrite only the themes import, lib/story-variants.mjs), coding-standards.md Layout line and process.md P5 rename (not owned; for the lead), CHANGELOG (true again after the ST_BASE fix). The storySources-per-base text is what the Docs code panels milestone writes into sources.json: one text per base.
