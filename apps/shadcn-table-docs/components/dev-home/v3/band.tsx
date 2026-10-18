import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * One horizontal band of the sheet: a full-bleed dashed top rule with a
 * crosshair where it meets each side of the frame.
 */
export function Band({
  as: Tag = 'section',
  id,
  labelledBy,
  className,
  children,
}: {
  as?: 'section' | 'div' | 'footer';
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn('v3-band', className)}
    >
      <span className="v3-cross v3-cross-tl" aria-hidden="true" />
      <span className="v3-cross v3-cross-tr" aria-hidden="true" />
      {children}
    </Tag>
  );
}

/** Band header: mono label stacked above the heading, never beside it. */
export function BandHead({
  index,
  label,
  id,
  title,
  lede,
}: {
  index: string;
  label: string;
  id: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 px-4 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-12">
      <p className="v3-label">
        <span className="text-(--dh-accent)">{index}</span>
        <span aria-hidden="true"> / </span>
        {label}
      </p>
      <h2
        id={id}
        className="max-w-3xl text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </h2>
      {lede ? (
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-(--dh-ink-muted)">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
