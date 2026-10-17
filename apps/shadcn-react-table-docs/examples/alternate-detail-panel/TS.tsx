'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

//window.matchMedia is not available during server rendering, so resolve the breakpoint in an effect
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const onChange = () => setMatches(mediaQueryList.matches);
    onChange();
    mediaQueryList.addEventListener('change', onChange);
    return () => mediaQueryList.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

const Example = () => {
  const isMobile = useMediaQuery('(max-width: 720px)');

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    [],
    //end
  );

  const table = useShadcnReactTable({
    columns,
    data,
    // displayColumnDefOptions: { //built-in now in v2.6.0 when positionExpandColumn is 'last'
    //   'srt-row-expand': {
    //     srtTableHeadCellProps: {
    //       align: 'right',
    //     },
    //     srtTableBodyCellProps: {
    //       align: 'right',
    //     },
    //   },
    // },
    enableColumnPinning: isMobile, //alternative
    initialState: {
      expanded: true,
    },
    state: {
      columnPinning: isMobile ? { right: ['srt-row-expand'] } : {}, //alternative
    },
    renderDetailPanel: ({ row }) => (
      <div className="m-auto grid w-full grid-cols-2">
        <p>Address: {row.original.address}</p>
        <p>City: {row.original.city}</p>
        <p>State: {row.original.state}</p>
        <p>Country: {row.original.country}</p>
      </div>
    ),
    positionExpandColumn: 'last',
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
