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
  title: 'Features/Click to Copy Examples',
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
  });

  return <ShadcnTable table={table} />;
};

/**
 * A click on a cell copies its text to the clipboard, and the tooltip says
 * it was copied.
 */
export const ClickCopiesValue = {
  render: () => <ClickToCopyEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(
      undefined,
    );
    try {
      const value = data[0].name.firstName;
      const [text] = await within(canvasElement).findAllByText(value);
      const button = text!.closest<HTMLElement>('button')!;
      const browserUserEvent = (
        globalThis as {
          stBrowserUserEvent?: {
            click: (element: Element) => Promise<void>;
            tab: (options?: { shift?: boolean }) => Promise<void>;
          };
        }
      ).stBrowserUserEvent;
      const input = browserUserEvent ?? userEvent;
      await input.click(button);
      expect(writeText).toHaveBeenCalledWith(value);
      // The press closes the tooltip. Keyboard focus opens it at once, inside
      // the 4 s the copied title lasts, without the 1 s hover delay.
      await input.tab();
      await input.tab({ shift: true });
      expect(document.activeElement).toBe(button);
      await waitFor(() =>
        expect(
          [...document.querySelectorAll('[data-slot="tooltip-content"]')].map(
            (tooltip) => tooltip.textContent,
          ),
        ).toContain('Copied to clipboard'),
      );
    } finally {
      writeText.mockRestore();
    }
  },
};

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
