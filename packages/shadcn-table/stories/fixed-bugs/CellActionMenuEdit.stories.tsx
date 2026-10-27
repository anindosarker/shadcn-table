import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixed bug (findings, decisions item 5): `ST_CellActionMenu`'s
// `onCloseAutoFocus` read `editingCell` from a render snapshot, still `null`
// when the menu closed, and refocused the cell, so the edit input the menu
// had just opened blurred and unmounted.

const meta: Meta = {
  title: 'Fixed Bugs/Cell Action Menu Edit',
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

// Edit from the cell action menu: the menu's close must not refocus the cell,
// so the edit input it opened keeps focus.
export const CellActionMenuEditKeepsFocus = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      editDisplayMode="cell"
      enableCellActions
      enableClickToCopy="context-menu"
      enableEditing
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const body = within(document.body);
    await waitFor(() =>
      expect(canvasElement.querySelector('tbody')?.textContent).toContain(
        'Mason',
      ),
    );
    const cell = canvasElement.querySelector('tbody td') as HTMLElement;
    await userEvent.pointer({ keys: '[MouseRight]', target: cell });
    await userEvent.click(await body.findByText('Edit'));
    await waitFor(() => {
      const input = cell.querySelector('input');
      expect(input).not.toBeNull();
      expect(document.activeElement).toBe(input);
    });
    // still focused once the menu has fully closed
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(document.activeElement).toBe(cell.querySelector('input'));
  },
};
