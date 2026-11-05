import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Number Examples',
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
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const enableRowNumbersStatic = () => (
  <ShadcnTable columns={columns} data={data} enableRowNumbers />
);

// The row number sits in the middle of its cell, in muted tabular digits
// (F12).
export const NumbersCentred = {
  render: () => <ShadcnTable columns={columns} data={data} enableRowNumbers />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => {
      const cell = canvasElement.querySelector<HTMLElement>(
        'tbody tr td[data-flip-column="st-row-numbers"]',
      );
      expect(cell).not.toBeNull();
      expect(cell!.textContent).toBe('1');
      const range = document.createRange();
      range.selectNodeContents(cell!);
      const digit = range.getBoundingClientRect();
      const box = cell!.getBoundingClientRect();
      expect(
        Math.abs(digit.x + digit.width / 2 - (box.x + box.width / 2)),
      ).toBeLessThanOrEqual(1);
    });
  },
};

const EnableRowNumbersConditionally = () => {
  const [enableRowNumbers, setEnableRowNumbers] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowNumbers={enableRowNumbers}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowNumbers(!enableRowNumbers)}>
          Toggle Row Numbers
        </Button>
      )}
    />
  );
};

export const enableRowNumbersConditionally = () => (
  <EnableRowNumbersConditionally />
);

export const enableRowNumbersStaticGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid"
  />
);

export const enableRowNumbersStaticGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid-no-grow"
  />
);

export const enableRowNumbersOriginal = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersOriginalVirtual = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersStaticVirtual = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="static"
  />
);
