import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the part 01 phase 03 verify list. Fixed data so every assertion
// is deterministic. Part 03 consolidates this file.

const meta: Meta = {
  title: 'Features/Phase Three Verify',
};

export default meta;

type Person = { firstName: string };

const data: Person[] = [
  { firstName: 'Mason' },
  { firstName: 'Lily' },
  { firstName: 'Jackson' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
];

const bodyText = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .map((row) => row.textContent)
    .join();

// `table.setGlobalFilterFn` from outside the menu re-filters a live search:
// `ily` matches Lily under fuzzy and nothing under Starts With.
export const ProgrammaticGlobalFilterMode = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      initialState={{ globalFilter: 'ily', showGlobalFilter: true }}
      renderTopToolbarCustomActions={({ table }) => (
        <button
          onClick={() => table.setGlobalFilterFn('startsWith')}
          type="button"
        >
          Starts With
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Lily'));
    await userEvent.click(within(canvasElement).getByText('Starts With'));
    await waitFor(() => expect(bodyText(canvasElement)).not.toContain('Lily'));
  },
};

// `table.setColumnFilterFns` from outside the menu re-filters a live column
// filter: `ack` matches Jackson under fuzzy and nothing under Starts With.
export const ProgrammaticColumnFilterMode = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{
        columnFilters: [{ id: 'firstName', value: 'ack' }],
        showColumnFilters: true,
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <button
          onClick={() =>
            table.setColumnFilterFns((old) => ({
              ...old,
              firstName: 'startsWith',
            }))
          }
          type="button"
        >
          Starts With
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Jackson'));
    await userEvent.click(within(canvasElement).getByText('Starts With'));
    await waitFor(() =>
      expect(bodyText(canvasElement)).not.toContain('Jackson'),
    );
  },
};
