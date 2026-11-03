// The Remix icon set: the keys of the Lucide map in icons.ts, drawn with
// @remixicon/react.
import { createElement } from 'react';
import {
  RiAddLine,
  RiArrowDownDoubleLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLine,
  RiCheckboxBlankLine,
  RiCloseCircleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDraggable,
  RiEqualizerLine,
  RiEraserLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiFilter2Line,
  RiFilterLine,
  RiFilterOffLine,
  RiFullscreenExitLine,
  RiFullscreenLine,
  RiLayoutColumnLine,
  RiLayoutRowLine,
  RiLayoutTopLine,
  RiListOrdered,
  RiListUnordered,
  RiLockLine,
  RiMenu2Line,
  RiMenuLine,
  RiMore2Line,
  RiMoreLine,
  RiPencilLine,
  RiPushpinLine,
  RiRestartLine,
  RiSave3Line,
  RiSearchLine,
  RiSeparator,
  RiSkipLeftLine,
  RiSkipRightLine,
  RiSortDesc,
  RiStackLine,
  RiSubtractLine,
  RiTextWrap,
  RiUnpinLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import type {
  ST_IconProps,
  ST_Icons,
} from '@/components/ui/shadcn-table/types';
import {
  ST_GridLinesAllIcon,
  ST_GridLinesColumnsIcon,
  ST_GridLinesRowsIcon,
} from '@/components/ui/shadcn-table/components/icons/ST_GridLineIcons';

// Remix types its icons without children; each entry drops them.
const icon = (Ri: RemixiconComponentType) => {
  const Icon = (props: ST_IconProps) =>
    createElement(Ri, { ...props, children: undefined });
  return Icon;
};

export const ST_Default_Icons = {
  AddIcon: icon(RiAddLine),
  ArrowDownwardIcon: icon(RiArrowDownLine),
  ArrowRightIcon: icon(RiArrowRightSLine),
  ArrowUpwardIcon: icon(RiArrowUpLine),
  CancelIcon: icon(RiCloseCircleLine),
  ChevronLeftIcon: icon(RiArrowLeftSLine),
  ChevronRightIcon: icon(RiArrowRightSLine),
  ClearAllIcon: icon(RiEraserLine),
  CloseIcon: icon(RiCloseLine),
  ContentCopy: icon(RiFileCopyLine),
  DeleteIcon: icon(RiDeleteBinLine),
  // Stands in for Lucide Rows2.
  DensityLargeIcon: icon(RiLayoutRowLine),
  // Stands in for Lucide Rows3.
  DensityMediumIcon: icon(RiMenuLine),
  // Stands in for Lucide Rows4.
  DensitySmallIcon: icon(RiMenu2Line),
  DragHandleIcon: icon(RiDraggable),
  DynamicFeedIcon: icon(RiStackLine),
  EditIcon: icon(RiPencilLine),
  ExpandMoreIcon: icon(RiArrowDownSLine),
  FilterAltIcon: icon(RiFilterLine),
  FilterListIcon: icon(RiFilter2Line),
  FilterListOffIcon: icon(RiFilterOffLine),
  // Stands in for Lucide ChevronFirst.
  FirstPageIcon: icon(RiSkipLeftLine),
  FullscreenExitIcon: icon(RiFullscreenExitLine),
  FullscreenIcon: icon(RiFullscreenLine),
  GridLinesAllIcon: ST_GridLinesAllIcon,
  GridLinesColumnsIcon: ST_GridLinesColumnsIcon,
  // Stands in for Lucide Square.
  GridLinesNoneIcon: icon(RiCheckboxBlankLine),
  GridLinesRowsIcon: ST_GridLinesRowsIcon,
  IndeterminateIcon: icon(RiSubtractLine),
  KeyboardDoubleArrowDownIcon: icon(RiArrowDownDoubleLine),
  // Stands in for Lucide ChevronLast.
  LastPageIcon: icon(RiSkipRightLine),
  LockIcon: icon(RiLockLine),
  MoreHorizIcon: icon(RiMoreLine),
  MoreVertIcon: icon(RiMore2Line),
  PushPinIcon: icon(RiPushpinLine),
  PushPinOffIcon: icon(RiUnpinLine),
  RestartAltIcon: icon(RiRestartLine),
  // Stands in for Lucide List.
  RowNumbersOffIcon: icon(RiListUnordered),
  RowNumbersOnIcon: icon(RiListOrdered),
  SaveIcon: icon(RiSave3Line),
  SearchIcon: icon(RiSearchLine),
  // Stands in for Lucide SearchX.
  SearchOffIcon: icon(RiSearchLine),
  // Stands in for Lucide Settings2.
  SettingsIcon: icon(RiEqualizerLine),
  // Stands in for Lucide ArrowRightToLine.
  SingleLineIcon: icon(RiSkipRightLine),
  SortIcon: icon(RiSortDesc),
  // Stands in for Lucide PanelTopDashed.
  StickyHeaderOffIcon: icon(RiCheckboxBlankLine),
  // Stands in for Lucide PanelTop.
  StickyHeaderOnIcon: icon(RiLayoutTopLine),
  // Stands in for Lucide SquareCenterlineDashedVertical.
  StripedOffIcon: icon(RiSeparator),
  // Stands in for Lucide GapVertical.
  StripedOnIcon: icon(RiLayoutRowLine),
  SwapVertIcon: icon(RiArrowUpDownLine),
  SyncAltIcon: icon(RiArrowLeftRightLine),
  ViewColumnIcon: icon(RiLayoutColumnLine),
  VisibilityOffIcon: icon(RiEyeOffLine),
  WrapTextIcon: icon(RiTextWrap),
} satisfies ST_Icons;
