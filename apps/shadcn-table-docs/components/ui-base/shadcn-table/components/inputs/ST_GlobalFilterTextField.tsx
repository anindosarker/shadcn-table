import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { Collapsible, CollapsibleContent } from '@/components/ui-base/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui-base/input-group';
import {
  type InputProps,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-base/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui-base/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';
import { useST_DebouncedCallback } from '@/components/ui-base/shadcn-table/hooks/useST_DebouncedCallback';
import { useST_MenuAnchor } from '@/components/ui-base/shadcn-table/hooks/useST_MenuAnchor';

export type ST_GlobalFilterTextFieldProps = InputProps;

export const ST_GlobalFilterTextField = <TData extends ST_RowData>({
  ...rest
}: ST_GlobalFilterTextFieldProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      enableGlobalFilterModes,
      globalFilterDebounceMs,
      icons: { CloseIcon, SearchIcon },
      localization,
      showClearSearchButton,
      stSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
    setShowGlobalFilter,
  } = table;
  const globalFilter = useSelector(table.atoms.globalFilter);
  const showGlobalFilter = useSelector(table.atoms.showGlobalFilter);

  const textFieldProps = {
    ...parseFromValuesOrFunc(stSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openerProps, toggle } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const debouncedSearch = useST_DebouncedCallback(
    (value: string) => setGlobalFilter(value || undefined),
    globalFilterDebounceMs ?? 500,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    debouncedSearch.run(event.target.value);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    toggle(event.currentTarget);
  };

  const handleClear = () => {
    debouncedSearch.cancel();
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  // The field focuses its input when it opens and hands focus back to the
  // element that opened it when Escape closes it.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasShownRef = useRef(showGlobalFilter);
  useEffect(() => {
    if (showGlobalFilter && !wasShownRef.current) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      searchInputRef.current?.focus({ preventScroll: true });
    }
    wasShownRef.current = showGlobalFilter;
  }, [searchInputRef, showGlobalFilter]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter') {
      debouncedSearch.flush();
      return;
    }
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    // Escape clears a value first, then closes the empty field.
    if (searchValue) {
      handleClear();
      return;
    }
    setShowGlobalFilter(false);
    returnFocusRef.current?.focus();
  };

  // Closing the field drops the typed text and its pending debounced write.
  const [prevShowGlobalFilter, setPrevShowGlobalFilter] =
    useState(showGlobalFilter);
  if (showGlobalFilter !== prevShowGlobalFilter) {
    setPrevShowGlobalFilter(showGlobalFilter);
    if (!showGlobalFilter) {
      debouncedSearch.cancel();
      setSearchValue('');
    }
  }

  // An outside change to the global filter resets the search value; the store
  // is not written here.
  const [prevGlobalFilter, setPrevGlobalFilter] = useState(globalFilter);
  if (globalFilter !== prevGlobalFilter) {
    setPrevGlobalFilter(globalFilter);
    setSearchValue(globalFilter ?? '');
  }

  return (
    <Collapsible className="[--st-search-width:14rem]" open={showGlobalFilter}>
      <CollapsibleContent
        className="-m-0.75 box-content overflow-hidden p-0.75 w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-closed:w-12 data-closed:opacity-0 data-starting-style:w-12 data-starting-style:opacity-0"
        inert={!showGlobalFilter}
        keepMounted
      >
        <InputGroup className="focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              <ST_Tooltip title={localization.changeSearchMode}>
                <InputGroupButton
                  aria-label={localization.changeSearchMode}
                  {...openerProps}
                  onClick={handleGlobalFilterMenuOpen}
                  size="icon-sm"
                  className="size-7"
                >
                  <SearchIcon />
                </InputGroupButton>
              </ST_Tooltip>
            </InputGroupAddon>
          ) : (
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
          )}
          <InputGroupInput
            autoComplete="off"
            onChange={handleChange}
            placeholder={localization.search}
            value={searchValue ?? ''}
            {...textFieldProps}
            onBlur={(event) => {
              debouncedSearch.flush();
              textFieldProps.onBlur?.(event);
            }}
            onKeyDown={handleKeyDown}
            ref={(inputRef) => {
              searchInputRef.current = inputRef;
            }}
          />
          {showClearSearchButton && (
            <InputGroupAddon align="inline-end">
              <ST_Tooltip title={localization.clearSearch ?? ''}>
                <span>
                  <InputGroupButton
                    aria-label={localization.clearSearch}
                    disabled={!searchValue?.length}
                    onClick={handleClear}
                    size="icon-sm"
                  >
                    <CloseIcon />
                  </InputGroupButton>
                </span>
              </ST_Tooltip>
            </InputGroupAddon>
          )}
        </InputGroup>
        <ST_FilterOptionMenu
          anchorEl={anchorEl}
          onSelect={handleClear}
          setAnchorEl={setAnchorEl}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
