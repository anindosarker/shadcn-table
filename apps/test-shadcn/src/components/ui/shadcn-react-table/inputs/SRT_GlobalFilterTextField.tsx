import {
  type ChangeEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  parseSRT_HtmlProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

export interface SRT_GlobalFilterTextFieldProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Global filter text field - search input for filtering all columns.
 *
 * Ports MRT_GlobalFilterTextField: debounced search, search-icon prefix,
 * clear-button suffix, mode-menu prefix when enableGlobalFilterModes, and
 * mount/unmount on showGlobalFilter (the MUI Collapse equivalent).
 */
export const SRT_GlobalFilterTextField = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      localization,
      manualFiltering,
      srtSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  // Resolve the slot props (table-level only — global search has no per-column
  // variant).
  const slotProps = parseSRT_HtmlProps(srtSearchTextFieldProps, { table });

  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const handleChangeDebounced = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          setGlobalFilter(value || undefined);
        },
        manualFiltering ? 500 : 250,
      );
    };
  }, [manualFiltering, setGlobalFilter]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    handleChangeDebounced(value);
    // Compose the user's slot-prop onChange after the component's own logic.
    slotProps?.onChange?.(event);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  // Sync with external globalFilter changes
  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear();
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  // mountOnEnter / unmountOnExit (the MUI Collapse equivalent)
  if (!showGlobalFilter) return null;

  return (
    <div
      className={cn(
        'relative flex items-center',
        'animate-in slide-in-from-right-5 duration-200',
        className,
      )}
    >
      {/* Mode menu button or search icon prefix */}
      {enableGlobalFilterModes ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={localization.changeSearchMode}
              onClick={(e: MouseEvent<HTMLElement>) =>
                setAnchorEl(e.currentTarget)
              }
              className="absolute left-1 size-7"
            >
              <SearchIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{localization.changeSearchMode}</TooltipContent>
        </Tooltip>
      ) : (
        <SearchIcon className="absolute left-3 size-4 text-muted-foreground" />
      )}

      {/* Input field */}
      <input
        type="text"
        placeholder={localization.search}
        autoComplete="off"
        {...slotProps}
        ref={searchInputRef}
        value={searchValue ?? ''}
        onChange={handleChange}
        className={cn(
          'h-9 w-48 rounded-md border border-input bg-background pl-9 pr-9',
          'text-sm ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          slotProps?.className,
        )}
      />

      {/* Clear button suffix */}
      {searchValue && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label={localization.clearSearch}
              className="absolute right-1 size-7"
            >
              <XIcon className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{localization.clearSearch}</TooltipContent>
        </Tooltip>
      )}

      {/* Filter mode menu */}
      {enableGlobalFilterModes && (
        <SRT_FilterOptionMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          onSelect={handleClear}
          table={table}
        />
      )}
    </div>
  );
};
