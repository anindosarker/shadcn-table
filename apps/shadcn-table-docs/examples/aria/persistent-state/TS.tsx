'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShadcnTable,
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_DensityState,
  type ST_SortingState,
  type ST_VisibilityState,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

//column definitions...
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
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
  },
];
//end

const Example = () => {
  const isFirstRender = useRef(true);

  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ST_VisibilityState>(
    {},
  );
  const [density, setDensity] = useState<ST_DensityState>('comfortable');
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    undefined,
  );
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [sorting, setSorting] = useState<ST_SortingState>([]);

  //load state from local storage
  useEffect(() => {
    const columnFilters = sessionStorage.getItem('srt_columnFilters_table_1');
    const columnVisibility = sessionStorage.getItem(
      'srt_columnVisibility_table_1',
    );
    const density = sessionStorage.getItem('srt_density_table_1');
    const globalFilter = sessionStorage.getItem('srt_globalFilter_table_1');
    const showGlobalFilter = sessionStorage.getItem(
      'srt_showGlobalFilter_table_1',
    );
    const showColumnFilters = sessionStorage.getItem(
      'srt_showColumnFilters_table_1',
    );
    const sorting = sessionStorage.getItem('srt_sorting_table_1');

    if (columnFilters) {
      setColumnFilters(JSON.parse(columnFilters));
    }
    if (columnVisibility) {
      setColumnVisibility(JSON.parse(columnVisibility));
    }
    if (density) {
      setDensity(JSON.parse(density));
    }
    if (globalFilter) {
      setGlobalFilter(JSON.parse(globalFilter) || undefined);
    }
    if (showGlobalFilter) {
      setShowGlobalFilter(JSON.parse(showGlobalFilter));
    }
    if (showColumnFilters) {
      setShowColumnFilters(JSON.parse(showColumnFilters));
    }
    if (sorting) {
      setSorting(JSON.parse(sorting));
    }
    isFirstRender.current = false;
  }, []);

  //save states to local storage
  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      'srt_columnFilters_table_1',
      JSON.stringify(columnFilters),
    );
  }, [columnFilters]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      'srt_columnVisibility_table_1',
      JSON.stringify(columnVisibility),
    );
  }, [columnVisibility]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem('srt_density_table_1', JSON.stringify(density));
  }, [density]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      'srt_globalFilter_table_1',
      JSON.stringify(globalFilter ?? ''),
    );
  }, [globalFilter]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      'srt_showGlobalFilter_table_1',
      JSON.stringify(showGlobalFilter),
    );
  }, [showGlobalFilter]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      'srt_showColumnFilters_table_1',
      JSON.stringify(showColumnFilters),
    );
  }, [showColumnFilters]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem('srt_sorting_table_1', JSON.stringify(sorting));
  }, [sorting]);

  const resetState = () => {
    sessionStorage.removeItem('srt_columnFilters_table_1');
    sessionStorage.removeItem('srt_columnVisibility_table_1');
    sessionStorage.removeItem('srt_density_table_1');
    sessionStorage.removeItem('srt_globalFilter_table_1');
    sessionStorage.removeItem('srt_showGlobalFilter_table_1');
    sessionStorage.removeItem('srt_showColumnFilters_table_1');
    sessionStorage.removeItem('srt_sorting_table_1');
    window.location.reload();
  };

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      onColumnFiltersChange={setColumnFilters}
      onColumnVisibilityChange={setColumnVisibility}
      onDensityChange={setDensity}
      onGlobalFilterChange={setGlobalFilter}
      onShowColumnFiltersChange={setShowColumnFilters}
      onShowGlobalFilterChange={setShowGlobalFilter}
      onSortingChange={setSorting}
      state={{
        columnFilters,
        columnVisibility,
        density,
        globalFilter,
        showColumnFilters,
        showGlobalFilter,
        sorting,
      }}
      renderTopToolbarCustomActions={() => (
        <Button onClick={resetState}>Reset State</Button>
      )}
    />
  );
};

export default Example;
