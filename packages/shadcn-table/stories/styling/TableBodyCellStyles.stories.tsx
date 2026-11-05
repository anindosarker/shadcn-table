import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { CakeIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Styling/Style Table Body Cells',
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

export const DefaultTableBodyCellStyles = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Style every body cell via the table-level `stTableBodyCellProps` slot
// (shadcn equivalent of MRT's muiTableBodyCellProps: DOM props, not sx).
export const StyleAllMuiTableBodyCell = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyCellProps={{
      className: 'border-r border-border bg-sky-500/10',
    }}
  />
);

// Conditional per-column styling via column-level `stTableBodyCellProps`
// callback (receives { cell, column, row, table }).
export const StyleMuiTableBodyCellConditionallyIn1Column = () => (
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
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        stTableBodyCellProps: ({ cell }) => ({
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
        icon: MapPinIcon,
      },
    ]}
    data={data}
  />
);

export const CustomCellRender = () => (
  <ShadcnTable
    columns={[
      {
        Cell: ({ cell }) => (
          <span style={{ fontStyle: 'italic' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        Cell: ({ cell }) => (
          <span style={{ color: 'red' }}>{cell.getValue<string>()}</span>
        ),
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
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
        icon: CakeIcon,
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

// The table-level body cell classes give every cell the end border and tint.
StyleAllMuiTableBodyCell.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  for (const cell of canvasElement.querySelectorAll<HTMLElement>(
    'tbody tr:first-child td',
  )) {
    const style = getComputedStyle(cell);
    expect(style.borderRightWidth).toBe('1px');
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(cell).toHaveClass('bg-sky-500/10');
  }
};
