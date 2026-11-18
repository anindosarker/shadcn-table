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

- Task 1: done, 88aaec58
- Task 2: done, 7c280699
- Task 3: done, 35c2af48
- Task 4: planned
- Task 5: planned

## Attention

## Notes

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
