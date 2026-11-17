import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
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
    await input.tab({ shift: true });
    expect(document.activeElement).toBe(button);
    await waitFor(() =>
      expect(tooltipTexts()).toContain('Copied to clipboard'),
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
    await input.tab({ shift: true });
    expect(document.activeElement).toBe(button);
    await waitFor(() => expect(tooltipTexts()).toContain('Click to copy'));
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

/** The open tooltips' texts. */
const tooltipTexts = () =>
  [...document.querySelectorAll('[data-slot="tooltip-content"]')].map(
    (tooltip) => tooltip.textContent,
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
