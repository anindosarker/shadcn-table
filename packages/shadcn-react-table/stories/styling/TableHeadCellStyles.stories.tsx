import { type Meta } from '@storybook/react-vite';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Style Table Head Cells',
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

export const DefaultTableHeadCellStyles = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const ColorSortIcon = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableHeadCellProps={({ column }) => ({
      className: column.getIsSorted()
        ? '[&_button[aria-label^=Sort]_svg]:text-[limegreen]!'
        : undefined,
    })}
  />
);

export const StyleAllMuiTableHeadCell = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableHeadCellProps={{
      className: 'bg-sky-500/10 border-r border-border text-foreground',
    }}
  />
);

export const StyleTableHeadCellsIndividually = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        srtTableHeadCellProps: {
          className: 'text-primary',
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        srtTableHeadCellProps: {
          className: 'text-red-500',
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomHeadCellRenders = () => (
  <ShadcnReactTable
    columns={[
      {
        Header: <em>First Name</em>,
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        Header: () => <em>Last Name</em>,
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        Header: ({ column }) => (
          <div className="text-primary">{column.columnDef.header}</div>
        ),
        accessorKey: 'age',
        header: 'Current Age',
      },
      {
        accessorKey: 'address',
        header: 'Address of Residence (Permanent)',
      },
    ]}
    data={data}
    enableColumnResizing
  />
);
