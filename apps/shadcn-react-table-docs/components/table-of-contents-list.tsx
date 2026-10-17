import { Fragment } from 'react';
import Link from 'next/link';
import { routes, type RouteItem } from '@/lib/routes';

export const TableOfContentsListItem = ({
  item,
  isFooter = false,
}: {
  item: RouteItem;
  isFooter?: boolean;
}) => (
  <li>
    <Link
      href={item.href}
      className={
        isFooter
          ? 'text-sm leading-[1.6rem] text-fd-muted-foreground no-underline hover:underline'
          : 'text-xl leading-8 text-fd-primary no-underline hover:underline'
      }
    >
      {item.label}
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
    return (
      <ul className={isFooter ? 'list-none p-0' : undefined}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {item.secondaryItems ? (
              item.secondaryItems.map((secondary, i) => (
                <TableOfContentsListItem
                  key={i}
                  item={secondary}
                  isFooter={isFooter}
                />
              ))
            ) : (
              <TableOfContentsListItem item={item} isFooter={isFooter} />
            )}
          </Fragment>
        ))}
      </ul>
    );
  }
  if (variant === 'heading') {
    return (
      <>
        {items.map((item, index) => (
          <div key={index}>
            <h3 id={item.href.split('#')[1]}>
              <Link href={item.href} className="no-underline hover:underline">
                {item.label}
              </Link>
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
