import { type Meta } from '@storybook/react-vite';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Style Table Body Cells',
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

export const DefaultTableBodyCellStyles = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// Style every body cell via the table-level `srtTableBodyCellProps` slot
// (shadcn equivalent of MRT's muiTableBodyCellProps — DOM props, not sx).
export const StyleAllMuiTableBodyCell = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableBodyCellProps={{
      className: 'border-r border-border bg-sky-500/10',
    }}
  />
);

// Conditional per-column styling via column-level `srtTableBodyCellProps`
// callback (receives { cell, column, row, table }).
export const StyleMuiTableBodyCellConditionallyIn1Column = () => (
  <ShadcnReactTable
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
        accessorKey: 'age',
        header: 'Age',
        srtTableBodyCellProps: ({ cell }) => ({
          className: [
            cell.getValue<number>() > 40 ? 'bg-green-500/50' : undefined,
            cell.column.id === 'age' && cell.getValue<number>() > 40
              ? 'font-bold'
              : 'font-normal',
          ]
            .filter(Boolean)
            .join(' '),
        }),
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomCellRender = () => (
  <ShadcnReactTable
    columns={[
      {
        Cell: ({ cell }) => (
          <span style={{ fontStyle: 'italic' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        Cell: ({ cell }) => (
          <span style={{ color: 'red' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        Cell: ({ cell }) => (
          <span
            style={{
              backgroundColor:
                cell.column.id === 'age' && cell.getValue<number>() > 40
                  ? 'rgba(22, 184, 44, 0.5)'
                  : undefined,
              fontStyle: 'italic',
              padding: '0.5rem',
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);
