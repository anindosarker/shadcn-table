// The Remix icon set: the keys of the Lucide map in icons.ts, drawn with
// @remixicon/react. Where Remix has no match, the closest icon stands in and
// its entry names the Lucide original.
import { createElement } from 'react';
import {
  RiArrowDownDoubleLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseCircleLine,
  RiCloseLine,
  RiDraggable,
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
  RiMenu2Line,
  RiMenuLine,
  RiMore2Line,
  RiMoreLine,
  RiPencilLine,
  RiPushpinLine,
  RiRestartLine,
  RiSave3Line,
  RiSearchLine,
  RiSkipLeftLine,
  RiSkipRightLine,
  RiSortDesc,
  RiStackLine,
  RiSubtractLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import type {
  ST_IconProps,
  ST_Icons,
} from '@/components/ui/shadcn-table/types';

// Remix types its icons without children; each entry drops them.
const icon = (Ri: RemixiconComponentType) => {
  const Icon = ({ children: _children, ...props }: ST_IconProps) =>
    createElement(Ri, props);
  return Icon;
};

export const ST_Default_Icons = {
  ArrowDownwardIcon: icon(RiArrowDownLine),
  ArrowRightIcon: icon(RiArrowRightSLine),
  CancelIcon: icon(RiCloseCircleLine),
  ChevronLeftIcon: icon(RiArrowLeftSLine),
  ChevronRightIcon: icon(RiArrowRightSLine),
  ClearAllIcon: icon(RiEraserLine),
  CloseIcon: icon(RiCloseLine),
  ContentCopy: icon(RiFileCopyLine),
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
  IndeterminateIcon: icon(RiSubtractLine),
  KeyboardDoubleArrowDownIcon: icon(RiArrowDownDoubleLine),
  // Stands in for Lucide ChevronLast.
  LastPageIcon: icon(RiSkipRightLine),
  MoreHorizIcon: icon(RiMoreLine),
  MoreVertIcon: icon(RiMore2Line),
  PushPinIcon: icon(RiPushpinLine),
  RestartAltIcon: icon(RiRestartLine),
  SaveIcon: icon(RiSave3Line),
  SearchIcon: icon(RiSearchLine),
  // Stands in for Lucide SearchX.
  SearchOffIcon: icon(RiSearchLine),
  SortIcon: icon(RiSortDesc),
  SyncAltIcon: icon(RiArrowLeftRightLine),
  ViewColumnIcon: icon(RiLayoutColumnLine),
  VisibilityOffIcon: icon(RiEyeOffLine),
} satisfies ST_Icons;
