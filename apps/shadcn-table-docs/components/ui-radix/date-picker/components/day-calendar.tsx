"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { getDefaultClassNames, useDayPicker } from "react-day-picker"
import type {
  Matcher,
  MonthCaptionProps,
  RootProps,
  WeekProps,
} from "react-day-picker"
import { cn } from "cn"
import { Badge } from "@/components/ui-radix/badge"
import { Calendar, CalendarDayButton } from "@/components/ui-radix/calendar"
import type { CalendarProps, Limits, ListBounds, RangeEnd } from "../types"
import { fromYmd } from "../utils/values"
import { LabelsContext } from "../utils/labels"
import { PhoneDialogContext } from "./picker-popup"
import { NavArrow, TodayButton } from "./view-nav"

type DayCalendarProps = React.ComponentProps<typeof Calendar> & {
  calendarProps?: CalendarProps
  limits: Limits
  bounds: ListBounds
  rangeBand?: boolean
  captionEnd?: RangeEnd
}

type EndCaptionProps = MonthCaptionProps & { end: RangeEnd }

const defaultClassNames = getDefaultClassNames()

const calendarClassNames = {
  month_caption: cn(
    "flex h-(--cell-size) w-full items-center justify-between gap-0.5",
    defaultClassNames.month_caption
  ),
  dropdowns: cn(
    "flex h-(--cell-size) items-center gap-1 text-xs font-medium tabular-nums",
    String.raw`**:[.rdp-caption\_label]:text-xs`,
    defaultClassNames.dropdowns
  ),
  today: cn(
    "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none data-[selected=true]:bg-transparent",
    defaultClassNames.today
  ),
  outside: cn(
    "text-muted-foreground aria-selected:text-muted-foreground",
    defaultClassNames.outside,
    "[&>button]:text-muted-foreground/60 [&>button[data-range-end=true]]:opacity-50 [&>button[data-range-middle=true]]:text-muted-foreground/60 [&>button[data-range-start=true]]:opacity-50"
  ),
  month: cn(
    "flex w-full flex-col gap-[calc(var(--cell-size)*0.4)]",
    defaultClassNames.month
  ),
  week: cn(
    "mt-[calc(var(--cell-size)*0.2)] flex w-full",
    defaultClassNames.week
  ),
}

const fillClassNames = {
  root: cn("w-full", defaultClassNames.root),
  months: cn("relative flex flex-1 flex-col gap-0", defaultClassNames.months),
  month: cn(calendarClassNames.month, "flex-1 gap-1"),
  month_grid: cn(
    "flex w-full flex-1 border-collapse flex-col",
    defaultClassNames.month_grid
  ),
  weeks: cn("flex flex-1 flex-col", defaultClassNames.weeks),
  week: cn(
    calendarClassNames.week,
    "mt-0 min-h-9 flex-1 *:flex *:aspect-auto *:h-auto *:flex-1 *:items-center *:justify-center *:rounded-none"
  ),
  week_number_header: cn(
    "w-(--cell-size) flex-1 select-none",
    defaultClassNames.week_number_header
  ),
  today: cn(
    calendarClassNames.today,
    "not-data-[selected=true]:bg-transparent not-data-[selected=true]:*:bg-muted"
  ),
}

const bandEnd =
  "before:absolute before:inset-y-0 before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-(--cell-radius) before:bg-muted after:absolute after:inset-y-0 after:bg-muted"

const bandClassNames = {
  root: cn("w-full", defaultClassNames.root),
  range_start: cn(
    bandEnd,
    "after:right-0 after:left-1/2 last:after:hidden",
    defaultClassNames.range_start
  ),
  range_end: cn(
    bandEnd,
    "after:right-1/2 after:left-0 first:after:hidden",
    defaultClassNames.range_end
  ),
  day_button: cn(
    "transition-none hover:transition-all focus-visible:transition-all data-[range-end=true]:transition-none! data-[range-middle=true]:transition-none! data-[range-start=true]:transition-none!",
    defaultClassNames.day_button
  ),
}

const bandFillClassNames = {
  root: cn(bandClassNames.root, "flex flex-1 flex-col"),
  range_middle: cn(
    "rounded-none data-[selected=true]:bg-muted data-[selected=true]:data-[today=true]:bg-muted",
    defaultClassNames.range_middle
  ),
  day_button: cn(
    bandClassNames.day_button,
    "size-(--cell-size) data-[range-middle=true]:bg-transparent data-[range-middle=true]:hover:bg-foreground/10"
  ),
}

const endCaptions = { from: FromCaption, to: ToCaption }

function Root({ rootRef, ...props }: RootProps) {
  return <div data-slot="calendar" ref={rootRef} {...props} />
}

function MonthCaption({ className, style, children }: MonthCaptionProps) {
  const { previousMonth, nextMonth, goToMonth, labels } = useDayPicker()
  return (
    <div className={className} style={style}>
      {children}
      <div className="flex shrink-0 items-center">
        <NavArrow
          label={labels.labelPrevious(previousMonth)}
          disabled={!previousMonth}
          onClick={() => {
            if (previousMonth) {
              goToMonth(previousMonth)
            }
          }}
        >
          <ChevronLeftIcon className="size-4 rtl:rotate-180" />
        </NavArrow>
        <TodayButton onClick={() => goToMonth(new Date())} />
        <NavArrow
          label={labels.labelNext(nextMonth)}
          disabled={!nextMonth}
          onClick={() => {
            if (nextMonth) {
              goToMonth(nextMonth)
            }
          }}
        >
          <ChevronRightIcon className="size-4 rtl:rotate-180" />
        </NavArrow>
      </div>
    </div>
  )
}

function EndCaption({ end, children, ...props }: EndCaptionProps) {
  const labels = React.useContext(LabelsContext)
  return (
    <MonthCaption {...props}>
      <div className="flex min-w-0 items-center gap-2">
        <Badge variant="secondary">{labels[end]}</Badge>
        {children}
      </div>
    </MonthCaption>
  )
}

function FromCaption(props: MonthCaptionProps) {
  return <EndCaption end="from" {...props} />
}

function ToCaption(props: MonthCaptionProps) {
  return <EndCaption end="to" {...props} />
}

function BlankWeek({ week, className, ...props }: WeekProps) {
  return (
    <tr
      className={cn(
        className,
        week.days.every((day) => day.outside) && "invisible"
      )}
      {...props}
    />
  )
}

function DayCalendar({
  calendarProps,
  limits,
  bounds,
  rangeBand,
  captionEnd,
  className,
  modifiers,
  modifiersClassNames,
  ...props
}: DayCalendarProps) {
  const phoneDialog = React.useContext(PhoneDialogContext)
  const {
    fixedWeeks = "blank",
    disabled = [],
    className: appClassName,
    classNames: appClassNames,
    modifiers: appModifiers,
    modifiersClassNames: appModifiersClassNames,
    ...appProps
  } = calendarProps ?? {}

  const disabledDays: Matcher[] = [disabled].flat()
  const minDay = limits.min ? fromYmd(limits.min) : undefined
  const maxDay = limits.max ? fromYmd(limits.max) : undefined
  if (minDay) {
    disabledDays.push({ before: minDay })
  }
  if (maxDay) {
    disabledDays.push({ after: maxDay })
  }

  return (
    <Calendar
      captionLayout="dropdown"
      {...appProps}
      hideNavigation
      fixedWeeks={fixedWeeks !== false}
      startMonth={bounds.start}
      endMonth={bounds.end}
      disabled={disabledDays}
      className={cn(
        "bg-transparent p-0",
        phoneDialog && "[--cell-size:--spacing(9)]",
        className,
        appClassName
      )}
      classNames={{
        ...calendarClassNames,
        ...(phoneDialog ? fillClassNames : undefined),
        ...(rangeBand ? bandClassNames : undefined),
        ...(rangeBand && phoneDialog ? bandFillClassNames : undefined),
        ...appClassNames,
      }}
      modifiers={{ ...modifiers, ...appModifiers }}
      modifiersClassNames={{
        ...modifiersClassNames,
        ...appModifiersClassNames,
      }}
      components={{
        Root,
        DayButton: CalendarDayButton,
        MonthCaption:
          phoneDialog && captionEnd ? endCaptions[captionEnd] : MonthCaption,
        ...(fixedWeeks === "blank" ? { Week: BlankWeek } : undefined),
      }}
      {...props}
    />
  )
}

export { DayCalendar }
