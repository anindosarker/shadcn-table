'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnPinningState,
} from '@/components/ui/shadcn-react-table';
import {
  type RowInstanceAPI,
  rowInstanceAPIs,
} from '@/lib/prop-tables/rowInstanceAPIs';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<RowInstanceAPI['rowInstanceAPI']>;
}

export const RowInstanceAPIsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<SRT_ColumnDef<RowInstanceAPI>[]>(
    () => [
      {
        accessorKey: 'rowInstanceAPI',
        enableClickToCopy: true,
        header: 'State Option',
        srtCopyButtonProps: ({ cell }) => ({
          className: 'row-instance-api',
          id: `${cell.getValue<string>()}-row-instance-api`,
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableGlobalFilter: false,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'link',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        header: 'More Info Links',
        size: 180,
        Cell: ({ cell, row }) => (
          <PropLink href={cell.getValue<string>()}>
            {row.original?.linkText}
          </PropLink>
        ),
      },
    ],
    [],
  );

  const [columnPinning, setColumnPinning] = useState<SRT_ColumnPinningState>(
    {},
  );

  useEffect(() => {
    if (isDesktop) {
      setColumnPinning({
        left: ['srt-row-expand', 'srt-row-numbers', 'rowInstanceAPI'],
        right: ['link'],
      });
    } else {
      setColumnPinning({});
    }
  }, [isDesktop]);

  const data = useMemo(() => {
    if (onlyOptions) {
      return rowInstanceAPIs.filter(({ rowInstanceAPI }) =>
        onlyOptions.has(rowInstanceAPI),
      );
    }
    return rowInstanceAPIs;
  }, [onlyOptions]);

  return (
    <div className="not-prose">
      <ShadcnReactTable
        columns={columns}
        data={data}
        displayColumnDefOptions={{
          'srt-row-numbers': {
            size: 10,
          },
          'srt-row-expand': {
            size: 10,
          },
        }}
        enableColumnActions={!onlyOptions}
        enableColumnFilterModes
        enablePagination={false}
        enableColumnPinning
        enableRowNumbers
        enableBottomToolbar={false}
        enableTopToolbar={!onlyOptions}
        initialState={{
          columnVisibility: { description: false },
          density: 'compact',
          showGlobalFilter: true,
          sorting: [{ id: 'rowInstanceAPI', desc: false }],
        }}
        srtSearchTextFieldProps={{
          placeholder: 'Search Row APIs',
          className: 'min-w-[18rem]',
        }}
        srtTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-row-instance-apis-table'
            : 'row-instance-apis-table',
        }}
        positionGlobalFilter="left"
        renderDetailPanel={({ row }) => (
          <p
            className={
              row.original.description
                ? 'text-foreground'
                : 'text-muted-foreground'
            }
          >
            {row.original.description || 'No Description Provided... Yet...'}
          </p>
        )}
        rowNumberDisplayMode="static"
        onColumnPinningChange={setColumnPinning}
        state={{ columnPinning }}
      />
    </div>
  );
};

export default RowInstanceAPIsTable;
