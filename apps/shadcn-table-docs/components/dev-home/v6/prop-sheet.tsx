import Link from 'next/link';
import { FEATURES } from '@/components/dev-home/shared/outline-tiles';

/** Every feature on the sheet with the prop that switches it on. */
export function PropSheet() {
  return (
    <table className="v6-props">
      <thead>
        <tr>
          <th scope="col">Prop</th>
          <th scope="col">Feature</th>
          <th scope="col">What it does</th>
        </tr>
      </thead>
      <tbody>
        {FEATURES.map((f) => (
          <tr key={f.id}>
            <td>
              <code>{f.prop}</code>
            </td>
            <th scope="row" className="font-medium">
              <Link href={f.docsHref}>{f.title}</Link>
            </th>
            <td className="text-(--dh-ink-muted)">{f.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
