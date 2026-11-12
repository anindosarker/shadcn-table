'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

/**
 * A Link for the top of the homepage that prefetches on intent (pointer,
 * touch or focus) instead of on entering the viewport: the nav and hero
 * links would otherwise pull the docs route's chunks while the homepage
 * loads. Link's own `prefetch={false}` turns hover prefetch off too.
 */
export function IntentLink({
  href,
  onPointerEnter,
  onTouchStart,
  onFocus,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: string;
}) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);
  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        prefetch();
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        prefetch();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        prefetch();
      }}
    />
  );
}
