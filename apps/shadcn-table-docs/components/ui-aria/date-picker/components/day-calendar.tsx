"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames, useDayPicker } from "react-day-picker"
import type {
  DayButton,
  Locale,
  Matcher,
  MonthCaptionProps,
  RootProps,
  WeekProps,
} from "react-day-picker"
import { cn } from "cn"
import { Badge } from "@/components/ui-aria/badge"
import { Button, buttonVariants } from "@/components/ui-aria/button"
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

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      data-slot="button"
      data-variant="ghost"
      data-size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
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
