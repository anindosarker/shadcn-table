import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// The popover filter opens from its filter button as the popover trigger,
// with the column's input focused; the empty-mode chip's clear button has a
// name.

const meta: Meta = {
  title: 'Fixed Bugs/Filter Popover',
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

export const OpensWithInputFocused = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="popover"
      columns={columns}
      data={data}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');
    const trigger = canvasElement.querySelector<HTMLElement>(
      'thead [aria-expanded]:not([aria-haspopup="menu"])',
    );
    if (!trigger) throw new Error('filter button not found');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    const input = await within(document.body).findByPlaceholderText(
      'Filter by First Name',
    );
    await waitFor(() => expect(document.activeElement).toBe(input));
  },
};

export const EmptyModeChipClearHasName = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');
    await userEvent.click(
      canvas.getAllByRole('button', { name: 'Change filter mode' })[0],
    );
    const [emptyMode] = (
      await within(document.body).findAllByRole('menuitem', { name: /Empty/ })
    ).filter((item) => !item.textContent?.includes('Not'));
    await userEvent.click(emptyMode);
    await canvas.findByText('Empty');
    const chip = canvas.getByText('Empty').closest('[data-slot="badge"]');
    if (!(chip instanceof HTMLElement)) throw new Error('chip not found');
    const clear = within(chip).getByRole('button', { hidden: true });
    expect(clear).toHaveAccessibleName('Clear filter');
  },
};
