import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  href?: string;
  children: ReactNode;
  source?: string;
}

/** "More Info Links" cell; colored by the option's source like MRT's docs. */
export const PropLink = ({ href, children, source }: Props) => {
  if (!href) return null;
  const external = href.startsWith('http');
  return (
    <Link
      className={cn(
        'whitespace-normal underline-offset-4 hover:underline',
        source === 'ST'
          ? 'text-foreground'
          : source === 'shadcn/ui'
            ? 'text-primary'
            : source === 'TanStack Table' || source === 'TanStack Virtual'
              ? 'text-muted-foreground'
              : undefined,
      )}
      href={href}
      rel={external ? 'noopener' : undefined}
      target={external ? '_blank' : undefined}
    >
      {children}
    </Link>
  );
};
