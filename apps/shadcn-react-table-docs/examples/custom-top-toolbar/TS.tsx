'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  SRT_ToggleDensePaddingButton,
  SRT_ToggleFullScreenButton,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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

  const table = useShadcnReactTable({
    columns,
    data,
    enableRowSelection: true,
    positionToolbarAlertBanner: 'bottom', //show selected rows count on bottom toolbar
    //add custom action buttons to top-left of top toolbar
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex gap-4 p-1">
        <Button
          variant="secondary"
          onClick={() => {
            alert('Create New Account');
          }}
        >
          Create Account
        </Button>
        <Button
          variant="destructive"
          disabled={!table.getIsSomeRowsSelected()}
          onClick={() => {
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
          onClick={() => {
            window.print();
          }}
        >
          <Printer />
        </Button>
        {/* along-side built-in buttons in whatever order you want them */}
        <SRT_ToggleDensePaddingButton table={table} />
        <SRT_ToggleFullScreenButton table={table} />
      </div>
    ),
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
