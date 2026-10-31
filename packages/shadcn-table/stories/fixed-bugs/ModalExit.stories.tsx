import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// The edit modal stays mounted with `open` toggled, so closing it plays the
// dialog's exit state before the popup unmounts.

const meta: Meta = {
  title: 'Fixed Bugs/Modal Exit',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Lily', lastName: 'Park' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

/** Base UI marks the closing popup data-closed, Radix data-state="closed", React Aria data-exiting. */
const isClosing = (dialog: Element) =>
  dialog.hasAttribute('data-closed') ||
  dialog.getAttribute('data-state') === 'closed' ||
  dialog.hasAttribute('data-exiting') ||
  !!dialog.closest('[data-exiting]');

export const EditModalPlaysExit = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      editDisplayMode="modal"
      enableEditing
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Mason');
    await userEvent.click(canvas.getAllByRole('button', { name: 'Edit' })[0]);
    const dialog = await body.findByRole('dialog');

    await userEvent.click(
      within(dialog).getByRole('button', { hidden: true, name: 'Cancel' }),
    );
    // The popup is still in the document, in its closing state.
    expect(dialog.isConnected).toBe(true);
    expect(isClosing(dialog)).toBe(true);
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
};
