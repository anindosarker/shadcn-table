import * as React from "react"
import {
  addMonths,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfDecade,
  endOfISOWeek,
  endOfYear,
  getYear,
  isAfter,
  isBefore,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import type { CalendarProps, Limits, ListBounds, PeriodType } from "../types"
import { rangeState } from "../utils/range"
import {
  dateLibFor,
  dayLimits,
  inYear,
  outsideLimits,
  periodOf,
  startOfPeriod,
} from "../utils/values"
import { periodViewMonths } from "../utils/views"
import { DayCalendar } from "./day-calendar"
import { LabelsContext } from "../utils/labels"
import { NavArrow, TodayButton } from "./view-nav"

type ViewProps = {
  selected: string[]
  view: Date
  onViewChange: (view: Date) => void
  bounds: ListBounds
  limits: Limits
  calendarProps?: CalendarProps
  onPick: (period: string) => void
}

type WeekCalendarProps = ViewProps & {
  rangeBand?: boolean
}

type PeriodViewProps = WeekCalendarProps & { type: PeriodType }

type GridArrow = Omit<React.ComponentProps<typeof NavArrow>, "children">

type GridHeaderProps = {
  children: React.ReactNode
  previous: GridArrow
  next: GridArrow
  onToday: () => void
}

type GridCell = {
  value: string
  text: string
  disabled: boolean
  today: boolean
  state: "end" | "middle" | undefined
}

type PeriodGridProps = {
  label: string
  cells: GridCell[]
  onPick: (period: string) => void
}

function PeriodView({ type, rangeBand, ...props }: PeriodViewProps) {
  switch (type) {
    case "week":
      return <WeekCalendar rangeBand={rangeBand} {...props} />
    case "month":
      return <MonthGrid {...props} />
    default:
      return <YearGrid {...props} />
  }
}

function WeekCalendar({
  selected,
  view,
  onViewChange,
  bounds,
  limits,
  calendarProps,
  onPick,
  rangeBand,
}: WeekCalendarProps) {
  const weeks = selected.filter((week) => week !== "").sort()
  const first = startOfPeriod("week", weeks.at(0) ?? "")
  const last = startOfPeriod("week", weeks.at(-1) ?? "")
  return (
    <DayCalendar
      mode="range"
      showWeekNumber
      ISOWeek
      rangeBand={rangeBand}
      calendarProps={calendarProps}
      limits={dayLimits("week", limits)}
      bounds={bounds}
      selected={
        first && last ? { from: first, to: endOfISOWeek(last) } : undefined
      }
      month={view}
      onMonthChange={onViewChange}
      onSelect={(_range, day) => onPick(periodOf("week", day))}
    />
  )
}

function MonthGrid({
  selected,
  view,
  onViewChange,
  bounds,
  limits,
  calendarProps,
  onPick,
}: ViewProps) {
  const labels = React.useContext(LabelsContext)
  const lib = dateLibFor(calendarProps?.locale)
  const thisMonth = periodOf("month", new Date())
  return (
    <div className="flex flex-col gap-2">
      <GridHeader
        previous={{
          label: labels.previousYear,
          disabled: !isAfter(view, bounds.start),
          onClick: () => onViewChange(addMonths(view, -periodViewMonths.month)),
        }}
        next={{
          label: labels.nextYear,
          disabled: !isBefore(view, bounds.end),
          onClick: () => onViewChange(addMonths(view, periodViewMonths.month)),
        }}
        onToday={() => onViewChange(new Date())}
      >
        <NativeSelect
          size="sm"
          aria-label={labels.year}
          value={getYear(view)}
          onChange={(event) => onViewChange(inYear(Number(event.target.value)))}
        >
          {eachYearOfInterval(bounds).map((year) => (
            <NativeSelectOption key={getYear(year)} value={getYear(year)}>
              {periodOf("year", year)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </GridHeader>
      <PeriodGrid
        label={periodOf("year", view)}
        cells={eachMonthOfInterval({ start: view, end: endOfYear(view) }).map(
          (month) => {
            const value = periodOf("month", month)
            return {
              value,
              text: lib.format(month, "LLL"),
              disabled: outsideLimits(value, limits),
              today: value === thisMonth,
              state: rangeState(selected, value),
            }
          }
        )}
        onPick={onPick}
      />
    </div>
  )
}

function YearGrid({
  selected,
  view,
  onViewChange,
  bounds,
  limits,
  onPick,
}: ViewProps) {
  const labels = React.useContext(LabelsContext)
  const lastYear = endOfDecade(view)
  const decade = labels.decade(
    periodOf("year", view),
    periodOf("year", lastYear)
  )
  const thisYear = periodOf("year", new Date())
  return (
    <div className="flex flex-col gap-2">
      <GridHeader
        previous={{
          label: labels.previousYears,
          disabled: !isAfter(view, bounds.start),
          onClick: () => onViewChange(addMonths(view, -periodViewMonths.year)),
        }}
        next={{
          label: labels.nextYears,
          disabled: !isBefore(view, bounds.end),
          onClick: () => onViewChange(addMonths(view, periodViewMonths.year)),
        }}
        onToday={() => onViewChange(new Date())}
      >
        <span className="px-1 text-sm font-medium tabular-nums">{decade}</span>
      </GridHeader>
      <PeriodGrid
        label={decade}
        cells={eachYearOfInterval({ start: view, end: lastYear }).map(
          (year) => {
            const value = periodOf("year", year)
            return {
              value,
              text: value,
              disabled: outsideLimits(value, limits),
              today: value === thisYear,
              state: rangeState(selected, value),
            }
          }
        )}
        onPick={onPick}
      />
    </div>
  )
}

function GridHeader({ children, previous, next, onToday }: GridHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-0.5">
      {children}
      <div className="flex shrink-0 items-center">
        <NavArrow {...previous}>
          <ChevronLeftIcon />
        </NavArrow>
        <TodayButton onClick={onToday} />
        <NavArrow {...next}>
          <ChevronRightIcon />
        </NavArrow>
      </div>
    </div>
  )
}

function PeriodGrid({ label, cells, onPick }: PeriodGridProps) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-1">
      {cells.map((cell) => (
        <Button
          key={cell.value}
          variant={cell.state === "end" ? "default" : "ghost"}
          aria-pressed={cell.state === "end"}
          aria-current={cell.today ? "date" : undefined}
          disabled={cell.disabled}
          className={cn(
            "font-normal tabular-nums",
            cell.state === "middle" && "bg-muted",
            cell.today && !cell.state && "bg-muted text-foreground"
          )}
          onClick={() => onPick(cell.value)}
        >
          {cell.text}
        </Button>
      ))}
    </div>
  )
}

export { PeriodView }
