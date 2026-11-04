import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { CakeIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Styling/Style Table Head Cells',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
];
const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTableHeadCellStyles = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const ColorSortIcon = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableHeadCellProps={({ column }) => ({
      className: column.getIsSorted()
        ? '[&_button[aria-label^=Sort]_svg]:text-[limegreen]!'
        : undefined,
    })}
  />
);

export const StyleAllMuiTableHeadCell = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableHeadCellProps={{
      className: 'bg-sky-500/10 border-r border-border text-foreground',
    }}
  />
);

export const StyleTableHeadCellsIndividually = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        stTableHeadCellProps: {
          className: 'text-primary',
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        stTableHeadCellProps: {
          className: 'text-red-500',
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
    ]}
    data={data}
  />
);

export const CustomHeadCellRenders = () => (
  <ShadcnTable
    columns={[
      {
        Header: <em>First Name</em>,
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        Header: () => <em>Last Name</em>,
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        Header: ({ column }) => (
          <div className="text-primary">{column.columnDef.header}</div>
        ),
        accessorKey: 'age',
        header: 'Current Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address of Residence (Permanent)',
        icon: MapPinIcon,
      },
    ]}
    data={data}
    enableColumnResizing
  />
);
