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

type Employee = {
  city: string;
  company: string;
  country: string;
  firstName: string;
  id: number;
  lastName: string;
};

const employees: Employee[] = [
  {
    city: 'Omaha',
    company: 'Northwind Traders',
    country: 'United States',
    firstName: 'Mason',
    id: 1,
    lastName: 'Lee',
  },
  {
    city: 'Lyon',
    company: 'Contoso',
    country: 'France',
    firstName: 'Lily',
    id: 2,
    lastName: 'Park',
  },
];

// The export CSV docs example: row selection and columns sized 40 to 300.
const sizedColumns: ST_ColumnDef<Employee>[] = [
  { accessorKey: 'id', header: 'ID', size: 40 },
  { accessorKey: 'firstName', header: 'First Name', size: 120 },
  { accessorKey: 'lastName', header: 'Last Name', size: 120 },
  { accessorKey: 'company', header: 'Company', size: 300 },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'country', header: 'Country', size: 220 },
];

// The funnel opens the popover with the input focused, and the label keeps
// its full width beside the funnel and the chevron (F19).
export const OpensWithRowSelection = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="popover"
      columns={sizedColumns}
      data={employees}
      enableRowSelection
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');
    const th = canvasElement.querySelector<HTMLElement>(
      'thead th[data-flip-column="firstName"]',
    );
    if (!th) throw new Error('First Name header not found');
    const label = within(th).getByText('First Name');
    expect(label.scrollWidth).toBe(label.clientWidth);

    const trigger = th.querySelector<HTMLElement>(
      '[aria-expanded]:not([aria-haspopup="menu"])',
    );
    if (!trigger) throw new Error('filter button not found');
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
      columnFilterDisplayMode="subheader"
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
