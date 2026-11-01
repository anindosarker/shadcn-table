import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// The search field stays mounted: it opens with its input focused, is inert
// while closed, and Escape inside it clears a value first, then closes the
// empty field and hands focus back to the toggle.

const meta: Meta = {
  title: 'Fixed Bugs/Search Field',
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

const panelOf = (canvasElement: HTMLElement) => {
  const input = within(canvasElement).getByPlaceholderText('Search');
  const panel = input.closest<HTMLElement>('[data-slot="collapsible-content"]');
  if (!panel) throw new Error('search panel not found');
  return { input, panel };
};

export const OpenCloseAndEscape = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');
    const toggle = canvas.getByRole('button', { name: 'Show/Hide search' });

    expect(panelOf(canvasElement).panel.inert).toBe(true);

    await userEvent.click(toggle);
    await waitFor(() =>
      expect(document.activeElement).toBe(panelOf(canvasElement).input),
    );
    await waitFor(() => {
      const { panel } = panelOf(canvasElement);
      expect(panel.inert).toBe(false);
      expect(panel.getBoundingClientRect().width).toBeGreaterThan(48);
    });

    await userEvent.click(toggle);
    await waitFor(() => expect(panelOf(canvasElement).panel.inert).toBe(true));

    await userEvent.click(toggle);
    await waitFor(() =>
      expect(document.activeElement).toBe(panelOf(canvasElement).input),
    );
    await userEvent.keyboard('Ma');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panelOf(canvasElement).input).toHaveValue(''));
    expect(panelOf(canvasElement).panel.inert).toBe(false);
    expect(document.activeElement).toBe(panelOf(canvasElement).input);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panelOf(canvasElement).panel.inert).toBe(true));
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  },
};

/** The field beside the toolbar buttons, opening toward the start. */
export const PositionRight = {
  render: () => <ShadcnTable columns={columns} data={data} />,
};

/** The field on its own at the toolbar start, opening toward the end. */
export const PositionLeft = {
  render: () => (
    <ShadcnTable columns={columns} data={data} positionGlobalFilter="left" />
  ),
};

/** A pointer click on the toggle opens the field with the input focused and the group ring drawn. */
export const RingAfterPointerOpen = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Mason');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show/Hide search' }),
    );
    const { input } = panelOf(canvasElement);
    await waitFor(() => expect(document.activeElement).toBe(input));
    const group = input.closest<HTMLElement>('[data-slot="input-group"]');
    if (!group) throw new Error('input group not found');
    await waitFor(() => {
      const shadow = getComputedStyle(group).boxShadow;
      expect(shadow).not.toBe('none');
      expect(shadow).toMatch(/ 3px/);
    });
  },
};
