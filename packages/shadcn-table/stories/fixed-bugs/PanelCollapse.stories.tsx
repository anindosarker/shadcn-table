import { useState } from 'react';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// The progress bar and the stacked alert banner keep their content while
// their panel collapses, so they animate shut instead of snapping, and drop
// it once the collapse is over.

const meta: Meta = {
  title: 'Fixed Bugs/Panel Collapse',
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

const progressBars = () =>
  document.querySelectorAll('[data-slot="progress"]').length;

const PanelsTable = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        data-testid="toggle"
        onClick={() => setShow((value) => !value)}
        type="button"
      >
        Toggle
      </button>
      <ShadcnTable
        columns={columns}
        data={data}
        renderTopToolbarCustomActions={() => <span>Actions</span>}
        state={{ showAlertBanner: show, showProgressBars: show }}
      />
    </>
  );
};

export const ProgressAndBannerCollapse = {
  render: () => <PanelsTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');
    expect(progressBars()).toBe(0);
    expect(canvas.queryByRole('alert')).toBeNull();

    await userEvent.click(canvas.getByTestId('toggle'));
    await waitFor(() => expect(progressBars()).toBeGreaterThan(0));
    await canvas.findByRole('alert');

    // Right after the collapse starts, both are still in the document.
    await userEvent.click(canvas.getByTestId('toggle'));
    expect(progressBars()).toBeGreaterThan(0);
    expect(canvas.queryByRole('alert', { hidden: true })).not.toBeNull();

    await waitFor(() => expect(progressBars()).toBe(0));
    await waitFor(() =>
      expect(canvas.queryByRole('alert', { hidden: true })).toBeNull(),
    );
  },
};
