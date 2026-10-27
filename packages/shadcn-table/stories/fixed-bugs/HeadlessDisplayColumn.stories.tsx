import { Component, type ReactNode } from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  ST_TableProvider,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixed bug (findings): a display column header rendered outside the layout
// through `flexRender(header.column.columnDef.header, header.getContext())`
// crashed, because the core table at `header.getContext().table` had no
// `state` for `ST_SelectCheckbox` to read.

const meta: Meta = {
  title: 'Fixed Bugs/Headless Display Column',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Anderson', lastName: 'Kim' },
  { firstName: 'Lily', lastName: 'Brown' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

// Renders the thrown message into the DOM, so the assertion reads it instead
// of Storybook's error overlay.
class HeadlessErrorBoundary extends Component<
  { children: ReactNode },
  { message: string | null }
> {
  state = { message: null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  render() {
    return this.state.message === null ? (
      this.props.children
    ) : (
      <pre data-testid="headless-error">{this.state.message}</pre>
    );
  }
}

const displayColumnIds = ['st-row-expand', 'st-row-select'];

// The select and expand display columns rendered outside `ShadcnTable`
// through `flexRender` with the core header context, both the `header`
// label and the `Header` component the library renders itself.
const HeadlessHeaders = ({ component }: { component: boolean }) => {
  const table = useShadcnTable({
    columns,
    data,
    enableExpanding: true,
    enableRowSelection: true,
    getSubRows: () => undefined,
  });
  const headers = table
    .getHeaderGroups()[0]
    .headers.filter((header) => displayColumnIds.includes(header.column.id));
  return (
    <ST_TableProvider table={table}>
      <HeadlessErrorBoundary>
        <div data-testid="headless-headers">
          {headers.map((header) => (
            <div data-column-id={header.column.id} key={header.id}>
              {flexRender(
                component
                  ? // `Header` types its props for the ST instance, which the
                    // core header context is not; the cast is the headless
                    // caller's own, the render decides whether it holds up.
                    (header.column.columnDef.Header as ReactNode)
                  : header.column.columnDef.header,
                header.getContext(),
              )}
            </div>
          ))}
        </div>
      </HeadlessErrorBoundary>
    </ST_TableProvider>
  );
};

// No error, and both display column headers render.
const expectHeadlessRendered = (canvasElement: HTMLElement) =>
  waitFor(() => {
    expect(canvasElement.querySelector('[data-testid="headless-error"]')).toBe(
      null,
    );
    expect(
      canvasElement.querySelectorAll('[data-testid="headless-headers"] > div')
        .length,
    ).toBe(2);
  });

export const HeadlessDisplayColumnHeaders = () => (
  <HeadlessHeaders component={false} />
);

HeadlessDisplayColumnHeaders.play = async ({ canvasElement }: StoryContext) =>
  expectHeadlessRendered(canvasElement);

export const HeadlessDisplayColumnHeaderComponents = () => (
  <HeadlessHeaders component />
);

// The select-all checkbox the `Header` component renders is there.
HeadlessDisplayColumnHeaderComponents.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  await expectHeadlessRendered(canvasElement);
  await expect(
    await canvas.findByRole('checkbox', { name: 'Toggle select all' }),
  ).toBeInTheDocument();
};
