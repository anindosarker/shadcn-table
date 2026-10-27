import { createRef, type ReactNode, useState } from 'react';
import {
  type ST_ColumnDef,
  ST_TableContainer,
  ST_TableProvider,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixed bug (findings, decisions-review item 11): the components that forward
// a ref dropped a React 19 callback ref's cleanup and, for the table
// container and the bottom toolbar, never handed the ref `null` on unmount.
// Each wrapper now returns a cleanup that runs the user's cleanup, or assigns
// `null` when the callback returned none.

const meta: Meta = {
  title: 'Fixed Bugs/Callback Refs',
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

// A callback ref that records every node it receives, every `null` call and
// every run of the cleanup it returns. React re-attaches an inline ref
// callback on each render (cleanup, then the new callback), so the
// assertions read the balance of attaches and cleanups, not raw counts.
const createRecorder = () => {
  const record = {
    attached: [] as HTMLDivElement[],
    cleanups: 0,
    nullCalls: 0,
  };
  const ref = (node: HTMLDivElement | null) => {
    if (!node) {
      record.nullCalls += 1;
      return;
    }
    record.attached.push(node);
    return () => {
      record.cleanups += 1;
    };
  };
  return { record, ref };
};

type Recorder = ReturnType<typeof createRecorder>;

// Mounts its children until the button is clicked.
const MountToggle = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(true);
  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-fit rounded-md border px-2 py-1"
        onClick={() => setMounted(false)}
        type="button"
      >
        Unmount
      </button>
      {mounted && children}
    </div>
  );
};

const unmount = async (canvasElement: HTMLElement) => {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (b) => b.textContent === 'Unmount',
  );
  await expect(button).toBeTruthy();
  await userEvent.click(button!);
  await waitFor(() => expect(canvasElement.querySelector('table')).toBeNull());
};

const assertCallbackRef = async (
  { record }: Recorder,
  canvasElement: HTMLElement,
) => {
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBe(3),
  );
  const node = record.attached.at(-1);
  await expect(node?.isConnected).toBe(true);
  await expect(node?.querySelector('table')).toBe(
    canvasElement.querySelector('table'),
  );
  await expect(record.attached.length - record.cleanups).toBe(1);

  await unmount(canvasElement);

  // One cleanup on unmount, and React never hands the ref `null` once the
  // callback returns a cleanup.
  await expect(record.attached.length - record.cleanups).toBe(0);
  await expect(record.nullCalls).toBe(0);
};

const providerRecorder = createRecorder();

const ProviderTable = () => {
  const table = useShadcnTable({ columns, data });
  return (
    <ST_TableProvider table={table}>
      <ST_TableContainer ref={providerRecorder.ref} />
    </ST_TableProvider>
  );
};

// A callback ref with a cleanup on `ST_TableContainer` under
// `ST_TableProvider`.
export const CallbackRefOnProviderContainer = {
  render: () => (
    <MountToggle>
      <ProviderTable />
    </MountToggle>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await assertCallbackRef(providerRecorder, canvasElement);
  },
};

const optionsRecorder = createRecorder();

// The same callback ref through `ShadcnTable`'s `stTableContainerProps`.
export const CallbackRefOnTableContainerProps = {
  render: () => (
    <MountToggle>
      <ShadcnTable
        columns={columns}
        data={data}
        stTableContainerProps={{ ref: optionsRecorder.ref }}
      />
    </MountToggle>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await assertCallbackRef(optionsRecorder, canvasElement);
  },
};

const containerRef = createRef<HTMLDivElement>();

// A plain ref object still receives the node, and `null` on unmount.
export const RefObjectOnTableContainerProps = {
  render: () => (
    <MountToggle>
      <ShadcnTable
        columns={columns}
        data={data}
        stTableContainerProps={{ ref: containerRef }}
      />
    </MountToggle>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr').length).toBe(3),
    );
    await expect(containerRef.current?.isConnected).toBe(true);
    await expect(containerRef.current?.querySelector('table')).toBe(
      canvasElement.querySelector('table'),
    );

    await unmount(canvasElement);

    await expect(containerRef.current).toBeNull();
  },
};
