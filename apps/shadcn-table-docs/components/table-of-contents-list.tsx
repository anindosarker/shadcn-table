import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { routes, type RouteItem } from '@/lib/routes';

export const TableOfContentsListItem = ({
  item,
  isFooter = false,
  index = 0,
}: {
  item: RouteItem;
  isFooter?: boolean;
  index?: number;
}) =>
  isFooter ? (
    <li>
      <Link
        href={item.href}
        className="text-sm leading-[1.6rem] text-fd-muted-foreground no-underline hover:underline"
      >
        {item.label}
      </Link>
    </li>
  ) : (
    <li>
      <Link href={item.href} className="docs-index-link">
        <span className="docs-index-num">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="docs-index-label">{item.label}</span>
        <ArrowUpRight aria-hidden className="docs-index-arrow" />
      </Link>
    </li>
  );

interface Props {
  items?: Array<RouteItem>;
  isFooter?: boolean;
  variant?: 'list' | 'heading';
}

export const TableOfContentsList = ({
  items = routes,
  isFooter = false,
  variant = 'list',
}: Props) => {
  if (variant === 'list') {
    // secondary items are flattened into the list, so number the flat rows
    const rows = items.flatMap((item) => item.secondaryItems ?? [item]);
    return (
      <ul className={isFooter ? 'list-none p-0' : 'docs-index not-prose'}>
        {rows.map((item, index) => (
          <TableOfContentsListItem
            key={index}
            item={item}
            isFooter={isFooter}
            index={index}
          />
        ))}
      </ul>
    );
  }
  if (variant === 'heading') {
    return (
      <>
        {items.map((item, index) => (
          <div key={index}>
            <h3 id={item.href.split('#')[1]} className="docs-index-heading">
              <Link href={item.href}>{item.label}</Link>
            </h3>
            {(item.items || item.secondaryItems) && (
              <TableOfContentsList
                items={item.secondaryItems ?? item.items ?? []}
              />
            )}
          </div>
        ))}
      </>
    );
  }
  return null;
};

export default TableOfContentsList;
