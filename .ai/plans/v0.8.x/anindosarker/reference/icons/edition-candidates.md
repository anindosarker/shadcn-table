# Edition icon candidates for the D75 view settings icons (06.6)

Lookup 2026-11-06 against the installed packages. Every proposed name exists in the package named in the heading; shapes were read from the SVG paths. "+ rotate-90" and "+ -scale-x-100" mean the same Tailwind wrappers D75 uses for Lucide (`EqualVertical`, `ListIndentDecreaseFlipped`). In all four sets the three GridLines keys other than None still point to the drawn `ST_GridLines*Icon` components (F59), which 06.6 deletes (D76).

## Tabler (`@tabler/icons-react` 3.50.0)

| key | current | proposed | shape | alternative |
|---|---|---|---|---|
| GridLinesAllIcon | ST_GridLinesAllIcon | `IconFrame` | two horizontal and two vertical lines crossing, no border (same as Lucide Frame) | `IconBorderInner`: one centre cross with a dotted outer border |
| GridLinesRowsIcon | ST_GridLinesRowsIcon | `IconEqual` | two horizontal lines | `IconBorderHorizontal`: one solid horizontal line inside a dotted box |
| GridLinesColumnsIcon | ST_GridLinesColumnsIcon | `IconEqual` + rotate-90 | two vertical lines | `IconBorderVertical`: one solid vertical line inside a dotted box |
| GridLinesNoneIcon | IconSquare | `IconSquare` (keep) | outlined rounded square | `IconBorderNone`: dotted grid only |
| ViewColumnIcon | IconColumns3 | `IconTableOptions` | 2x2 table outline with a cog in the bottom-right corner | `IconColumns3` (keep): box split into three columns, no cog |
| DensitySmallIcon | IconBaselineDensitySmall | keep | four tightly spaced lines | none |
| DensityMediumIcon | IconBaselineDensityMedium | keep | three lines | none |
| DensityLargeIcon | IconBaselineDensityLarge | keep | two widely spaced lines | `IconLineHeight`: three lines with an up/down arrow |

Tabler has no columns icon with a cog and no list icon with chevrons. The density keys keep the IconBaselineDensity trio, a real density set.

## Phosphor (`@phosphor-icons/react` 2.1.10)

| key | current | proposed | shape | alternative |
|---|---|---|---|---|
| GridLinesAllIcon | ST_GridLinesAllIcon | `HashStraightIcon` | upright # with no slant and no border (same as Frame) | `HashIcon`: slanted # |
| GridLinesRowsIcon | ST_GridLinesRowsIcon | `EqualsIcon` | two horizontal lines | none |
| GridLinesColumnsIcon | ST_GridLinesColumnsIcon | `EqualsIcon` + rotate-90 | two vertical lines | `LineVerticalIcon`: a single vertical line |
| GridLinesNoneIcon | SquareIcon | `SquareIcon` (keep) | outlined rounded square | none |
| ViewColumnIcon | ColumnsIcon | `ColumnsIcon` (keep) | two tall rounded column bars, no cog | `KanbanIcon`: box with three columns of different heights |
| DensitySmallIcon | ListDashesIcon | `ArrowsInLineVerticalIcon` | horizontal line with arrows pointing in from above and below | keep `ListDashesIcon`: lines with short dashes on the left |
| DensityMediumIcon | ListIcon | `TextOutdentIcon` + -scale-x-100 | stacked lines with a left caret (same as Lucide ListIndentDecrease) | keep `ListIcon`: three plain lines |
| DensityLargeIcon | RowsIcon | `ArrowsOutLineVerticalIcon` | horizontal line with arrows pointing out up and down | `CaretUpDownIcon`: two chevrons pointing outward, no lines |

Phosphor has no borderless frame other than `HashStraightIcon`, no columns icon with a cog, no list icon with chevrons.

## Remix (`@remixicon/react` 4.9.0)

| key | current | proposed | shape | alternative |
|---|---|---|---|---|
| GridLinesAllIcon | ST_GridLinesAllIcon | `RiHashtag` | slanted #, no border (stretch) | `RiGridLine`: 3x3 grid inside a border |
| GridLinesRowsIcon | ST_GridLinesRowsIcon | `RiEqualLine` | two horizontal bars | none |
| GridLinesColumnsIcon | ST_GridLinesColumnsIcon | `RiEqualLine` + rotate-90 | two vertical bars | none |
| GridLinesNoneIcon | RiCheckboxBlankLine | `RiSquareLine` | outlined square | keep `RiCheckboxBlankLine`: rounded square |
| ViewColumnIcon | RiLayoutColumnLine | `RiKanbanView` | box with three vertical bars of different heights, no cog | `RiListSettingsLine`: list lines with a cog |
| DensitySmallIcon | RiMenu2Line | `RiContractUpDownLine` | two chevrons pointing inward, no lines | `RiCollapseVerticalLine`: two arrows pointing inward |
| DensityMediumIcon | RiMenuLine | `RiIndentDecrease` + -scale-x-100 | four lines with a left-pointing triangle (same as Lucide ListIndentDecrease) | keep `RiMenuLine`: three lines |
| DensityLargeIcon | RiLayoutRowLine | `RiExpandUpDownLine` | two chevrons pointing outward, no lines | `RiLineHeight`: three lines with an up/down arrow |

Remix has no straight borderless # (only the slanted `RiHashtag`), no columns icon with a cog, no list icon with chevrons (the chevron pair has no lines).

## Hugeicons (`@hugeicons/core-free-icons` 4.4.0)

| key | current | proposed | shape | alternative |
|---|---|---|---|---|
| GridLinesAllIcon | ST_GridLinesAllIcon | `FrameIcon` | two horizontal and two vertical lines crossing, no border (same as Lucide Frame) | `HashIcon`: slanted # |
| GridLinesRowsIcon | ST_GridLinesRowsIcon | `EqualIcon` | two horizontal lines | `EqualSignIcon`: the same with wider spacing |
| GridLinesColumnsIcon | ST_GridLinesColumnsIcon | `EqualIcon` + rotate-90 | two vertical lines | none |
| GridLinesNoneIcon | SquareIcon | `SquareIcon` (keep) | outlined squircle | none |
| ViewColumnIcon | Layout3ColumnIcon | `Columns3CogIcon` | three columns with a small cog (same as Lucide) | keep `Layout3ColumnIcon` |
| DensitySmallIcon | Rows4Icon | `ListChevronsDownUpIcon` | three list lines with chevrons pointing inward (same as Lucide) | keep `Rows4Icon` |
| DensityMediumIcon | Rows3Icon | `ListIndentDecreaseIcon` + -scale-x-100 | three lines with a left chevron (same as Lucide) | keep `Rows3Icon` |
| DensityLargeIcon | Rows2Icon | `UnfoldMoreIcon` | two chevrons pointing outward, no lines | keep `Rows2Icon` |

Hugeicons has no `ListChevronsUpDownIcon`; flipping `ListChevronsDownUpIcon` vertically keeps the chevrons pointing inward.
