'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
  ST_ToggleDensePaddingButton,
  ST_ToggleFullScreenButton,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    positionToolbarAlertBanner: 'bottom', //show selected rows count on bottom toolbar
    //add custom action buttons to top-left of top toolbar
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex gap-4 p-1">
        <Button
          variant="secondary"
          onPress={() => {
            alert('Create New Account');
          }}
        >
          Create Account
        </Button>
        <Button
          variant="destructive"
          isDisabled={!table.getIsSomeRowsSelected()}
          onPress={() => {
            alert('Delete Selected Accounts');
          }}
        >
          Delete Selected Accounts
        </Button>
      </div>
    ),
    //customize built-in buttons in the top-right of top toolbar
    renderToolbarInternalActions: ({ table }) => (
      <div>
        {/* add custom button to print table  */}
        <Button
          variant="ghost"
          size="icon"
          onPress={() => {
            window.print();
          }}
        >
          <Printer />
        </Button>
        {/* along-side built-in buttons in whatever order you want them */}
        <ST_ToggleDensePaddingButton />
        <ST_ToggleFullScreenButton />
      </div>
    ),
  });

  return <ShadcnTable table={table} />;
};

export default Example;
