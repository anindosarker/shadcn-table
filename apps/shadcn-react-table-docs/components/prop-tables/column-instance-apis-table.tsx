'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnPinningState,
} from '@/components/ui/shadcn-react-table';
import {
  type ColumnInstanceAPI,
  columnInstanceAPIs,
} from '@/lib/prop-tables/columnInstanceAPIs';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<ColumnInstanceAPI['columnInstanceAPI']>;
}

export const ColumnInstanceAPIsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<SRT_ColumnDef<ColumnInstanceAPI>[]>(
    () => [
      {
        accessorKey: 'columnInstanceAPI',
        enableClickToCopy: true,
        header: 'State Option',
        srtCopyButtonProps: ({ cell }) => ({
          className: 'column-instance-api',
          id: `${cell.getValue<string>()}-column-instance-api`,
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
        left: ['srt-row-expand', 'srt-row-numbers', 'columnInstanceAPI'],
        right: ['link'],
      });
    } else {
      setColumnPinning({});
    }
  }, [isDesktop]);

  const data = useMemo(() => {
    if (onlyOptions) {
      return columnInstanceAPIs.filter(({ columnInstanceAPI }) =>
        onlyOptions.has(columnInstanceAPI),
      );
    }
    return columnInstanceAPIs;
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
          sorting: [{ id: 'columnInstanceAPI', desc: false }],
        }}
        srtSearchTextFieldProps={{
          placeholder: 'Search Column APIs',
          className: 'min-w-[18rem]',
        }}
        srtTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-column-instance-apis-table'
            : 'column-instance-apis-table',
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

export default ColumnInstanceAPIsTable;
