"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/components/ui-radix/field"
import { DayCalendar } from "../components/day-calendar"
import { LabelsContext } from "../utils/labels"
import { PickerField } from "../components/picker-field"
import { PhoneDialogContext } from "../components/picker-popup"
import { PickerPresets } from "../components/picker-presets"
import { PickerTrigger } from "../components/picker-trigger"
import { ClockPopover } from "../components/time-field"
import type {
  CalendarProps,
  ControlProps,
  Limits,
  PopupOptions,
  Preset,
  RangeEnd,
  RangeTimes,
  RangeValue,
} from "../types"
import {
  formatRange,
  isReversed,
  leftBothBoxes,
  orderRange,
  putEnd,
  rangeEnds,
  selectRange,
} from "../utils/range"
import { dayTimeLimits, edgeTime } from "../utils/time"
import {
  dateLibFor,
  datePart,
  formatValue,
  fromYmd,
  joinDateTime,
  timePart,
} from "../utils/values"
import {
  endBounds,
  listBounds,
  shownViews,
  viewsForRange,
} from "../utils/views"

type DayRangePickerProps = ControlProps<RangeValue> &
  PopupOptions & {
    withTime: boolean
    step?: number
    calendarProps?: CalendarProps
    presets?: Preset<RangeValue>[]
  }

type DayRangePanelProps = Limits & {
  value: RangeValue
  onChange: (value: RangeValue) => void
  step?: number
  calendarProps?: CalendarProps
  presets?: Preset<RangeValue>[]
  times?: RangeTimes
}

const viewMonths = 1

const dateTimeBoxClassName =
  "overflow-hidden contain-inline-size *:data-[slot=input-group-addon]:pr-1 *:data-[slot=input-group-addon]:not-last-of-type:mr-0 *:data-[slot=input-group-control]:pr-0 *:data-[slot=input-group-control]:pl-2"

function DayRangePicker({
  withTime,
  value,
  onChange,
  min,
  max,
  step,
  calendarProps,
  presets,
  ...props
}: DayRangePickerProps) {
  const labels = React.useContext(LabelsContext)
  const lib = dateLibFor(calendarProps?.locale)
  const times = withTime
    ? {
        from: edgeTime({ edge: "first", step, min }),
        to: edgeTime({ edge: "last", step, min }),
      }
    : undefined
  return (
    <PickerTrigger
      label={withTime ? labels.dateTimeRange : labels.dateRange}
      text={formatRange({
        range: value,
        formatEnd: (end) => formatValue(end, lib),
        emptyEnd: labels.emptyEnd,
        rangeJoin: labels.rangeJoin,
      })}
      placeholder={withTime ? labels.pickDateTimeRange : labels.pickDateRange}
      onClear={() => onChange(["", ""])}
      onClose={() => onChange(orderRange(value, times))}
      {...props}
    >
      <DayRangePanel
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        calendarProps={calendarProps}
        presets={presets}
        times={times}
      />
    </PickerTrigger>
  )
}

function DayRangePanel({
  value,
  onChange,
  min,
  max,
  step,
  calendarProps,
  presets,
  times,
}: DayRangePanelProps) {
  const labels = React.useContext(LabelsContext)
  const phoneDialog = React.useContext(PhoneDialogContext)
  const id = React.useId()
  const ids = { from: `${id}-from`, to: `${id}-to` }
  const boxes = {
    from: React.useRef<HTMLDivElement>(null),
    to: React.useRef<HTMLDivElement>(null),
  }
  const [from, to] = value
  const ends = { from, to }
  const daysOf = ([first, second]: RangeValue) => ({
    from: fromYmd(datePart(first)),
    to: fromYmd(datePart(second)),
  })
  const days = daysOf(value)
  const [views, setViews] = React.useState(() =>
    viewsForRange(days, viewMonths)
  )

  const limitDays = { min: min && datePart(min), max: max && datePart(max) }
  const bounds = listBounds({
    days: [days.from, days.to],
    ...limitDays,
    startMonth: calendarProps?.startMonth,
    endMonth: calendarProps?.endMonth,
  })
  const months = shownViews({ views, bounds, viewMonths })

  const [earlier = "", later = ""] = [from, to]
    .filter(Boolean)
    .map(datePart)
    .sort()
  const selected = { from: fromYmd(earlier), to: fromYmd(later) }
  const oneDay = earlier !== "" && earlier === later

  function changeAndShow(next: RangeValue) {
    onChange(next)
    setViews(viewsForRange(daysOf(next), viewMonths))
  }

  function leaveBox(event: React.FocusEvent) {
    if (leftBothBoxes(event, boxes) && isReversed(value)) {
      changeAndShow(orderRange(value, times))
    }
  }

  function endBox(end: RangeEnd) {
    return (
      <PickerField
        ref={boxes[end]}
        id={ids[end]}
        type={times ? "datetime-local" : "date"}
        label={labels[end]}
        placeholder={times ? labels.selectDateTime : labels.selectDate}
        value={ends[end]}
        onValueChange={(text) =>
          changeAndShow(putEnd({ range: value, end, text }))
        }
        min={min}
        max={max}
        step={step}
        className={times ? dateTimeBoxClassName : undefined}
        onBlur={leaveBox}
      >
        {times && (
          <ClockPopover
            label={labels.selectTimeFor(labels[end])}
            value={timePart(ends[end])}
            onValueChange={(time) =>
              onChange(
                putEnd({
                  range: value,
                  end,
                  text: joinDateTime(datePart(ends[end]), time),
                })
              )
            }
            disabled={ends[end] === ""}
            {...dayTimeLimits({ day: datePart(ends[end]), min, max, step })}
            step={step}
          />
        )}
      </PickerField>
    )
  }

  function endCalendar(end: RangeEnd) {
    return (
      <DayCalendar
        mode="range"
        rangeBand
        captionEnd={end}
        calendarProps={calendarProps}
        limits={limitDays}
        bounds={endBounds({ end, bounds, viewMonths })}
        className={times ? "[--cell-size:--spacing(9)]" : undefined}
        selected={selected}
        modifiers={{ oneDay: oneDay ? selected.from : undefined }}
        modifiersClassNames={{ oneDay: "after:hidden" }}
        month={months[end]}
        onMonthChange={(month) =>
          setViews({ ...views, [end]: month, moved: end })
        }
        onSelect={(picked) =>
          onChange(
            selectRange({
              range: value,
              picked,
              times,
              limits: { min, max, step },
            })
          )
        }
      />
    )
  }

  const presetRow = <PickerPresets presets={presets} onSelect={changeAndShow} />

  if (phoneDialog) {
    return (
      <div className="flex grow flex-col gap-2">
        <div className="data-[invalid=true]:text-destructive gap-2 grid grid-cols-[auto_1fr] items-center gap-y-2">
          {rangeEnds.map((end) => (
            <React.Fragment key={end}>
              <FieldLabel htmlFor={ids[end]}>{labels[end]}</FieldLabel>
              {endBox(end)}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {rangeEnds.map((end) => (
            <React.Fragment key={end}>{endCalendar(end)}</React.Fragment>
          ))}
        </div>
        {presetRow}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {rangeEnds.map((end) => (
          <div key={end} className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor={ids[end]}>{labels[end]}</FieldLabel>
              {endBox(end)}
            </Field>
            {endCalendar(end)}
          </div>
        ))}
      </div>
      {presetRow}
    </div>
  )
}

export { DayRangePicker }
