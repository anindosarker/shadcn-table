import {
  endOfISOWeek,
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parse,
  setYear,
} from "date-fns"
import { DateLib, defaultLocale } from "react-day-picker"
import type { DayPickerLocale } from "react-day-picker"
import type { DatePickerType, Limits, PeriodType } from "../types"

type IgnoredProp = { name: string; given: unknown; rule: string }

type FormatPeriodInput = {
  type: PeriodType
  value: string
  weekValue: (week: string, year: string) => string
  lib: DateLib
}

const dayFormat = "yyyy-MM-dd"

const timeFormat = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

const periodFormats = { week: "RRRR-'W'II", month: "yyyy-MM", year: "yyyy" }

const endOfPeriod = { week: endOfISOWeek, month: endOfMonth, year: endOfYear }

/** Converts a "yyyy-MM-dd" string to a `Date`. Returns `undefined` if the string is not a valid date. */
function fromYmd(text: string) {
  const date = parse(text, dayFormat, new Date())
  return isValid(date) && format(date, dayFormat) === text ? date : undefined
}

function ymd(date: Date) {
  return format(date, dayFormat)
}

function datePart(value: string) {
  return value.slice(0, 10)
}

function timePart(value: string) {
  return value.slice(11)
}

function joinDateTime(date: string, time: string) {
  return `${date}T${time}`
}

function inYear(year: number, month?: number) {
  return setYear(new Date(2000, month ?? 0, 1), year)
}

function periodOf(type: PeriodType, date: Date) {
  return format(date, periodFormats[type])
}

/** Converts a week, month or year string to the `Date` of its first day. Returns `undefined` if the string is not valid. */
function startOfPeriod(type: PeriodType, value: string) {
  const date = parse(value, periodFormats[type], new Date())
  return isValid(date) && periodOf(type, date) === value ? date : undefined
}

function dayLimits(type: PeriodType, { min, max }: Limits): Limits {
  const first = min ? startOfPeriod(type, min) : undefined
  const last = max ? startOfPeriod(type, max) : undefined
  return {
    min: first && ymd(first),
    max: last && ymd(endOfPeriod[type](last)),
  }
}

function outsideLimits(value: string, { min, max }: Limits) {
  return value !== "" && ((!!min && value < min) || (!!max && value > max))
}

function isValue(type: DatePickerType, text: string): boolean {
  switch (type) {
    case "date":
      return fromYmd(text) !== undefined
    case "datetime":
      return (
        isValue("date", datePart(text)) &&
        text.charAt(10) === "T" &&
        isValue("time", timePart(text))
      )
    case "time":
      return timeFormat.test(text)
    default:
      return startOfPeriod(type, text) !== undefined
  }
}

function ignored({ name, given, rule }: IgnoredProp) {
  if (process.env.NODE_ENV !== "production") {
    console.error(
      `DatePicker: ${name} ${JSON.stringify(given)} is ignored: ${rule}`
    )
  }
  return undefined
}

function checkedLimits(type: DatePickerType, limits: Limits): Limits {
  function checked(name: "min" | "max") {
    const text = limits[name]
    return text === undefined || isValue(type, text)
      ? text
      : ignored({ name, given: text, rule: `not a ${type} value` })
  }
  return { min: checked("min"), max: checked("max") }
}

function checkedStep(step: number | undefined) {
  return step === undefined || (Number.isInteger(step) && step > 0)
    ? step
    : ignored({
        name: "step",
        given: step,
        rule: "not a whole number of seconds above zero",
      })
}

function dateLibFor(locale: Partial<DayPickerLocale> | undefined) {
  return new DateLib({ locale: { ...defaultLocale, ...locale } })
}

function formatValue(value: string, lib: DateLib) {
  const day = fromYmd(datePart(value))
  if (!day) {
    return value
  }
  const time = timePart(value)
  if (time === "") {
    return lib.format(day, "PP")
  }
  const withSeconds = time.length > 5
  const at = parse(time, withSeconds ? "HH:mm:ss" : "HH:mm", day)
  return isValid(at) ? lib.format(at, withSeconds ? "PP pp" : "PP p") : value
}

function formatPeriod({ type, value, weekValue, lib }: FormatPeriodInput) {
  const day = startOfPeriod(type, value)
  if (!day) {
    return value
  }
  switch (type) {
    case "week":
      return weekValue(lib.format(day, "I"), lib.format(day, "RRRR"))
    case "month":
      return lib.format(day, "LLL yyyy")
    default:
      return lib.format(day, "yyyy")
  }
}

export {
  checkedLimits,
  checkedStep,
  dateLibFor,
  datePart,
  dayLimits,
  formatPeriod,
  formatValue,
  fromYmd,
  inYear,
  joinDateTime,
  outsideLimits,
  periodOf,
  startOfPeriod,
  timeFormat,
  timePart,
  ymd,
}
