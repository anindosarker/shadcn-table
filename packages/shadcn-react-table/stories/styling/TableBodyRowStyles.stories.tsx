import { type Meta } from '@storybook/react-vite';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Style Table Body Rows',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
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
  <ShadcnReactTable columns={columns} data={data} />
);

export const DisableRowHoverEffect = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyRowProps={{
      className: 'hover:[&>td]:after:bg-transparent',
    }}
  />
);

export const StyleMuiTableBodyRow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyRowProps={{
      className: 'bg-sky-500/10 border-r border-border',
    }}
  />
);

export const StyleCustomStripedRows = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyCellProps={{ className: 'border-none' }}
    srtTableBodyProps={{
      className: '[&_tr:nth-of-type(odd)]:bg-[limegreen]',
    }}
  />
);

export const StyleCustomStripedRowsDetailPanel = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyCellProps={{ className: 'border-none' }}
    srtTableBodyProps={{
      className: '[&_tr:nth-child(4n+3)]:bg-[limegreen]',
    }}
    renderDetailPanel={() => <div>Detail Panel</div>}
  />
);

export const ConditionallyStyleMuiTableRow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyRowProps={({ row }) => ({
      className:
        row.getValue<number>('age') > 50 ? 'bg-red-500/20 italic' : 'italic',
    })}
  />
);
