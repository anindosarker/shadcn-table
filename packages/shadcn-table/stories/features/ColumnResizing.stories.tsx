import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  CakeIcon,
  HashIcon,
  MailboxIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Resizing Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'zipCode',
    header: 'Zip Code',
    icon: MailboxIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(88)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  id: faker.number.int(100),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
}));

export const ColumnResizingEnabledDefaultOnChange = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Resizing is on by default; `false` removes the resize handles.
export const ColumnResizingDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnResizing={false} />
);

export const ColumnResizingEnabledDefaultOnChangeRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable columnResizeDirection="rtl" columns={columns} data={data} />
  </div>
);

export const ColumnResizingEnabledDefaultOnChangeGrid = () => (
  <ShadcnTable columns={columns} data={data} layoutMode="grid" />
);

export const ColumnResizingDefaultOnChangeGridWithIndividualShrink = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        grow: false,
        header: 'ID',
        icon: HashIcon,
        size: 50,
      },
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
    ]}
    data={data}
    layoutMode="grid"
  />
);

export const ColumnResizingEnabledDefaultOnChangeGridRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns}
      data={data}
      layoutMode="grid"
    />
  </div>
);

export const ColumnResizingEnabledDefaultOnChangeSemantic = () => (
  <ShadcnTable columns={columns} data={data} layoutMode="semantic" />
);

export const ColumnResizingEnabledDefaultOnChangeSemanticRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns}
      data={data}
      layoutMode="semantic"
    />
  </div>
);

export const ColumnResizingEnabledNoColumnActions = () => (
  <ShadcnTable columns={columns} data={data} enableColumnActions={false} />
);

export const ColumnResizingDisabledSomeColumns = () => (
  <ShadcnTable
    columns={[
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
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'zipCode',
        enableResizing: false,
        header: 'Zip Code',
        icon: MailboxIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);

export const ColumnResizingEnabledOnEnd = () => (
  <ShadcnTable columnResizeMode="onEnd" columns={columns} data={data} />
);

export const ColumnResizingEnabledOnEndRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columnResizeMode="onEnd"
      columns={columns}
      data={data}
    />
  </div>
);

export const ColumnResizingCustomDefaultWidths = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultColumn={{ maxSize: 300, minSize: 100, size: 150 }}
  />
);

export const ColumnResizingWithPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      columnPinning: { start: ['firstName', 'lastName'], end: [] },
    }}
  />
);

export const ColumnResizingWithHeaderGroups = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
          {
            accessorKey: 'firstName',
            footer: 'First Name',
            header: 'First Name',
            icon: UserIcon,
          },

          {
            accessorKey: 'lastName',
            footer: 'Last Name',
            header: 'Last Name',
            icon: UserIcon,
          },
        ],
        footer: 'Name',
        header: 'Name',
      },
      {
        columns: [
          {
            accessorKey: 'age',
            footer: 'Age',
            header: 'Age',
            icon: CakeIcon,
          },
          {
            accessorKey: 'address',
            footer: 'Address',
            header: 'Address',
            icon: MapPinIcon,
          },
        ],
        footer: 'Info',
        header: 'Info',
      },
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }))}
  />
);

export const ColumnResizingWithHeaderGroupsGridGrow = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
          {
            accessorKey: 'firstName',
            footer: 'First Name',
            header: 'First Name',
            icon: UserIcon,
          },

          {
            accessorKey: 'lastName',
            footer: 'Last Name',
            header: 'Last Name',
            icon: UserIcon,
          },
        ],
        footer: 'Name',
        header: 'Name',
      },
      {
        columns: [
          {
            accessorKey: 'age',
            footer: 'Age',
            header: 'Age',
            icon: CakeIcon,
          },
          {
            accessorKey: 'address',
            footer: 'Address',
            header: 'Address',
            icon: MapPinIcon,
          },
        ],
        footer: 'Info',
        header: 'Info',
      },
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }))}
    enableRowSelection
    layoutMode="grid"
  />
);

export const ColumnResizingLayoutGridGrow = () => (
  <ShadcnTable
    columns={columns.slice(0, 3)}
    data={data}
    enableRowSelection
    layoutMode="grid"
  />
);

export const ColumnResizingLayoutGridGrowRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns.slice(0, 3)}
      data={data}
      enableRowSelection
      layoutMode="grid"
    />
  </div>
);

/**
 * Mid-drag of the First Name resize handle, the lit header hairline and the
 * body guide line are one 1 px line ending on the column's trailing edge
 * (F39). Under 'onEnd' the edge is where the drag will put it: the cell's
 * edge plus the drag.
 */
const expectResizeGuidesMeetEdge =
  (mode: 'onChange' | 'onEnd') =>
  async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('columnheader', { name: /First Name/ });
    const th = canvasElement.querySelector<HTMLElement>(
      'thead th[data-flip-column="firstName"]',
    )!;
    const handle = th.querySelector<HTMLElement>('.cursor-col-resize')!;
    const browserUserEvent = (
      globalThis as {
        stBrowserUserEvent?: { hover: (element: Element) => Promise<void> };
      }
    ).stBrowserUserEvent;
    await browserUserEvent?.hover(th);
    const boxStyle = (element: HTMLElement) => {
      const style = getComputedStyle(element);
      return [
        style.borderTop,
        style.borderRight,
        style.borderLeft,
        style.outlineStyle,
        style.boxShadow,
      ].join('|');
    };
    const restingBox = boxStyle(th);
    const start = th.getBoundingClientRect();
    const startX = start.right;
    const dx = 40;
    fireEvent.mouseDown(handle, { clientX: startX, clientY: start.top + 5 });
    fireEvent.mouseMove(document, {
      clientX: startX + dx,
      clientY: start.top + 5,
    });
    try {
      await waitFor(() => {
        const edge =
          mode === 'onEnd' ? startX + dx : th.getBoundingClientRect().right;
        // onChange moves the edge with the drag; onEnd only the hairline.
        if (mode === 'onEnd') {
          expect(th.getBoundingClientRect().right).toBe(startX);
        } else {
          expect(th.getBoundingClientRect().right).toBeGreaterThan(startX);
        }
        const line = handle.firstElementChild!.getBoundingClientRect();
        expect(line.width).toBe(1);
        expect(Math.abs(line.right - edge)).toBeLessThanOrEqual(0.25);
        const cells = [
          ...canvasElement.querySelectorAll<HTMLElement>(
            'tbody td[data-flip-column="firstName"]',
          ),
        ];
        expect(cells.length).toBeGreaterThan(0);
        for (const cell of cells) {
          const width = getComputedStyle(cell).borderInlineEndWidth;
          if (mode === 'onEnd') {
            // The body cells keep their width until the drop and clip, so
            // onEnd shows the hairline alone.
            expect(width).toBe('0px');
            continue;
          }
          // The guide is the cell's 1 px end border: the hairline's x range,
          // over the full row height.
          expect(width).toBe('1px');
          const box = cell.getBoundingClientRect();
          expect(Math.abs(box.right - 1 - line.left)).toBeLessThanOrEqual(0.25);
          expect(Math.abs(box.right - line.right)).toBeLessThanOrEqual(0.25);
        }
        // No box around the cell while it resizes.
        expect(boxStyle(th)).toBe(restingBox);
      });
    } finally {
      fireEvent.mouseUp(document, {
        clientX: startX + dx,
        clientY: start.top + 5,
      });
    }
  };

export const ResizeGuidesMeetEdge = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: expectResizeGuidesMeetEdge('onChange'),
};

export const ResizeGuidesMeetEdgeOnEnd = {
  render: () => (
    <ShadcnTable columnResizeMode="onEnd" columns={columns} data={data} />
  ),
  play: expectResizeGuidesMeetEdge('onEnd'),
};
