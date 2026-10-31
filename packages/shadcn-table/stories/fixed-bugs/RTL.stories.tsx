import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// A right-to-left page: the pinned column sticks through inset-inline-start,
// and the resize handle sits at each header cell's inline-end edge, which is
// the left side in RTL.

const meta: Meta = {
  title: 'Fixed Bugs/RTL',
};

export default meta;

type Person = { firstName: string; lastName: string; city: string };

const data: Person[] = [
  { city: 'Cairo', firstName: 'Mason', lastName: 'Lee' },
  { city: 'Dubai', firstName: 'Lily', lastName: 'Park' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
];

export const RightToLeft = {
  render: () => (
    <div dir="rtl">
      <ShadcnTable
        columnResizeDirection="rtl"
        columns={columns}
        data={data}
        enableColumnPinning
        enableColumnResizing
        initialState={{ columnPinning: { end: [], start: ['firstName'] } }}
      />
    </div>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');

    const pinnedCell = canvas.getByText('Mason').closest('td');
    if (!pinnedCell) throw new Error('pinned cell not found');
    await waitFor(() => expect(pinnedCell.style.insetInlineStart).not.toBe(''));
    expect(getComputedStyle(pinnedCell).position).toBe('sticky');

    const header = canvas.getByRole('columnheader', { name: /Last Name/ });
    const handle = header.querySelector<HTMLElement>('.cursor-col-resize');
    if (!handle) throw new Error('resize handle not found');
    const headerBox = header.getBoundingClientRect();
    const handleBox = handle.getBoundingClientRect();
    const handleCenter = handleBox.left + handleBox.width / 2;
    // Within a handle's width of the cell's left edge, nowhere near the right.
    expect(Math.abs(handleCenter - headerBox.left)).toBeLessThan(16);
    expect(headerBox.right - handleCenter).toBeGreaterThan(headerBox.width / 2);
  },
};
