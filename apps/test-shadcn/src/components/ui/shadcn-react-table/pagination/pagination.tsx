import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationProps = {
  count: number;
  page: number;
  onChange: (
    event: React.MouseEvent | React.KeyboardEvent,
    page: number,
  ) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  disabled?: boolean;
  siblingCount?: number;
  slots?: {
    first?: React.ComponentType<{ className?: string }>;
    last?: React.ComponentType<{ className?: string }>;
    next?: React.ComponentType<{ className?: string }>;
    previous?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
};

function Pagination({
  count,
  page,
  onChange,
  showFirstButton = false,
  showLastButton = false,
  disabled = false,
  siblingCount = 1,
  slots,
  className,
}: PaginationProps) {
  const FirstIcon = slots?.first || ChevronLeftIcon;
  const LastIcon = slots?.last || ChevronRightIcon;
  const NextIcon = slots?.next || ChevronRightIcon;
  const PreviousIcon = slots?.previous || ChevronLeftIcon;

  const createRange = (start: number, end: number) => {
    const range: number[] = [];
    for (let i = start; i <= end; i += 1) {
      range.push(i);
    }
    return range;
  };

  const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, two ellipses
  let pageItems: (number | '...')[] = [];

  if (count <= totalPageNumbers) {
    pageItems = createRange(1, count);
  } else {
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, count);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < count - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = createRange(1, leftItemCount);
      pageItems = [...leftRange, '...', count];
    } else if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = createRange(count - rightItemCount + 1, count);
      pageItems = [1, '...', ...rightRange];
    } else if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
      pageItems = [1, '...', ...middleRange, '...', count];
    }
  }

  const handlePageChange = (
    event: React.MouseEvent | React.KeyboardEvent,
    newPage: number,
  ) => {
    if (newPage === page || newPage < 1 || newPage > count) {
      return;
    }
    onChange(event, newPage);
  };

  const handleFirstPage = (event: React.MouseEvent | React.KeyboardEvent) => {
    handlePageChange(event, 1);
  };

  const handlePreviousPage = (
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    handlePageChange(event, page - 1);
  };

  const handleNextPage = (event: React.MouseEvent | React.KeyboardEvent) => {
    handlePageChange(event, page + 1);
  };

  const handleLastPage = (event: React.MouseEvent | React.KeyboardEvent) => {
    handlePageChange(event, count);
  };

  const disableBack = page <= 1 || disabled;
  const disableNext = page >= count || disabled;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
    >
      <PaginationContent>
        {showFirstButton && (
          <PaginationItem>
            <PaginationLink
              onClick={handleFirstPage}
              disabled={disableBack}
              aria-label="Go to first page"
              className="h-8 w-8"
            >
              <FirstIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            onClick={handlePreviousPage}
            disabled={disableBack}
            aria-label="Go to previous page"
            className="h-8 w-8"
          >
            <PreviousIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {pageItems.map((item, idx) =>
          item === '...' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
                ) => handlePageChange(e, item)}
                isActive={item === page}
                aria-current={item === page ? 'page' : undefined}
                className="h-8 w-8"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            onClick={handleNextPage}
            disabled={disableNext}
            aria-label="Go to next page"
            className="h-8 w-8"
          >
            <NextIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {showLastButton && (
          <PaginationItem>
            <PaginationLink
              onClick={handleLastPage}
              disabled={disableNext}
              aria-label="Go to last page"
              className="h-8 w-8"
            >
              <LastIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </nav>
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  (React.ComponentProps<'a'> | React.ComponentProps<'button'>);

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  disabled,
  onClick,
  ...props
}: PaginationLinkProps) {
  const baseClassName = cn(
    buttonVariants({
      variant: isActive ? 'outline' : 'ghost',
      size,
    }),
    disabled && 'pointer-events-none opacity-50',
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={baseClassName}
        disabled={disabled}
        onClick={onClick}
        {...(props as React.ComponentProps<'button'>)}
      />
    );
  }

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={baseClassName}
      {...(props as React.ComponentProps<'a'>)}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
