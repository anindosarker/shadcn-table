'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnPinningState,
} from '@/components/ui/shadcn-react-table';
import { type StateOption, stateOptions } from '@/lib/prop-tables/stateOptions';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<StateOption['stateOption']>;
}

export const StateOptionsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<SRT_ColumnDef<StateOption>[]>(
    () => [
      {
        accessorKey: 'stateOption',
        enableClickToCopy: true,
        header: 'State Option',
        srtCopyButtonProps: ({ cell }) => ({
          className: 'state-option',
          id: `${cell.getValue<string>()}-state-option`,
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableGlobalFilter: false,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'defaultValue',
        enableGlobalFilter: false,
        header: 'Default Value',
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'description',
        enableGlobalFilter: false,
        header: 'Description',
      },
      {
        accessorKey: 'link',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        header: 'More Info Links',
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
        left: ['srt-row-expand', 'srt-row-numbers', 'stateOption'],
        right: ['link'],
      });
    } else {
      setColumnPinning({});
    }
  }, [isDesktop]);

  const data = useMemo(() => {
    if (onlyOptions) {
      return stateOptions.filter(({ stateOption }) =>
        onlyOptions.has(stateOption),
      );
    }
    return stateOptions;
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
          sorting: [{ id: 'stateOption', desc: false }],
        }}
        srtSearchTextFieldProps={{
          placeholder: 'Search State Options',
          className: 'min-w-[18rem]',
        }}
        srtTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-state-options-table'
            : 'state-options-table',
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

export default StateOptionsTable;
