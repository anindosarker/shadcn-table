import {
  type ST_ColumnDef,
  ST_TableProvider,
  ST_ToggleFullScreenButton,
  useShadcnTable,
  useST_FullScreenContainer,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// A headless layout spreads `containerProps` from useST_FullScreenContainer
// on its own wrapper: the wrapper fills the screen, and Escape inside it
// leaves full screen.

const meta: Meta = {
  title: 'Fixed Bugs/Headless Full Screen',
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

const HeadlessTable = () => {
  const table = useShadcnTable({ columns, data });
  const { containerProps, isFullScreen } = useST_FullScreenContainer(table);
  return (
    <ST_TableProvider table={table}>
      <div data-testid="headless-wrapper" {...containerProps}>
        <ST_ToggleFullScreenButton />
        <p>{isFullScreen ? 'Full screen' : 'Inline'}</p>
        <ul>
          {table.getRowModel().rows.map((row) => (
            <li key={row.id}>{row.original.firstName}</li>
          ))}
        </ul>
      </div>
    </ST_TableProvider>
  );
};

export const EscapeLeavesFullScreen = {
  render: () => <HeadlessTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');
    const wrapper = canvas.getByTestId('headless-wrapper');
    expect(wrapper).not.toHaveAttribute('tabindex');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle full screen' }),
    );
    await canvas.findByText('Full screen');
    expect(wrapper).toHaveAttribute('tabindex', '-1');
    expect(wrapper.className).toContain('fixed');

    wrapper.focus();
    await userEvent.keyboard('{Escape}');
    await canvas.findByText('Inline');
    await waitFor(() => expect(wrapper.className).not.toContain('fixed'));
  },
};
