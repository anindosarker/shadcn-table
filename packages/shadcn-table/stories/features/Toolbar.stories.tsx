import {
  CakeIcon,
  MapPinIcon,
  PhoneIcon,
  SquarePlus,
  Trash2,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type ST_ColumnDef,
  ST_ToggleFullScreenButton,
  ST_Tooltip,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
}));

export const ToolbarEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    renderToolbarInternalActions={() => {
      return (
        <>
          <ST_ToggleFullScreenButton />
        </>
      );
    }}
  />
);

export const TableTitle = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h4 className="text-3xl font-normal">Table Title</h4>;
    }}
  />
);

export const CustomTopToolbarActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            className="bg-sky-600 text-white hover:bg-sky-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            className="bg-sky-600 text-white hover:bg-sky-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderTopToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
          <ST_Tooltip title="Remove Users">
            <span>
              <Button
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
                size="icon"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </span>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderBottomToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
          <ST_Tooltip title="Remove Users">
            <span>
              <Button
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
                size="icon"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </span>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderTopToolbar={() => <div className="p-8">Custom Top Toolbar</div>}
  />
);

export const renderCustomBottomToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => <div className="p-8">Custom Bottom Toolbar</div>}
  />
);

/** The internal button group, found from its full screen toggle. */
const internalButtonsGroup = (button: HTMLElement) => {
  let group = button.parentElement;
  while (group && !group.classList.contains('z-3')) group = group.parentElement;
  if (!group) throw new Error('internal buttons group not found');
  return group;
};

/** Whether the button, or its wrapper inside the group, runs a mount animation. */
const animatesIn = (button: HTMLElement, group: HTMLElement) => {
  for (
    let element: HTMLElement | null = button;
    element && element !== group;
    element = element.parentElement
  ) {
    const style = getComputedStyle(element);
    if (
      style.display !== 'contents' &&
      (element.getAnimations().length > 0 || style.animationName !== 'none')
    ) {
      return true;
    }
  }
  return false;
};

// Every internal toolbar button fades and zooms in on mount, as the pinned
// view items do, so the toolbar appears as one (F40).
export const InternalButtonsAnimateIn = {
  render: () => <ShadcnTable columns={columns} data={data} enableSortPopover />,
  play: async ({ canvasElement }: StoryContext) => {
    const fullScreen = await within(canvasElement).findByRole('button', {
      name: /full screen/i,
    });
    const group = internalButtonsGroup(fullScreen);
    const buttons = [...group.querySelectorAll<HTMLElement>('button')];
    expect(buttons.length).toBeGreaterThan(3);
    for (const button of buttons) {
      expect(
        animatesIn(button, group),
        button.getAttribute('aria-label') ?? button.textContent ?? '',
      ).toBe(true);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(() => {
      for (const button of buttons) {
        for (
          let element: HTMLElement | null = button;
          element && element !== group;
          element = element.parentElement
        ) {
          expect(getComputedStyle(element).opacity).toBe('1');
        }
      }
    });
  },
};
