import { type Meta, type StoryContext } from '@storybook/react-vite';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { expect } from 'storybook/test';

const meta: Meta = {
  title: 'Styling/Caption Examples',
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
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int({ max: 60, min: 20 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const BottomCaption = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderCaption={() => 'Table Caption'}
  />
);

// MRT's caption sits under the table by default; the table's `caption-bottom`
// class is inherited by the <caption>, and stTableProps.className can
// override it (TopCaption below).
BottomCaption.play = async ({ canvas }: StoryContext) => {
  const caption = canvas.getByText('Table Caption');
  await expect(getComputedStyle(caption).captionSide).toBe('bottom');
};

export const TopCaption = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableProps={{
      className: '[&>caption]:caption-top',
    }}
    renderCaption={() => 'Table Caption'}
  />
);

TopCaption.play = async ({ canvas }: StoryContext) => {
  const caption = canvas.getByText('Table Caption');
  await expect(getComputedStyle(caption).captionSide).toBe('top');
};
