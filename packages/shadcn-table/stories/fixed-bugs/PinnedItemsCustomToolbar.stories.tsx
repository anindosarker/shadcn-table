import { CircleDotIcon, FlagIcon, TypeIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
  ST_GlobalFilterTextField,
  ST_ViewSettingsButton,
} from '@/components/ui/shadcn-table';

// F36: the view items pinned to the toolbar render beside
// ST_ViewSettingsButton in a custom toolbar too, and once, in the D8 order,
// in the stock toolbar.
const meta: Meta = {
  title: 'Fixed Bugs/Pinned Items Custom Toolbar',
};

export default meta;

type Task = { name: string; priority: string; status: string };

const data: Task[] = [
  { name: 'Build search index', priority: 'High', status: 'Done' },
  { name: 'Plan audit log', priority: 'Low', status: 'In Progress' },
  { name: 'Review billing page', priority: 'High', status: 'Not Started' },
];

const columns: ST_ColumnDef<Task>[] = [
  { accessorKey: 'name', header: 'Name', icon: TypeIcon },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
];

const options: Partial<ST_TableOptions<Task>> = {
  enableViewSettings: true,
};

export const CustomTopToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    {...options}
    initialState={{ viewSettings: { pins: [] } }}
    renderTopToolbar={({ table }) => (
      <div
        className="flex items-center justify-between gap-2 p-2"
        data-testid="custom-toolbar"
      >
        <ST_GlobalFilterTextField />
        <div className="flex items-center gap-0.5">
          <ST_ViewSettingsButton table={table} />
        </div>
      </div>
    )}
  />
);

export const StockToolbar = () => (
  <ShadcnTable columns={columns} data={data} {...options} />
);

export const PinInCustomToolbar = {
  render: CustomTopToolbar,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');
    expect(canvas.queryByRole('button', { name: 'Toggle density' })).toBeNull();

    const settings = canvas.getByRole('button', { name: 'View settings' });
    await userEvent.click(settings);
    await userEvent.click(
      await body.findByRole('button', { name: 'Pin to toolbar: Density' }),
    );

    const density = await canvas.findByRole('button', {
      name: 'Toggle density',
    });
    // Beside the settings button: same parent, right before it.
    expect(density.parentElement).toBe(settings.parentElement);
    expect(
      density.compareDocumentPosition(settings) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      within(canvas.getByTestId('custom-toolbar')).getAllByRole('button', {
        name: 'Toggle density',
      }),
    ).toHaveLength(1);
  },
};

export const PinsInStockToolbarOrder = {
  render: StockToolbar,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Plan audit log');
    const names = [
      'Show/Hide columns',
      'Toggle density',
      'Toggle full screen',
      'View settings',
    ];
    // Each once, in the D8 order: pinned items, full screen, settings.
    expect(
      [...canvasElement.querySelectorAll<HTMLElement>('button[aria-label]')]
        .map((button) => button.getAttribute('aria-label'))
        .filter((name): name is string => names.includes(name ?? '')),
    ).toEqual(names);
  },
};
