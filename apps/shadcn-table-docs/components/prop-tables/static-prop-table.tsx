import type { ReactNode } from 'react';

export interface StaticPropRow {
  name: string;
  required?: boolean;
  type?: string;
  description?: ReactNode;
}

export interface StaticPropTableProps {
  /** Rows in display order: one per option. */
  rows: StaticPropRow[];
  /** Header of the name column, as the interactive table labels it. */
  nameHeader: string;
  /** Anchor suffix: each name carries `id="<name>-<anchor>"`, like the
   * interactive table's copy button, so deep links land before hydration. */
  anchor: string;
}

/**
 * Plain HTML prop table: name (with the `*` required marker), type and
 * description per option; no buttons, menus or icons. It is the first paint
 * and the HTML a crawler reads while the interactive table loads (D59).
 */
export const StaticPropTable = ({
  rows,
  nameHeader,
  anchor,
}: StaticPropTableProps) => (
  <div className="not-prose mb-6 overflow-x-auto rounded-md border">
    <table className="w-full text-sm [&_td]:px-3 [&_td]:py-1.5 [&_td]:align-top [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_tr]:border-b">
      <thead>
        <tr>
          <th>{nameHeader}</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ name, required, type, description }) => (
          <tr key={name}>
            <td id={`${name}-${anchor}`}>
              {required ? (
                <strong className="text-primary">{name}*</strong>
              ) : (
                name
              )}
            </td>
            <td>{type ? <code>{type}</code> : null}</td>
            <td>{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Rows for a static table from a prop table's data: the `only` subset when
 * given, sorted by name as the interactive table's initial sorting is.
 */
export function staticRows<
  T extends { description?: string; type?: string },
  K extends keyof T,
>(
  data: T[],
  nameKey: K,
  only?: Set<T[K]>,
  required?: (row: T) => boolean | undefined,
): StaticPropRow[] {
  return data
    .filter((row) => !only || only.has(row[nameKey]))
    .map((row) => ({
      name: String(row[nameKey]),
      required: required?.(row),
      type: row.type,
      description: row.description,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
