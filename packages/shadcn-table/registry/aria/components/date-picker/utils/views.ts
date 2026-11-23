import {
  addMonths,
  clamp,
  getYear,
  isAfter,
  isBefore,
  startOfDecade,
  startOfMonth,
  startOfYear,
} from "date-fns"
import type { Limits, ListBounds, PeriodType, RangeEnd } from "../types"
import { dayLimits, fromYmd, inYear } from "./values"

type ListSource = Limits & {
  days: (Date | undefined)[]
  startMonth?: Date
  endMonth?: Date
}

type PeriodListSource = ListSource & { type: PeriodType }

type RangeViews = Record<RangeEnd, Date> & { moved: RangeEnd }

type ShownViewsInput = {
  views: RangeViews
  bounds: ListBounds
  viewMonths: number
}

type EndBoundsInput = {
  end: RangeEnd
  bounds: ListBounds
  viewMonths: number
}

const periodViewMonths = { week: 1, month: 12, year: 120 }

function listBounds({
  days,
  min,
  max,
  startMonth,
  endMonth,
}: ListSource): ListBounds {
  const minDay = min ? fromYmd(min) : undefined
  const maxDay = max ? fromYmd(max) : undefined
  const years = [...days, minDay, maxDay].flatMap((day) =>
    day ? [getYear(day)] : []
  )
  const firstYear = Math.min(
    1900,
    ...years.map((year) => Math.floor(year / 100) * 100)
  )
  const lastYear = Math.max(
    2100,
    ...years.map((year) => Math.ceil(year / 100) * 100)
  )
  return {
    start: startMonth ?? (minDay ? startOfMonth(minDay) : inYear(firstYear)),
    end: endMonth ?? (maxDay ? startOfMonth(maxDay) : inYear(lastYear, 11)),
  }
}

function clampView(view: Date, bounds: ListBounds) {
  return startOfMonth(clamp(view, bounds))
}

function periodViewStart(type: PeriodType, date: Date) {
  switch (type) {
    case "week":
      return startOfMonth(date)
    case "month":
      return startOfYear(date)
    default:
      return startOfDecade(date)
  }
}

function periodBounds({
  type,
  min,
  max,
  ...source
}: PeriodListSource): ListBounds {
  const list = listBounds({ ...source, ...dayLimits(type, { min, max }) })
  return {
    start: periodViewStart(type, list.start),
    end: periodViewStart(type, list.end),
  }
}

function viewsForRange(
  { from, to }: Partial<Record<RangeEnd, Date>>,
  viewMonths: number
): RangeViews {
  if (!from && to) {
    return { from: addMonths(to, -viewMonths), to, moved: "to" }
  }
  const first = from ?? new Date()
  return { from: first, to: to ?? addMonths(first, viewMonths), moved: "from" }
}

function endBounds({ end, bounds, viewMonths }: EndBoundsInput): ListBounds {
  const second = addMonths(bounds.start, viewMonths)
  if (isAfter(second, bounds.end)) {
    return bounds
  }
  return end === "from"
    ? { start: bounds.start, end: addMonths(bounds.end, -viewMonths) }
    : { start: second, end: bounds.end }
}

function shownViews({
  views,
  bounds,
  viewMonths,
}: ShownViewsInput): Record<RangeEnd, Date> {
  const from = clampView(
    views.from,
    endBounds({ end: "from", bounds, viewMonths })
  )
  const to = clampView(views.to, endBounds({ end: "to", bounds, viewMonths }))
  if (isBefore(from, to)) {
    return { from, to }
  }
  return views.moved === "from"
    ? { from, to: clampView(addMonths(from, viewMonths), bounds) }
    : { from: clampView(addMonths(to, -viewMonths), bounds), to }
}

export {
  clampView,
  endBounds,
  listBounds,
  periodBounds,
  periodViewMonths,
  periodViewStart,
  shownViews,
  viewsForRange,
}
