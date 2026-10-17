// Ported from MRT docs components/mdx/CompatibilityTable.tsx. MRT renders this
// with its own table component; here it is a plain table. Data is SRT's own
// peer requirements (packages/shadcn-react-table/registry.json), not the
// upstream version matrix.
const columns = [
  { key: 'srtVersion', header: 'SRT' },
  { key: 'reactVersion', header: 'React' },
  { key: 'tanstackTable', header: 'TanStack Table' },
  { key: 'tailwind', header: 'Tailwind CSS' },
  { key: 'shadcn', header: 'shadcn/ui' },
  { key: 'lucide', header: 'lucide-react' },
] as const;

type Row = Record<(typeof columns)[number]['key'], string>;

const data: Row[] = [
  {
    srtVersion: '1.x (This Version)',
    reactVersion: '18.0+',
    tanstackTable: '8.x (installed by the CLI)',
    tailwind: '4.0+',
    shadcn: 'shadcn init (CLI)',
    lucide: 'latest (installed by the CLI)',
  },
];

export const CompatibilityTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-base">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className="text-left">
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const current = row.srtVersion.includes('This Version');
          return (
            <tr
              key={row.srtVersion}
              className={current ? 'font-bold text-fd-primary' : undefined}
            >
              {columns.map((c) => (
                <td key={c.key}>{row[c.key]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
