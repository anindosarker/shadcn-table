'use client';

import {
  ST_GlobalFilterTextField,
  ST_ShowHideColumnsButton,
  ST_TablePagination,
  ST_ToggleDensePaddingButton,
  ST_ToggleFiltersButton,
  ST_ToolbarAlertBanner,
  useShadcnTable,
  type ST_ColumnDef,
  ST_TableContainer,
  ST_Tooltip,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { data, type Person } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
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
  const table = useShadcnTable({
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
        <ST_GlobalFilterTextField table={table} />
        <div className="flex items-center gap-2">
          <ST_ToggleFiltersButton table={table} />
          <ST_ShowHideColumnsButton table={table} />
          <ST_ToggleDensePaddingButton table={table} />
          <ST_Tooltip title="Print">
            <Button variant="ghost" size="icon" onClick={() => window.print()}>
              <Printer />
            </Button>
          </ST_Tooltip>
        </div>
      </div>
      {/* Some Page Content */}
      <p className="px-1 py-4">
        {
          "Hey I'm some page content. I'm just one of your normal components between your custom toolbar and the ST Table below"
        }
      </p>
      {/* The ST Table with no toolbars built-in */}
      <ST_TableContainer table={table} />
      {/* Our Custom Bottom Toolbar */}
      <div>
        <div className="flex justify-end">
          <ST_TablePagination table={table} />
        </div>
        <div className="grid w-full">
          <ST_ToolbarAlertBanner stackAlertBanner table={table} />
        </div>
      </div>
    </div>
  );
};

export default Example;
