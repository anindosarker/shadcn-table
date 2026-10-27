import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_RowSelectionState,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the decisions item 8 verify list (row pinning follows the
// selection store under `rowPinningDisplayMode: 'select-*'`). Fixed data so
// every assertion is deterministic.

const meta: Meta = {
  title: 'Features/Row Pinning On Select',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Anderson', lastName: 'Kim' },
  { firstName: 'Lily', lastName: 'Brown' },
  { firstName: 'Tom', lastName: 'Garcia' },
  { firstName: 'Brooke', lastName: 'Diaz' },
  { firstName: 'Jackson', lastName: 'Reed' },
  { firstName: 'Nora', lastName: 'Hill' },
  { firstName: 'Owen', lastName: 'Shaw' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

const pinnedFirstNames = (root: ParentNode) =>
  Array.from(root.querySelectorAll('tbody tr[data-pinned]'))
    .map(
      (row) =>
        data.find(({ firstName }) => row.textContent?.includes(firstName))
          ?.firstName ?? '',
    )
    .sort();

const shiftClickRange = async ({ canvas }: StoryContext) => {
  const checkboxes = await canvas.findAllByRole('checkbox', {
    name: 'Toggle select row',
  });
  // one user-event session, so the held Shift reaches the second click
  const user = userEvent.setup();
  await user.click(checkboxes[1]);
  await user.keyboard('{Shift>}');
  await user.click(checkboxes[4]);
  await user.keyboard('{/Shift}');
};

const expectPinned = (root: ParentNode, firstNames: string[]) =>
  waitFor(() => expect(pinnedFirstNames(root)).toEqual([...firstNames].sort()));

export const ShiftRangeInternalState = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    rowPinningDisplayMode="select-sticky"
  />
);

ShiftRangeInternalState.play = async (context: StoryContext) => {
  await shiftClickRange(context);
  await expectPinned(context.canvasElement, [
    'Anderson',
    'Lily',
    'Tom',
    'Brooke',
  ]);
};

export const ShiftRangeControlledState = () => {
  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enablePagination={false}
      enableRowPinning
      enableRowSelection
      onRowSelectionChange={setRowSelection}
      rowPinningDisplayMode="select-sticky"
      state={{ rowSelection }}
    />
  );
};

ShiftRangeControlledState.play = async (context: StoryContext) => {
  await shiftClickRange(context);
  await expectPinned(context.canvasElement, [
    'Anderson',
    'Lily',
    'Tom',
    'Brooke',
  ]);
  // unselecting unpins
  const checkboxes = await context.canvas.findAllByRole('checkbox', {
    name: 'Toggle select row',
  });
  const lily = checkboxes.find((checkbox) =>
    checkbox.closest('tr')?.textContent?.includes('Lily'),
  );
  await userEvent.click(lily!);
  await expectPinned(context.canvasElement, ['Anderson', 'Tom', 'Brooke']);
};

export const SelectAllPageMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowPinning
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    rowPinningDisplayMode="select-sticky"
  />
);

SelectAllPageMode.play = async ({ canvas, canvasElement }: StoryContext) => {
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await expectPinned(canvasElement, [
    'Mason',
    'Anderson',
    'Lily',
    'Tom',
    'Brooke',
  ]);
  await userEvent.click(selectAll);
  await expectPinned(canvasElement, []);
};

export const SelectAllAllMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowPinning
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    rowPinningDisplayMode="select-sticky"
    selectAllMode="all"
  />
);

SelectAllAllMode.play = async ({ canvas, canvasElement }: StoryContext) => {
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await expectPinned(
    canvasElement,
    data.map(({ firstName }) => firstName),
  );
};

export const ProgrammaticToggleSelected = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => (
      <button
        onClick={() => table.getRow('5').toggleSelected(true)}
        type="button"
      >
        Select Jackson
      </button>
    )}
    rowPinningDisplayMode="select-bottom"
  />
);

ProgrammaticToggleSelected.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  await userEvent.click(
    await canvas.findByRole('button', { name: 'Select Jackson' }),
  );
  await expectPinned(canvasElement, ['Jackson']);
};
