"use client"

import * as React from "react"
import { defaultLabels, LabelsContext } from "./utils/labels"
import { TimeField } from "./components/time-field"
import { DayPicker } from "./modes/day-picker"
import { DayRangePicker } from "./modes/day-range-picker"
import { PeriodPicker } from "./modes/period-picker"
import { PeriodRangePicker } from "./modes/period-range-picker"
import { TimeRangePicker } from "./modes/time-range-picker"
import type { DatePickerProps, RangeValue, TypedPickerProps } from "./types"
import { checkedLimits, checkedStep } from "./utils/values"

/**
 * A date picker component for date, time or range values.
 * Use `type` to specify the kind of value: date, datetime, time, week, month or year.
 *
 * @example
 * <DatePicker type="date" value="2026-11-21" onChange={setValue} />
 * <DatePicker type="month" range value={["2026-01", "2026-06"]} onChange={setRange} />
 */
function DatePicker({ labels, ...props }: DatePickerProps) {
  return (
    <LabelsContext value={{ ...defaultLabels, ...labels }}>
      <TypedPicker {...props} />
    </LabelsContext>
  )
}

function TypedPicker({
  type,
  range,
  value,
  onChange,
  presets,
  min,
  max,
  step,
  ...props
}: TypedPickerProps) {
  const labels = React.useContext(LabelsContext)
  const checked = {
    ...checkedLimits(type, { min, max }),
    step: checkedStep(step),
  }

  if (range) {
    const [from, to] = value
    const changeRange = (next: RangeValue) => {
      const [nextFrom, nextTo] = next
      if (nextFrom !== from || nextTo !== to) {
        onChange(next)
      }
    }
    switch (type) {
      case "date":
      case "datetime":
        return (
          <DayRangePicker
            withTime={type === "datetime"}
            value={value}
            onChange={changeRange}
            presets={presets}
            {...checked}
            {...props}
          />
        )
      case "time":
        return (
          <TimeRangePicker
            value={value}
            onChange={changeRange}
            {...checked}
            {...props}
          />
        )
      default:
        return (
          <PeriodRangePicker
            type={type}
            value={value}
            onChange={changeRange}
            presets={presets}
            min={checked.min}
            max={checked.max}
            {...props}
          />
        )
    }
  }

  const change = (next: string) => {
    if (next !== value) {
      onChange(next)
    }
  }

  switch (type) {
    case "date":
    case "datetime":
      return (
        <DayPicker
          withTime={type === "datetime"}
          value={value}
          onChange={change}
          presets={presets}
          {...checked}
          {...props}
        />
      )
    case "time":
      return (
        <TimeField
          label={labels.time}
          pickerLabel={labels.selectTime}
          value={value}
          onValueChange={change}
          {...checked}
          {...props}
        />
      )
    default:
      return (
        <PeriodPicker
          type={type}
          value={value}
          onChange={change}
          presets={presets}
          min={checked.min}
          max={checked.max}
          {...props}
        />
      )
  }
}

export { DatePicker }
