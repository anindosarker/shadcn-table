import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { ST_BASE } from '../../.storybook/themes';
import { CircleCheckIcon, MapIcon, UserIcon } from 'lucide-react';

// Fixed bug (spec 10.2, D61): in React Aria the row select checkbox, a column
// filter checkbox and a grouped row's value had no tooltip, because the aria
// tooltip trigger wraps its child in Focusable, which warns on a child that is
// not a focusable element. They now open React Aria's standalone Tooltip from
// the control's own hover and focus events. The play test runs in the aria
// Storybook only; the other bases show the same bubbles through their own
// tooltip triggers.

const meta: Meta = {
  title: 'Fixed Bugs/Aria Tooltips',
};

export default meta;

type Person = { firstName: string; isActive: boolean; state: string };

const data: Person[] = [
  { firstName: 'Mason', isActive: true, state: 'Ohio' },
  { firstName: 'Lily', isActive: false, state: 'Ohio' },
  { firstName: 'Jackson', isActive: true, state: 'Texas' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
  {
    Cell: ({ cell }) => (cell.getValue() === 'true' ? 'Yes' : 'No'),
    accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'),
    filterVariant: 'checkbox',
    header: 'Is Active',
    icon: CircleCheckIcon,
    id: 'isActive',
  },
  { accessorKey: 'state', header: 'State', icon: MapIcon },
];

const body = within(document.body);

const tooltips = () =>
  document.querySelectorAll<HTMLElement>('[data-slot="tooltip-content"]');

/** Hover the control, expect one bubble with `text`, unhover, expect none. */
const expectHoverTooltip = async (control: HTMLElement, text: string) => {
  await userEvent.hover(control);
  await waitFor(() => expect(tooltips()).toHaveLength(1));
  await expect(tooltips()[0]).toHaveTextContent(text);
  await userEvent.unhover(control);
  await waitFor(() => expect(tooltips()).toHaveLength(0));
};

export const SelectFilterAndGroupValue = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      enableRowSelection
      groupedColumnMode="remove"
      columnFilterDisplayMode="subheader"
      initialState={{
        expanded: true,
        grouping: ['state'],
        showColumnFilters: true,
      }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    if (ST_BASE !== 'aria') return;
    const canvas = within(canvasElement);

    const rowCheckbox = (
      await canvas.findAllByRole('checkbox', { name: 'Toggle select row' })
    )[0]!;
    const rowControl = rowCheckbox.closest<HTMLElement>(
      '[data-slot="checkbox"]',
    )!;
    await expectHoverTooltip(rowControl, 'Toggle select row');

    // Keyboard focus opens the same bubble and blur closes it.
    rowCheckbox.focus();
    await waitFor(() => expect(tooltips()).toHaveLength(1));
    await expect(tooltips()[0]).toHaveTextContent('Toggle select row');
    rowCheckbox.blur();
    await waitFor(() => expect(tooltips()).toHaveLength(0));

    const filterControl = canvas
      .getByRole('checkbox', { name: 'Filter by Is Active' })
      .closest<HTMLElement>('[data-slot="checkbox"]')!;
    await expectHoverTooltip(filterControl, 'Filter by Is Active');

    // The grouped value names its grouping column, as in the other bases.
    const groupValue = canvas
      .getAllByText('Ohio')
      .find((element) => element.getAttribute('title') === 'State')!;
    await expectHoverTooltip(groupValue, 'State');

    // No bubble is left open, and none is in the document after the test.
    await expect(body.queryAllByRole('tooltip')).toHaveLength(0);
  },
};
