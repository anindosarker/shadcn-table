// Ported from MRT docs components/mdx/CompatibilityTable.tsx. MRT renders this
// with its own table component; here it is a plain table. Data is MRT's with
// the sync script's text mapping applied by hand.
const columns = [
  { key: 'srtVersion', header: 'SRT' },
  { key: 'reactVersion', header: 'React' },
  { key: 'muiVersion', header: 'shadcn/ui' },
  { key: 'muiIconsVersion', header: 'shadcn/ui Icons' },
  { key: 'muiXDatePickers', header: 'shadcn/ui X Date Pickers' },
  { key: 'emotionVersion', header: 'Emotion' },
  { key: 'pigmentCSS', header: 'Pigment CSS' },
] as const;

type Row = Record<(typeof columns)[number]['key'], string>;

const data: Row[] = [
  {
    srtVersion: '4.x (Next Version)',
    muiVersion: '6.0+',
    muiXDatePickers: '7.15.0+',
    reactVersion: '18.0+',
    muiIconsVersion: '6.0+',
    emotionVersion: 'Optional',
    pigmentCSS: 'Optional',
  },
  {
    srtVersion: '3.x (This Version)',
    muiVersion: '6.0+',
    muiXDatePickers: '7.15.0+',
    reactVersion: '18.0+',
    muiIconsVersion: '6.0+',
    emotionVersion: '11.0+',
    pigmentCSS: 'Optional',
  },
  {
    srtVersion: '2.x',
    muiVersion: '5.13+',
    muiXDatePickers: '6.15+',
    reactVersion: '17.0+',
    muiIconsVersion: '5.0+',
    emotionVersion: '11.0+',
    pigmentCSS: '-',
  },
  {
    srtVersion: '1.x',
    muiVersion: '5.0+',
    muiXDatePickers: 'Optional',
    reactVersion: '17.0+',
    muiIconsVersion: '5.0+',
    emotionVersion: '11.0+',
    pigmentCSS: '-',
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
