import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  type InputProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { debounce, parseFromValuesOrFunc } from '../utils/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

export interface SRT_GlobalFilterTextFieldProps<TData extends SRT_RowData>
  extends InputProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_GlobalFilterTextField = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      srtSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const textFieldProps = {
    ...parseFromValuesOrFunc(srtSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined);
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    handleChangeDebounced(event);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

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

  return (
    // <Collapse in={showGlobalFilter} mountOnEnter orientation="horizontal" unmountOnExit>
    // Note: MUI Collapse → ui/Collapsible; radix unmounts closed content (= mountOnEnter/unmountOnExit); the horizontal width keyframes (MUI duration.standard, easeInOut) live in the app stylesheet.
    <Collapsible open={showGlobalFilter}>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-[srt-collapsible-left_300ms_ease-in-out] data-[state=open]:animate-[srt-collapsible-right_300ms_ease-in-out]">
        {/* <TextField size="small" variant="outlined" InputProps={{ ...textFieldProps.InputProps, sx: { mb: 0 } }} /> */}
        {/* Note: InputGroup is MUI's Input root in shadcn's default variant; the slot type is input props, so InputProps and its sx have no target. */}
        <InputGroup>
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              <SRT_Tooltip title={localization.changeSearchMode}>
                <InputGroupButton
                  aria-label={localization.changeSearchMode}
                  onClick={handleGlobalFilterMenuOpen}
                  size="icon-sm"
                  className="size-7"
                >
                  <SearchIcon />
                </InputGroupButton>
              </SRT_Tooltip>
            </InputGroupAddon>
          ) : (
            // <SearchIcon style={{ marginRight: '4px' }} />
            // Note: InputGroupAddon supplies the spacing.
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
            ref={(inputRef) => {
              searchInputRef.current = inputRef;
              // if (textFieldProps?.inputRef) { textFieldProps.inputRef = inputRef; }
              // Note: no-op in MRT too; a user ref is overridden by this one, as MRT's inputRef after the spread.
            }}
          />
          <InputGroupAddon align="inline-end">
            <SRT_Tooltip title={localization.clearSearch ?? ''}>
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
            </SRT_Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <SRT_FilterOptionMenu
          anchorEl={anchorEl}
          onSelect={handleClear}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
