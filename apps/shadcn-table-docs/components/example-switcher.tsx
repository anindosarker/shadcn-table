'use client';

import { useMemo } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui-radix/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui-radix/tooltip';
import { PageSwitcher, sectionPages } from '@/components/page-switcher';

interface Props {
  /** The section whose pages the switcher lists and navigates between. */
  section?: PageTree.Folder;
  /** A scoped list instead of the section (a guide's examples). */
  pages?: PageTree.Item[];
  current: PageTree.Item;
  /** Replaces navigation: called with the picked page. */
  onSelect?: (page: PageTree.Item) => void;
}

/**
 * Example playground's left toolbar: the page switcher combobox between
 * previous / next buttons. The steps follow the combobox's order (the
 * section's pages, without its overview, or the given `pages`) and stop at
 * either end.
 */
export const ExampleSwitcher = ({
  section,
  pages: scoped,
  current,
  onSelect,
}: Props) => {
  const pages = useMemo(
    () => scoped ?? (section ? sectionPages(section) : []),
    [section, scoped],
  );
  const index = pages.findIndex((page) => page.url === current.url);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <StepButton
        direction="previous"
        page={index > 0 ? pages[index - 1] : undefined}
        onSelect={onSelect}
      />
      <PageSwitcher
        section={section}
        pages={scoped}
        current={current}
        onSelect={onSelect}
        className="h-8 min-w-0 shrink rounded-md border bg-fd-secondary px-2.5 text-sm font-medium text-fd-foreground"
      />
      <StepButton
        direction="next"
        page={
          index !== -1 && index < pages.length - 1
            ? pages[index + 1]
            : undefined
        }
        onSelect={onSelect}
      />
    </div>
  );
};

/** Square previous / next button; disabled when there is no page that way. */
function StepButton({
  direction,
  page,
  onSelect,
}: {
  direction: 'previous' | 'next';
  page?: PageTree.Item;
  onSelect?: (page: PageTree.Item) => void;
}) {
  const router = useRouter();
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
  const verb = direction === 'previous' ? 'Previous' : 'Next';

  if (!page) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        aria-disabled="true"
        aria-label={`${verb} example`}
        className="docs-playground-step"
      >
        <Icon />
      </Button>
    );
  }

  const label = `${verb}: ${typeof page.name === 'string' ? page.name : ''}`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className="docs-playground-step"
          onClick={() => (onSelect ? onSelect(page) : router.push(page.url))}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
