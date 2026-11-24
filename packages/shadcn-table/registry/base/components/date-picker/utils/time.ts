import type { ClockUnit, Limits } from "../types"
import { datePart, joinDateTime, timeFormat, timePart } from "./values"

type StepSearch = { from: number; to: number; base: number; step: number }

type AllowedTimeInput = Limits & { time: string; step?: number }

type EdgeTimeInput = {
  edge: "first" | "last"
  step?: number
  min?: string
}

type DayTimeLimitsInput = Limits & { day: string; step?: number }

type TimeOnDayInput = DayTimeLimitsInput & {
  time: string
}

type ClockInput = Limits & {
  value: string
  step: number
  hour12?: boolean
}

type UnitList = {
  start: number
  size: number
  count: number
  keepsHour?: boolean
}

const lastSecondOfDay = 24 * 3600 - 1

const unitSeconds = { halfDay: 12 * 3600, hour: 3600, minute: 60, second: 1 }

function toSeconds(time: string) {
  if (!timeFormat.test(time)) {
    return undefined
  }
  const [hours, minutes, seconds = 0] = time.split(":").map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

function timeText(seconds: number) {
  const twoDigits = (part: number) => String(part).padStart(2, "0")
  const hours = twoDigits(Math.floor(seconds / 3600))
  const minutes = twoDigits(Math.floor(seconds / 60) % 60)
  const time = `${hours}:${minutes}`
  return seconds % 60 === 0 ? time : `${time}:${twoDigits(seconds % 60)}`
}

function firstOnStep({ from, to, base, step }: StepSearch) {
  const first = base + Math.ceil((from - base) / step) * step
  return first <= to ? first : undefined
}

function allowedTime({ time, min, max, step }: AllowedTimeInput) {
  const first = toSeconds(min ?? "") ?? 0
  const end = toSeconds(max ?? "") ?? lastSecondOfDay
  const last = step
    ? first + Math.max(0, Math.floor((end - first) / step)) * step
    : end
  return timeText(Math.min(Math.max(toSeconds(time) ?? 0, first), last))
}

function edgeTime({ edge, step, min }: EdgeTimeInput) {
  if (!step) {
    return edge === "first" ? "00:00" : "23:59"
  }
  const base = toSeconds(timePart(min ?? "")) ?? 0
  const first = timeText(base % step)
  return edge === "first"
    ? first
    : allowedTime({ time: timeText(lastSecondOfDay), min: first, step })
}

function dayTimeLimits({ day, min, max, step }: DayTimeLimitsInput): Limits {
  const stepStart = step ? edgeTime({ edge: "first", step, min }) : undefined
  return {
    min: min && datePart(min) === day ? timePart(min) : stepStart,
    max: max && datePart(max) === day ? timePart(max) : undefined,
  }
}

function timeOnDay({ day, time, min, max, step }: TimeOnDayInput) {
  const limits = dayTimeLimits({ day, min, max, step })
  return joinDateTime(day, allowedTime({ time, ...limits, step }))
}

function clockColumns({ value, min, max, step, hour12 }: ClockInput) {
  const base = toSeconds(min ?? "") ?? 0
  const end = toSeconds(max ?? "") ?? Infinity
  const at = toSeconds(value)
  const shown = at ?? base
  const halfStart =
    at !== undefined && at >= unitSeconds.halfDay ? unitSeconds.halfDay : 0

  function units({ start, size, count, keepsHour }: UnitList) {
    return Array.from({ length: count }).flatMap((_, index): ClockUnit[] => {
      const from = start + index * size
      const to = from + size - 1
      const firstInUnit = firstOnStep({ from, to, base, step })
      if (firstInUnit === undefined) {
        return []
      }
      const firstAllowed = firstOnStep({
        from: Math.max(from, base),
        to: Math.min(to, end),
        base,
        step,
      })
      const replaced = from + ((at ?? 0) % size)
      const fromHour = keepsHour
        ? firstOnStep({
            from: replaced - (replaced % unitSeconds.hour),
            to,
            base,
            step,
          })
        : undefined
      const picked =
        (replaced - base) % step === 0 ? replaced : (fromHour ?? firstInUnit)
      return [
        {
          index,
          selected: at !== undefined && from <= at && at <= to,
          disabled: firstAllowed === undefined,
          time: allowedTime({ time: timeText(picked), min, max, step }),
        },
      ]
    })
  }

  return {
    hour: units(
      hour12
        ? { start: halfStart, size: unitSeconds.hour, count: 12 }
        : { start: 0, size: unitSeconds.hour, count: 24 }
    ),
    minute: units({
      start: shown - (shown % unitSeconds.hour),
      size: unitSeconds.minute,
      count: 60,
    }),
    second:
      step % unitSeconds.minute === 0
        ? undefined
        : units({
            start: shown - (shown % unitSeconds.minute),
            size: unitSeconds.second,
            count: 60,
          }),
    halfDay: hour12
      ? units({
          start: 0,
          size: unitSeconds.halfDay,
          count: 2,
          keepsHour: true,
        })
      : undefined,
  }
}

export { clockColumns, dayTimeLimits, edgeTime, timeOnDay }
