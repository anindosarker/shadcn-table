import type { ReactNode } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';

export interface SRT_TableProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_Table = <TData extends SRT_RowData>({
  table,
}: SRT_TableProps<TData>) => {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <table>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : (header.column.columnDef.header ?? null)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {(cell.renderValue() as unknown as ReactNode) ?? null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SRT_Table;
