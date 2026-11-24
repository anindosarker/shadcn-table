"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/components/ui-radix/field"
import { DayCalendar } from "../components/day-calendar"
import { LabelsContext } from "../utils/labels"
import { PickerBox } from "../components/picker-box"
import { PickerPresets } from "../components/picker-presets"
import { TimeField } from "../components/time-field"
import type {
  CalendarProps,
  ControlProps,
  Limits,
  PopupActions,
  PopupOptions,
  Preset,
} from "../types"
import { dayTimeLimits, timeOnDay } from "../utils/time"
import { datePart, fromYmd, joinDateTime, timePart, ymd } from "../utils/values"
import { listBounds } from "../utils/views"

type DayPickerProps = ControlProps<string> &
  PopupOptions & {
    withTime: boolean
    step?: number
    calendarProps?: CalendarProps
    presets?: Preset<string>[]
  }

type DayPanelProps = Limits & {
  withTime: boolean
  value: string
  onChange: (value: string) => void
  step?: number
  calendarProps?: CalendarProps
  presets?: Preset<string>[]
  onPicked?: () => void
}

function DayPicker({
  withTime,
  value,
  onChange,
  min,
  max,
  step,
  calendarProps,
  presets,
  ...props
}: DayPickerProps) {
  const labels = React.useContext(LabelsContext)
  const popupActions = React.useRef<PopupActions>(null)
  const pickerLabel = withTime ? labels.selectDateTime : labels.selectDate
  return (
    <PickerBox
      type={withTime ? "datetime-local" : "date"}
      label={withTime ? labels.dateTime : labels.date}
      pickerLabel={pickerLabel}
      placeholder={pickerLabel}
      value={value}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      popupActions={popupActions}
      {...props}
    >
      <DayPanel
        withTime={withTime}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        calendarProps={calendarProps}
        presets={presets}
        onPicked={withTime ? undefined : () => popupActions.current?.close()}
      />
    </PickerBox>
  )
}

function DayPanel({
  withTime,
  value,
  onChange,
  min,
  max,
  step,
  calendarProps,
  presets,
  onPicked,
}: DayPanelProps) {
  const labels = React.useContext(LabelsContext)
  const timeId = React.useId()
  const day = datePart(value)
  const selected = fromYmd(day)
  const [month, setMonth] = React.useState(selected)
  const limitDays = { min: min && datePart(min), max: max && datePart(max) }
  const bounds = listBounds({
    days: [selected],
    ...limitDays,
    startMonth: calendarProps?.startMonth,
    endMonth: calendarProps?.endMonth,
  })
  return (
    <div className="flex flex-col gap-4">
      <DayCalendar
        mode="single"
        required
        calendarProps={calendarProps}
        limits={limitDays}
        bounds={bounds}
        selected={selected}
        month={month}
        onMonthChange={setMonth}
        onSelect={(picked) => {
          const date = ymd(picked)
          onChange(
            withTime
              ? timeOnDay({ day: date, time: timePart(value), min, max, step })
              : date
          )
          onPicked?.()
        }}
      />
      {withTime && (
        <Field className="border-t pt-4">
          <FieldLabel htmlFor={timeId}>{labels.time}</FieldLabel>
          <TimeField
            id={timeId}
            label={labels.time}
            pickerLabel={labels.selectTime}
            placeholder={labels.selectTime}
            required
            disabled={value === ""}
            value={timePart(value)}
            onValueChange={(time) => onChange(joinDateTime(day, time))}
            {...dayTimeLimits({ day, min, max, step })}
            step={step}
          />
        </Field>
      )}
      <PickerPresets
        presets={presets}
        onSelect={(next) => {
          onChange(next)
          setMonth(fromYmd(datePart(next)))
        }}
      />
    </div>
  )
}

export { DayPicker }
