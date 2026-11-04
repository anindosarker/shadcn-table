import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

const meta: Meta = {
  title: 'Features/Header Groups Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },

      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    header: 'Name',
    id: 'name',
  },
  {
    columns: [
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ],
    header: 'Info',
    id: 'info',
  },
];

const data = [...Array(555)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const HeaderGroups = () => <ShadcnTable columns={columns} data={data} />;

export const HeaderGroupsWithStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const HeaderAndFooterGroups = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
          {
            accessorKey: 'firstName',
            footer: 'First Name',
            header: 'First Name',
          },
          {
            accessorKey: 'lastName',
            footer: 'Last Name',
            header: 'Last Name',
          },
        ],
        footer: 'Name',
        header: 'Name',
        id: 'name',
      },
      {
        columns: [
          {
            accessorKey: 'age',
            footer: 'Age',
            header: 'Age',
          },
          {
            accessorKey: 'address',
            footer: 'Address',
            header: 'Address',
          },
        ],
        footer: 'Info',
        header: 'Info',
        id: 'info',
      },
    ]}
    data={data}
    enableColumnPinning
  />
);

export const HeaderGroupsWithColumnOrdering = () => (
  <ShadcnTable columns={columns} data={data} enableColumnOrdering />
);

export const HeaderGroupsWithColumnPinning = () => (
  <ShadcnTable columns={columns} data={data} enableColumnPinning />
);

export const HeaderGroupsWithColumResizing = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnResizing
    enableRowSelection
  />
);

export const HeaderGroupsWithColumResizingGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnResizing
    layoutMode="grid"
  />
);

export const HeaderGroupsWithSemanticColumResizing = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnResizing
    layoutMode="semantic"
  />
);

export const MixedHeaderGroups = () => {
  return (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
        {
          columns: [
            {
              accessorKey: 'address',
              header: 'Address',
            },
          ],
          header: 'Grouped',
          id: 'grouped',
        },
        {
          accessorKey: 'city',
          header: 'City',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
      ]}
      data={data}
    />
  );
};

export const DeepMixedHeaderGroups = () => {
  return (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          columns: [
            {
              columns: [
                {
                  accessorKey: 'address',
                  header: 'Address',
                },
                {
                  accessorKey: 'city',
                  header: 'City',
                },
                {
                  accessorKey: 'state',
                  header: 'State',
                },
              ],
              header: 'Location',
              id: 'location',
            },
          ],
          header: 'Grouped',
          id: 'grouped',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
      ]}
      data={data}
    />
  );
};

export const HeaderGroupsWithRowVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowVirtualization
  />
);

export const HeaderGroupsWithColumnVirtualization = () => (
  <ShadcnTable columns={columns} data={data} enableColumnVirtualization />
);

// Each group header spans exactly its leaves: the group row's cells, taken by
// colSpan, against the leaf row's cells below them (F18).
const expectGroupEdgesMatchLeaves = async (canvasElement: HTMLElement) => {
  await waitFor(() => {
    const [groupRow, leafRow] = [
      ...canvasElement.querySelectorAll<HTMLTableRowElement>('thead tr'),
    ];
    expect(groupRow).toBeDefined();
    expect(leafRow).toBeDefined();
    const leaves = [...leafRow.querySelectorAll<HTMLElement>('th')];
    let index = 0;
    for (const group of groupRow.querySelectorAll<HTMLTableCellElement>('th')) {
      const span = leaves.slice(index, index + group.colSpan);
      index += group.colSpan;
      const rect = group.getBoundingClientRect();
      const left = Math.min(
        ...span.map((th) => th.getBoundingClientRect().left),
      );
      const right = Math.max(
        ...span.map((th) => th.getBoundingClientRect().right),
      );
      const name = `${group.textContent} over ${span.map((th) => th.dataset.flipColumn).join(', ')}`;
      expect(Math.abs(rect.left - left), `${name} left`).toBeLessThanOrEqual(1);
      expect(Math.abs(rect.right - right), `${name} right`).toBeLessThanOrEqual(
        1,
      );
    }
    expect(index).toBe(leaves.length);
  });
};

export const GroupEdgesMatchLeaves = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowSelection
      initialState={{ columnPinning: { start: ['firstName'] } }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) =>
    expectGroupEdgesMatchLeaves(canvasElement),
};

export const GroupEdgesMatchLeavesNoGrow = {
  render: () => (
    <ShadcnTable
      columns={[
        {
          ...columns[0],
          columns: [
            { accessorKey: 'firstName', grow: false, header: 'First Name' },
            { accessorKey: 'lastName', header: 'Last Name' },
          ],
        },
        columns[1],
      ]}
      data={data}
    />
  ),
  play: async ({ canvasElement }: StoryContext) =>
    expectGroupEdgesMatchLeaves(canvasElement),
};
