import { type ReactNode } from 'react';
import type { ST_IconProps } from '@/components/ui-base/shadcn-table/types';

const GridLineSvg = ({
  children,
  size = 24,
  strokeWidth = 2,
  ...props
}: ST_IconProps & { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

export const ST_GridLinesAllIcon = (props: ST_IconProps) => (
  <GridLineSvg {...props}>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M9 4v16" />
    <path d="M15 4v16" />
  </GridLineSvg>
);

export const ST_GridLinesRowsIcon = (props: ST_IconProps) => (
  <GridLineSvg {...props}>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
  </GridLineSvg>
);

export const ST_GridLinesColumnsIcon = (props: ST_IconProps) => (
  <GridLineSvg {...props}>
    <path d="M9 4v16" />
    <path d="M15 4v16" />
  </GridLineSvg>
);
