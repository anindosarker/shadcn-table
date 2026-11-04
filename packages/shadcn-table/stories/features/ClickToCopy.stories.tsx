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
      const button = (
        await within(canvasElement).findByText(value)
      ).closest<HTMLElement>('button')!;
      const browserUserEvent = (
        globalThis as {
          stBrowserUserEvent?: {
            click: (element: Element) => Promise<void>;
            hover: (element: Element) => Promise<void>;
          };
        }
      ).stBrowserUserEvent;
      const pointer = browserUserEvent ?? userEvent;
      await pointer.click(button);
      expect(writeText).toHaveBeenCalledWith(value);
      // The press closes the tooltip; resting on the button again shows the
      // copied title after the 1 s tooltip delay.
      await pointer.hover(
        within(canvasElement).getAllByRole('columnheader')[0]!,
      );
      await pointer.hover(button);
      await waitFor(
        () =>
          expect(
            [...document.querySelectorAll('[data-slot="tooltip-content"]')].map(
              (tooltip) => tooltip.textContent,
            ),
          ).toContain('Copied to clipboard'),
        { timeout: 2500 },
      );
    } finally {
      writeText.mockRestore();
    }
  },
};
