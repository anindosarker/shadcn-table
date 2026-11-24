import { useState } from 'react';
import { DatePicker } from '@/components/date-picker/date-picker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Spec 87 1.6.1: the picker's range mode hands one end alone to onChange.
// Proof before the table changes; removed before the merge.

type RangeValue = [string, string];

type PickerType = 'date' | 'datetime' | 'time';

const meta: Meta = {
  title: 'Miscellaneous/Range Picker One End',
};

export default meta;

const realKeyboard = () =>
  (
    globalThis as {
      stBrowserUserEvent?: { keyboard: (text: string) => Promise<void> };
    }
  ).stBrowserUserEvent ?? userEvent;

const realClick = (element: HTMLElement) =>
  (
    (
      globalThis as {
        stBrowserUserEvent?: { click: (element: HTMLElement) => Promise<void> };
      }
    ).stBrowserUserEvent ?? userEvent
  ).click(element);

const RangeProbe = ({ type }: { type: PickerType }) => {
  const [value, setValue] = useState<RangeValue>(['', '']);
  const [calls, setCalls] = useState<RangeValue[]>([]);
  const onChange = (next: RangeValue) => {
    setValue(next);
    setCalls((old) => [...old, next]);
  };
  return (
    <div>
      <DatePicker onChange={onChange} range type={type} value={value} />
      <button onClick={() => setValue(['', ''])} type="button">
        Reset
      </button>
      <output data-testid="last-change">
        {JSON.stringify(calls.at(-1) ?? null)}
      </output>
    </div>
  );
};

const endInput = (root: ReturnType<typeof within>, end: 'From' | 'To') =>
  root
    .getAllByLabelText(end)
    .find(
      (element): element is HTMLInputElement =>
        element instanceof HTMLInputElement,
    )!;

const lastChange = (canvasElement: HTMLElement) =>
  JSON.parse(
    within(canvasElement).getByTestId('last-change').textContent ?? 'null',
  ) as RangeValue | null;

const proveOneEnd = async ({
  canvasElement,
  popupName,
  openerName,
  start,
  end,
}: {
  canvasElement: HTMLElement;
  popupName?: string;
  openerName?: string;
  start: { keys: string; value: string };
  end: { keys: string; value: string };
}) => {
  const canvas = within(canvasElement);
  const openRoot = async () => {
    if (!popupName) return canvas;
    await realClick(canvas.getByRole('button', { name: openerName }));
    // React Aria's popover is not in the accessibility tree testing-library reads.
    const popup = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        `[role="dialog"][aria-label="${popupName}"]`,
      );
      expect(element).toBeVisible();
      return element!;
    });
    return within(popup);
  };

  const from = endInput(await openRoot(), 'From');
  from.focus();
  await realKeyboard().keyboard(start.keys);
  await waitFor(() =>
    expect(lastChange(canvasElement)).toEqual([start.value, '']),
  );

  if (popupName) {
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        document.querySelector(`[role="dialog"][aria-label="${popupName}"]`),
      ).toBeNull(),
    );
  }
  await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));

  const to = endInput(await openRoot(), 'To');
  await waitFor(() => expect(to).toHaveValue(''));
  to.focus();
  await realKeyboard().keyboard(end.keys);
  await waitFor(() =>
    expect(lastChange(canvasElement)).toEqual(['', end.value]),
  );
};

export const DateStartOnlyThenEndOnly = {
  render: () => <RangeProbe type="date" />,
  play: ({ canvasElement }: StoryContext) =>
    proveOneEnd({
      canvasElement,
      popupName: 'Date range',
      openerName: 'Pick a date',
      start: { keys: '10102025', value: '2025-10-10' },
      end: { keys: '11112025', value: '2025-11-11' },
    }),
};

export const DateTimeStartOnlyThenEndOnly = {
  render: () => <RangeProbe type="datetime" />,
  play: ({ canvasElement }: StoryContext) =>
    proveOneEnd({
      canvasElement,
      popupName: 'Date and time range',
      openerName: 'Pick a date and time range',
      start: { keys: '101020250830AM', value: '2025-10-10T08:30' },
      end: { keys: '111120250945PM', value: '2025-11-11T21:45' },
    }),
};

export const TimeStartOnlyThenEndOnly = {
  render: () => <RangeProbe type="time" />,
  play: ({ canvasElement }: StoryContext) =>
    proveOneEnd({
      canvasElement,
      start: { keys: '0830AM', value: '08:30' },
      end: { keys: '0945PM', value: '21:45' },
    }),
};
