import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { type FocusableElement } from 'react-aria-components';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  type InputProps,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useSTContext } from '@/components/ui/shadcn-table/context/ST_TableContext';
import { useST_DebouncedCallback } from '@/components/ui/shadcn-table/hooks/useST_DebouncedCallback';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

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

  const handleGlobalFilterMenuOpen = (event: MouseEvent<FocusableElement>) => {
    if (event.currentTarget instanceof HTMLElement) {
      toggle(event.currentTarget);
    }
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
    <Collapsible
      className="[--st-search-width:14rem]"
      isExpanded={showGlobalFilter}
    >
      {/* No trigger renders inside the Collapsible, so the panel group names
          itself; React Aria allows only the group and region roles here. */}
      <CollapsibleContent
        aria-label={localization.search}
        className="-m-0.75 box-content overflow-hidden p-0.75 w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none aria-hidden:w-12 aria-hidden:opacity-0"
        inert={!showGlobalFilter}
      >
        <InputGroup className="focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              {/* The closed panel is inert, and React Aria's Focusable warns about a child that cannot take focus. */}
              <ST_Tooltip
                disableHoverListener={!showGlobalFilter}
                title={localization.changeSearchMode}
              >
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
              <ST_Tooltip
                disableHoverListener={!showGlobalFilter}
                title={localization.clearSearch ?? ''}
              >
                <InputGroupButton
                  aria-label={localization.clearSearch}
                  isDisabled={!searchValue?.length}
                  onClick={handleClear}
                  size="icon-sm"
                >
                  <CloseIcon />
                </InputGroupButton>
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
