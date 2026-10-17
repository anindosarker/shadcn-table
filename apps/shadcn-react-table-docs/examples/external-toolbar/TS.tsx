'use client';

import {
  SRT_GlobalFilterTextField,
  SRT_ShowHideColumnsButton,
  SRT_TablePagination,
  SRT_ToggleDensePaddingButton,
  SRT_ToggleFiltersButton,
  SRT_ToolbarAlertBanner,
  useShadcnReactTable,
  type SRT_ColumnDef,
  SRT_TableContainer,
} from '@/components/ui/shadcn-react-table';
import { SRT_Tooltip } from '@/components/ui/shadcn-react-table/SRT_Tooltip';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { data, type Person } from './makeData';

const columns: SRT_ColumnDef<Person>[] = [
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
];

const Example = () => {
  const table = useShadcnReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { showGlobalFilter: true },
  });

  return (
    <div className="border-2 border-dashed border-gray-500 p-4">
      {/* Our Custom External Top Toolbar */}
      <div className="flex flex-col justify-between gap-4 rounded bg-inherit px-4 py-6 md:flex-row">
        <div>
          <Button
            onClick={() => {
              alert('Add User');
            }}
          >
            Create New Account
          </Button>
        </div>
        <SRT_GlobalFilterTextField table={table} />
        <div className="flex items-center gap-2">
          <SRT_ToggleFiltersButton table={table} />
          <SRT_ShowHideColumnsButton table={table} />
          <SRT_ToggleDensePaddingButton table={table} />
          <SRT_Tooltip title="Print">
            <Button variant="ghost" size="icon" onClick={() => window.print()}>
              <Printer />
            </Button>
          </SRT_Tooltip>
        </div>
      </div>
      {/* Some Page Content */}
      <p className="px-1 py-4">
        {
          "Hey I'm some page content. I'm just one of your normal components between your custom toolbar and the SRT Table below"
        }
      </p>
      {/* The SRT Table with no toolbars built-in */}
      <SRT_TableContainer table={table} />
      {/* Our Custom Bottom Toolbar */}
      <div>
        <div className="flex justify-end">
          <SRT_TablePagination table={table} />
        </div>
        <div className="grid w-full">
          <SRT_ToolbarAlertBanner stackAlertBanner table={table} />
        </div>
      </div>
    </div>
  );
};

export default Example;
