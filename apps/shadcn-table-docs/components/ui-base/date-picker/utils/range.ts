import type * as React from "react"
import type { DateRange } from "react-day-picker"
import type { Limits, RangeEnd, RangeTimes, RangeValue } from "../types"
import { timeOnDay } from "./time"
import { datePart, joinDateTime, timePart, ymd } from "./values"

type PutEndInput = {
  range: RangeValue
  end: RangeEnd
  text: string
}

type SelectRangeInput = {
  range: RangeValue
  picked: DateRange | undefined
  times?: RangeTimes
  limits?: Limits & { step?: number }
}

type FormatRangeInput = {
  range: RangeValue
  formatEnd: (value: string) => string
  emptyEnd: string
  rangeJoin: string
}

type EndBoxes = Record<RangeEnd, React.RefObject<HTMLElement | null>>

const rangeEnds: RangeEnd[] = ["from", "to"]

function putEnd({ range: [from, to], end, text }: PutEndInput): RangeValue {
  return end === "from" ? [text, to] : [from, text]
}

function isReversed([from, to]: RangeValue) {
  return from !== "" && to !== "" && from > to
}

function orderRange(range: RangeValue, times?: RangeTimes): RangeValue {
  if (!isReversed(range)) {
    return range
  }
  const [from, to] = range
  if (!times) {
    return [to, from]
  }
  const newFrom =
    timePart(to) === times.to ? joinDateTime(datePart(to), times.from) : to
  const newTo =
    timePart(from) === times.from
      ? joinDateTime(datePart(from), times.to)
      : from
  return [newFrom, newTo]
}

function selectRange({
  range,
  picked,
  times,
  limits,
}: SelectRangeInput): RangeValue {
  if (!picked?.from || !picked.to) {
    return ["", ""]
  }
  const [from, to] = orderRange(range, times)
  const ends = { from, to }
  const days = { from: ymd(picked.from), to: ymd(picked.to) }
  function endOn(end: RangeEnd) {
    const day = days[end]
    if (datePart(ends[end]) === day) {
      return ends[end]
    }
    return times ? timeOnDay({ day, time: times[end], ...limits }) : day
  }
  return [endOn("from"), endOn("to")]
}

function pickRange([from, to]: RangeValue, period: string): RangeValue {
  const bothEmpty = from === "" && to === ""
  const bothSet = from !== "" && to !== ""
  if (bothEmpty || bothSet) {
    return [period, ""]
  }
  const lone = from || to
  return period < lone ? [period, lone] : [lone, period]
}

function rangeState(selected: string[], period: string) {
  const ends = selected.filter((end) => end !== "").sort()
  if (ends.includes(period)) {
    return "end"
  }
  const first = ends.at(0)
  const last = ends.at(-1)
  return first && last && period > first && period < last ? "middle" : undefined
}

function formatRange({
  range,
  formatEnd,
  emptyEnd,
  rangeJoin,
}: FormatRangeInput) {
  if (range.every((end) => end === "")) {
    return ""
  }
  return range
    .map((end) => (end === "" ? emptyEnd : formatEnd(end)))
    .join(rangeJoin)
}

function leftBothBoxes(event: React.FocusEvent, boxes: EndBoxes) {
  const inBox = (element: Element | null) =>
    rangeEnds.some((end) => boxes[end].current?.contains(element))
  return inBox(event.target) && !inBox(event.relatedTarget)
}

export {
  formatRange,
  isReversed,
  leftBothBoxes,
  orderRange,
  pickRange,
  putEnd,
  rangeEnds,
  rangeState,
  selectRange,
}
