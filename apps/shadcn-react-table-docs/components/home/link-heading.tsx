'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkIcon, Link2Icon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode | string;
  tableId?: string;
  href?: string;
  /** Heading element to render; MRT used Typography variants. */
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
}

/** Heading with an id derived from its text and a copy-link button. */
export const LinkHeading = ({
  children,
  tableId,
  as: Tag = 'h3',
  className,
}: Props) => {
  const pathname = usePathname();

  const [isCopied, setIsCopied] = useState(false);

  const id = `${tableId ? `${tableId}-` : ''}${children
    ?.toString()
    ?.toLowerCase?.()
    ?.replaceAll?.(' ', '-')}`?.replaceAll?.('/', '-');

  const href = `${pathname}#${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <Tag
      className={cn(
        'group scroll-mt-24 inline-flex items-center gap-2',
        id.includes('relevant') && 'relevant',
        className,
      )}
      id={id}
    >
      <Link href={href} className="text-inherit no-underline hover:underline">
        {children}
      </Link>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Copy link"
              onClick={handleCopy}
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md opacity-20 transition-all duration-150 hover:bg-muted hover:opacity-100"
            >
              {isCopied ? (
                <Link2Icon className="size-5" />
              ) : (
                <LinkIcon className="size-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>{isCopied ? 'Copied!' : 'Copy Link'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Tag>
  );
};
