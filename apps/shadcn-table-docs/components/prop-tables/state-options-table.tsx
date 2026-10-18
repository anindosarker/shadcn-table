'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
  type ST_ColumnPinningState,
} from '@/components/ui/shadcn-table';
import { type StateOption, stateOptions } from '@/lib/prop-tables/stateOptions';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<StateOption['stateOption']>;
}

export const StateOptionsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<ST_ColumnDef<StateOption>[]>(
    () => [
      {
        accessorKey: 'stateOption',
        enableClickToCopy: true,
        header: 'State Option',
        stCopyButtonProps: ({ cell }) => ({
          className: 'state-option',
          id: `${cell.getValue<string>()}-state-option`,
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableGlobalFilter: false,
        size: 150,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'defaultValue',
        enableGlobalFilter: false,
        header: 'Default Value',
        size: 130,
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
        size: 150,
        Cell: ({ cell, row }) => (
          <PropLink href={cell.getValue<string>()}>
            {row.original?.linkText}
          </PropLink>
        ),
      },
    ],
    [],
  );

  const [columnPinning, setColumnPinning] = useState<ST_ColumnPinningState>({});

  useEffect(() => {
    if (isDesktop) {
      setColumnPinning({
        left: ['st-row-expand', 'st-row-numbers', 'stateOption'],
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
      <ShadcnTable
        columns={columns}
        data={data}
        displayColumnDefOptions={{
          'st-row-numbers': {
            size: 10,
          },
          'st-row-expand': {
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
        stSearchTextFieldProps={{
          placeholder: 'Search State Options',
          className: 'min-w-[18rem]',
        }}
        stTableLayoutProps={{
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
