import { MapPinIcon, TagsIcon, UserIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';

// F29: a `multi-select` filter on a column of plain strings matched no rows,
// because its default filter fn only matched array row values. Picking two
// states now keeps the rows in either state; a column of arrays still keeps
// the rows that share any picked value.
const meta: Meta = {
  title: 'Fixed Bugs/Multi Select Filter',
};

export default meta;

type Person = { name: string; state: string; tags: string[] };

const data: Person[] = [
  { name: 'Mason Lee', state: 'Texas', tags: ['admin', 'billing'] },
  { name: 'Lily Park', state: 'Ohio', tags: ['support'] },
  { name: 'Noah Kim', state: 'Utah', tags: ['billing'] },
  { name: 'Emma Cruz', state: 'Texas', tags: [] },
  { name: 'Liam Shah', state: 'Maine', tags: ['admin'] },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name', icon: UserIcon },
  {
    accessorKey: 'state',
    filterVariant: 'multi-select',
    header: 'State',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'tags',
    Cell: ({ cell }) => cell.getValue<string[]>().join(', '),
    filterSelectOptions: ['admin', 'billing', 'support'],
    filterVariant: 'multi-select',
    header: 'Tags',
    icon: TagsIcon,
  },
];

const bodyNames = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('tbody tr')).map(
    (row) => row.querySelector('td')?.textContent ?? '',
  );

const pick = async (input: HTMLElement, labels: RegExp[]) => {
  const body = within(document.body);
  for (const label of labels) {
    await userEvent.click(input);
    // The aria combobox opens from the keyboard, not on a click.
    if (!body.queryByRole('listbox')) await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(await body.findByRole('option', { name: label }));
  }
  await userEvent.keyboard('{Escape}');
};

export const SubheaderStringColumn = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={columns}
      data={data}
      enableFacetedValues
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason Lee');
    await pick(canvas.getByRole('combobox', { name: 'Filter by State' }), [
      /^Texas/,
      /^Utah/,
    ]);
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual([
        'Mason Lee',
        'Noah Kim',
        'Emma Cruz',
      ]),
    );
  },
};

export const ChipsStringColumn = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="chips"
      columns={columns}
      data={data}
      enableFacetedValues
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Mason Lee');
    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'State' }));
    await pick(await body.findByRole('combobox', { name: 'Filter by State' }), [
      /^Ohio/,
      /^Maine/,
    ]);
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual(['Lily Park', 'Liam Shah']),
    );
  },
};

export const SubheaderArrayColumn = {
  render: SubheaderStringColumn.render,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason Lee');
    await pick(canvas.getByRole('combobox', { name: 'Filter by Tags' }), [
      /^admin/,
      /^support/,
    ]);
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual([
        'Mason Lee',
        'Lily Park',
        'Liam Shah',
      ]),
    );
  },
};

export const EmptySelectionKeepsEveryRow = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={columns}
      data={data}
      enableFacetedValues
      initialState={{
        columnFilters: [
          { id: 'state', value: [] },
          { id: 'tags', value: [] },
        ],
        showColumnFilters: true,
      }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason Lee');
    expect(bodyNames(canvasElement)).toHaveLength(data.length);
  },
};
