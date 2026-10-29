import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

const meta: Meta = {
  title: 'Features/Row Pinning Examples',
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
    accessorKey: 'email',
    header: 'Email Address',
  },
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
];

const data = [...Array(50)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowPinningStickyDefaultEnabled = () => (
  <ShadcnTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = () => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowPinning(!enableRowPinning)}>
          Toggle Row Pinning
        </Button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyCustomRowHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableBodyRowProps={{
      className: 'h-[100px]',
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

// Select all pins all 50 rows, more than the 600px container holds; the
// pinned rows stay below the head, so the select-all box is still the
// topmost element at its center and unselects them all.
RowPinningSelectStickyMode.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  const pinnedRows = () =>
    canvasElement.querySelectorAll('tbody tr[data-pinned]');
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await waitFor(() => expect(pinnedRows()).toHaveLength(data.length));
  // The visible box: the React Aria base's checkbox role is a visually
  // hidden input inside it.
  const selectAllBox = selectAll.closest<HTMLElement>(
    '[data-slot="checkbox"]',
  )!;
  await waitFor(() => {
    const { height, left, top, width } = selectAllBox.getBoundingClientRect();
    const hit = document.elementFromPoint(left + width / 2, top + height / 2);
    expect(selectAllBox.contains(hit)).toBe(true);
  });
  await userEvent.click(selectAll);
  await waitFor(() => expect(pinnedRows()).toHaveLength(0));
};

export const RowPinningTopAndBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningWithGridLayout = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningTopWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowAndColumnPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        start: ['firstName'],
        end: ['lastName'],
      },
      rowPinning: {
        bottom: [],
        top: ['3', '5'],
      },
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);
