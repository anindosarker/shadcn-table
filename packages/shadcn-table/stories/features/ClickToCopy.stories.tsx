import { type Meta, type StoryContext } from '@storybook/react-vite';
import {
  expect,
  fireEvent,
  spyOn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';
import {
  type ST_ColumnDef,
  useShadcnTable,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Click To Copy',
};

export default meta;

interface Person {
  address: string;
  city: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  state: string;
}

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'name.firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'name.lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
];

const data: Person[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  name: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  },
  state: faker.location.state(),
}));

export const ClickToCopyEnabled = () => {
  const table = useShadcnTable({
    columns,
    data,
    enableClickToCopy: true,
  });
  return <ShadcnTable table={table} />;
};

export const ClickToCopyEnabledWithColumnResizing = () => {
  const table = useShadcnTable({
    columns,
    data,
    enableClickToCopy: true,
    enableColumnResizing: true,
  });

  return <ShadcnTable table={table} />;
};

export const ClickToCopyEnabledPerColumn = () => {
  const table = useShadcnTable({
    columns: [
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'email',
        enableClickToCopy: true,
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
    ],
    data,
  });

  return <ShadcnTable table={table} />;
};

export const ClickToCopyDisabledPerColumn = () => {
  const table = useShadcnTable({
    columns: [
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'email',
        enableClickToCopy: false,
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
    ],
    data,
    enableClickToCopy: true,
  });

  return <ShadcnTable table={table} />;
};

interface Contact {
  city: string;
  email: string;
  firstName: string;
  lastName: string;
}

const contactColumns: ST_ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    icon: MailIcon,
    stCopyButtonProps: {
      className: 'w-full justify-start',
    },
  },
  {
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
  },
];

const contacts: Contact[] = [
  {
    city: 'East Daphne',
    email: 'dmurray@yopmail.com',
    firstName: 'Dylan',
    lastName: 'Murray',
  },
  {
    city: 'Columbus',
    email: 'rkholer33@yopmail.com',
    firstName: 'Raquel',
    lastName: 'Kohler',
  },
  {
    city: 'South Linda',
    email: 'ereinger@mailinator.com',
    firstName: 'Ervin',
    lastName: 'Reinger',
  },
  {
    city: 'Lincoln',
    email: 'bmccullough44@mailinator.com',
    firstName: 'Brittany',
    lastName: 'McCullough',
  },
  {
    city: 'New York',
    email: 'bframi@yopmain.com',
    firstName: 'Branson',
    lastName: 'Frami',
  },
];

/**
 * The docs example of the Click to Copy guide (examples/<base>/
 * enable-click-to-copy): click to copy on for the whole table, the Email
 * copy button stretched to the cell's width.
 */
export const ClickToCopyEnabledWithCopyButtonProps = () => (
  <ShadcnTable columns={contactColumns} data={contacts} enableClickToCopy />
);

/**
 * A click on a cell copies its text to the clipboard, and the tooltip says
 * it was copied.
 */
ClickToCopyEnabled.play = async ({ canvasElement }: StoryContext) => {
  const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(
    undefined,
  );
  try {
    const value = data[0].name.firstName;
    const [text] = await within(canvasElement).findAllByText(value);
    const button = text!.closest<HTMLElement>('button')!;
    const input = pointerInput();
    await input.click(button);
    expect(writeText).toHaveBeenCalledWith(value);
    // The press closes the tooltip. Keyboard focus opens it at once, inside
    // the 4 s the copied title lasts, without the 1 s hover delay.
    await input.tab();
    await tooltipsGone();
    await input.tab({ shift: true });
    expect(document.activeElement).toBe(button);
    await waitFor(
      () => expect(tooltipTexts()).toContain('Copied to clipboard'),
      { timeout: 3000 },
    );
  } finally {
    writeText.mockRestore();
  }
};

/**
 * With click to copy on for the table and off for Email Address: a First
 * Name cell shows the Click to copy tooltip and copies on a click;
 * an Email Address cell has no copy button and copies nothing.
 */
ClickToCopyDisabledPerColumn.play = async ({ canvasElement }: StoryContext) => {
  const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(
    undefined,
  );
  try {
    const canvas = within(canvasElement);
    const value = data[0]!.name.firstName;
    const [text] = await canvas.findAllByText(value);
    const button = text!.closest<HTMLElement>('button');
    expect(button).not.toBeNull();
    const input = pointerInput();
    // Keyboard focus opens the tooltip at once, without the hover delay; on
    // React Aria a hover over a name the copy button cuts off opens the
    // cell's overflow tooltip instead.
    button!.focus();
    await input.tab();
    await tooltipsGone();
    await input.tab({ shift: true });
    expect(document.activeElement).toBe(button);
    await waitFor(() => expect(tooltipTexts()).toContain('Click to copy'), {
      timeout: 3000,
    });
    await input.click(button!);
    expect(writeText).toHaveBeenCalledWith(value);

    const [email] = canvas.getAllByText(data[0]!.email);
    expect(email!.closest('button')).toBeNull();
    await input.click(email!);
    expect(writeText).toHaveBeenCalledTimes(1);
  } finally {
    writeText.mockRestore();
  }
};

/**
 * Every column copies: a click on the first cell of each column copies that
 * cell's text.
 */
ClickToCopyEnabledWithCopyButtonProps.play = async ({
  canvasElement,
}: StoryContext) => {
  const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(
    undefined,
  );
  try {
    const canvas = within(canvasElement);
    const input = pointerInput();
    const first = contacts[0]!;
    const values = [first.firstName, first.lastName, first.email, first.city];
    for (const value of values) {
      const [text] = await canvas.findAllByText(value);
      const button = text!.closest<HTMLElement>('button');
      expect(button).not.toBeNull();
      await input.click(button!);
      expect(writeText).toHaveBeenLastCalledWith(value);
    }
    expect(writeText).toHaveBeenCalledTimes(values.length);
  } finally {
    writeText.mockRestore();
  }
};

/**
 * The open tooltips' texts. A closing tooltip stays in the DOM through its
 * exit animation (Radix data-state="closed", Base UI data-closed, React Aria
 * data-exiting) and does not count.
 */
const tooltipTexts = () =>
  [...document.querySelectorAll('[data-slot="tooltip-content"]')]
    .filter(
      (tooltip) =>
        !tooltip.matches(
          '[data-state="closed"], [data-closed], [data-ending-style], [data-exiting]',
        ),
    )
    .map((tooltip) => tooltip.textContent);

/**
 * Waits until every tooltip has left the DOM, exit animation included. On
 * Radix a tooltip focused again while its content still animates out does
 * not open: the focus also reaches the cell's overflow tooltip, whose open
 * event closes every tooltip content still mounted, the closing one too.
 */
const tooltipsGone = () =>
  waitFor(
    () =>
      expect(
        document.querySelector('[data-slot="tooltip-content"]'),
      ).toBeNull(),
    { timeout: 3000 },
  );

/**
 * The real browser pointer and keyboard under vitest (.storybook/vitest.setup.ts),
 * else Storybook's simulated events.
 */
const pointerInput = () =>
  (
    globalThis as {
      stBrowserUserEvent?: {
        click: (element: Element) => Promise<void>;
        tab: (options?: { shift?: boolean }) => Promise<void>;
      };
    }
  ).stBrowserUserEvent ?? userEvent;

// A copy column narrowed below the button's width keeps the button inside its
// cell, and a pointer hover on the button shows "Click to copy" (D127).
ClickToCopyEnabledWithColumnResizing.play = async ({
  canvasElement,
}: StoryContext) => {
  await within(canvasElement).findAllByText(data[0].email);
  // The resize renders the rows anew, so each step reads the cell again.
  const cell = () =>
    canvasElement.querySelector<HTMLElement>(
      'tbody td[data-flip-column="email"]',
    )!;
  const button = () => cell().querySelector<HTMLElement>('button')!;
  const value = button().textContent;
  const buttonWidth = button().getBoundingClientRect().width;
  const th = canvasElement.querySelector<HTMLElement>(
    'thead th[data-flip-column="email"]',
  )!;
  const handle = th.querySelector<HTMLElement>('.cursor-col-resize')!;
  const start = th.getBoundingClientRect();
  const point = { clientX: start.right, clientY: start.top + 5 };
  const end = { ...point, clientX: start.left + 60 };
  fireEvent.mouseDown(handle, point);
  fireEvent.mouseMove(document, end);
  fireEvent.mouseUp(document, end);
  await waitFor(() =>
    expect(cell().getBoundingClientRect().width).toBeLessThan(buttonWidth),
  );
  const box = button().getBoundingClientRect();
  const cellBox = cell().getBoundingClientRect();
  expect(box.left).toBeGreaterThanOrEqual(cellBox.left);
  expect(box.right).toBeLessThanOrEqual(cellBox.right);
  const browserUserEvent = (
    globalThis as {
      stBrowserUserEvent?: { hover: (element: Element) => Promise<void> };
    }
  ).stBrowserUserEvent;
  const input = browserUserEvent ?? userEvent;
  // React Aria opens a hover tooltip only once an earlier pointer move has
  // set the pointer modality, as any real pointer does on its way in.
  await input.hover(th);
  await input.hover(button());
  const tooltips = () =>
    [...document.querySelectorAll('[data-slot="tooltip-content"]')].map(
      (tooltip) => tooltip.textContent,
    );
  await waitFor(() => expect(tooltips()).toContain('Click to copy'), {
    timeout: 3000,
  });
  expect(tooltips()).not.toContain(value);
};
