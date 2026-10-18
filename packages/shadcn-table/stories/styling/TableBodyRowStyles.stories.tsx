import { type Meta, type StoryContext } from '@storybook/react-vite';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { expect } from 'storybook/test';

const meta: Meta = {
  title: 'Styling/Style Table Body Rows',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];
const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTableBodyRowStyles = () => (
  <ShadcnTable columns={columns} data={data} />
);

DefaultTableBodyRowStyles.play = async ({ canvas }: StoryContext) => {
  const bodyRows = (await canvas.findAllByRole('row')).filter((row) =>
    row.closest('tbody'),
  );
  await expect(bodyRows[0].className).toMatch(/hover:/);
};

export const DisableRowHoverEffect = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyRowProps={{
      hover: false,
    }}
  />
);

// MRT TableRow `hover: false`: no hover background. The row must carry no
// hover: variant at all instead of a className that paints over it.
DisableRowHoverEffect.play = async ({ canvas }: StoryContext) => {
  const bodyRows = (await canvas.findAllByRole('row')).filter((row) =>
    row.closest('tbody'),
  );
  await expect(bodyRows.length).toBeGreaterThan(0);
  for (const row of bodyRows) {
    await expect(row.className).not.toMatch(/hover:/);
  }
};

export const StyleMuiTableBodyRow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyRowProps={{
      className: 'bg-sky-500/10 border-r border-border',
    }}
  />
);

export const StyleCustomStripedRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyCellProps={{ className: 'border-none' }}
    stTableBodyProps={{
      className: '[&_tr:nth-of-type(odd)]:bg-[limegreen]',
    }}
  />
);

export const StyleCustomStripedRowsDetailPanel = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyCellProps={{ className: 'border-none' }}
    stTableBodyProps={{
      className: '[&_tr:nth-child(4n+3)]:bg-[limegreen]',
    }}
    renderDetailPanel={() => <div>Detail Panel</div>}
  />
);

export const ConditionallyStyleMuiTableRow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyRowProps={({ row }) => ({
      className:
        row.getValue<number>('age') > 50 ? 'bg-red-500/20 italic' : 'italic',
    })}
  />
);
