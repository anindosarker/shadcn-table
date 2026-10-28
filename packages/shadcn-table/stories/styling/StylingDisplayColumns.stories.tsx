import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Styling/Styling Display Columns',
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

export const CustomizeDisplayColumns = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-actions': {
        stTableHeadCellProps: {
          className: 'text-xl italic',
        },
        size: 160,
      },
      'st-row-expand': {
        enableColumnActions: true,
        enableResizing: true,
        size: 70,
      },
      'st-row-numbers': {
        enableColumnOrdering: true,
        stTableBodyCellProps: {
          className: 'text-2xl text-red-500',
        },
      },
    }}
    enableColumnOrdering
    enableColumnResizing
    enableRowActions
    enableRowNumbers
    enableRowSelection
    renderDetailPanel={() => <div>Detail Panel</div>}
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);
