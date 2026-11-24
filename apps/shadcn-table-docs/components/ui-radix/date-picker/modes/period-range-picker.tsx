"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/components/ui-radix/field"
import { LabelsContext } from "../utils/labels"
import { PeriodView } from "../components/period-views"
import { PickerField } from "../components/picker-field"
import { PickerPresets } from "../components/picker-presets"
import { PickerTrigger } from "../components/picker-trigger"
import type {
  CalendarProps,
  ControlProps,
  Limits,
  PeriodType,
  PopupOptions,
  Preset,
  RangeValue,
} from "../types"
import {
  formatRange,
  isReversed,
  leftBothBoxes,
  orderRange,
  pickRange,
  putEnd,
  rangeEnds,
} from "../utils/range"
import { dateLibFor, formatPeriod, startOfPeriod } from "../utils/values"
import {
  endBounds,
  periodBounds,
  periodViewMonths,
  periodViewStart,
  shownViews,
  viewsForRange,
} from "../utils/views"

type PeriodRangePickerProps = ControlProps<RangeValue> &
  PopupOptions & {
    type: PeriodType
    calendarProps?: CalendarProps
    presets?: Preset<RangeValue>[]
  }

type PeriodRangePanelProps = Limits & {
  type: PeriodType
  value: RangeValue
  onChange: (value: RangeValue) => void
  calendarProps?: CalendarProps
  presets?: Preset<RangeValue>[]
}

function PeriodRangePicker({
  type,
  value,
  onChange,
  min,
  max,
  calendarProps,
  presets,
  ...props
}: PeriodRangePickerProps) {
  const labels = React.useContext(LabelsContext)
  const lib = dateLibFor(calendarProps?.locale)
  const names = {
    week: labels.weekRange,
    month: labels.monthRange,
    year: labels.yearRange,
  }
  const placeholders = {
    week: labels.pickWeekRange,
    month: labels.pickMonthRange,
    year: labels.pickYearRange,
  }
  return (
    <PickerTrigger
      label={names[type]}
      text={formatRange({
        range: value,
        formatEnd: (end) =>
          formatPeriod({
            type,
            value: end,
            weekValue: labels.weekValue,
            lib,
          }),
        emptyEnd: labels.emptyEnd,
        rangeJoin: labels.rangeJoin,
      })}
      placeholder={placeholders[type]}
      onClear={() => onChange(["", ""])}
      onClose={() => onChange(orderRange(value))}
      {...props}
    >
      <PeriodRangePanel
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        calendarProps={calendarProps}
        presets={presets}
      />
    </PickerTrigger>
  )
}

function PeriodRangePanel({
  type,
  value,
  onChange,
  min,
  max,
  calendarProps,
  presets,
}: PeriodRangePanelProps) {
  const labels = React.useContext(LabelsContext)
  const id = React.useId()
  const ids = { from: `${id}-from`, to: `${id}-to` }
  const boxPlaceholders = {
    week: undefined,
    month: labels.selectMonth,
    year: labels.yearPlaceholder,
  }
  const boxes = {
    from: React.useRef<HTMLDivElement>(null),
    to: React.useRef<HTMLDivElement>(null),
  }
  const [from, to] = value
  const ends = { from, to }
  const viewMonths = periodViewMonths[type]
  const daysOf = ([first, second]: RangeValue) => ({
    from: startOfPeriod(type, first),
    to: startOfPeriod(type, second),
  })
  const days = daysOf(value)
  const [views, setViews] = React.useState(() =>
    viewsForRange(days, viewMonths)
  )

  const bounds = periodBounds({
    type,
    days: [days.from, days.to],
    min,
    max,
    startMonth: calendarProps?.startMonth,
    endMonth: calendarProps?.endMonth,
  })
  const shown = shownViews({
    views: {
      from: periodViewStart(type, views.from),
      to: periodViewStart(type, views.to),
      moved: views.moved,
    },
    bounds,
    viewMonths,
  })

  function changeAndShow(next: RangeValue) {
    onChange(next)
    setViews(viewsForRange(daysOf(next), viewMonths))
  }

  function leaveBox(event: React.FocusEvent) {
    if (leftBothBoxes(event, boxes) && isReversed(value)) {
      changeAndShow(orderRange(value))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {rangeEnds.map((end) => (
          <div key={end} className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor={ids[end]}>{labels[end]}</FieldLabel>
              <PickerField
                ref={boxes[end]}
                id={ids[end]}
                type={type}
                label={labels[end]}
                placeholder={boxPlaceholders[type]}
                value={ends[end]}
                onValueChange={(text) =>
                  changeAndShow(putEnd({ range: value, end, text }))
                }
                min={min}
                max={max}
                onBlur={leaveBox}
              />
            </Field>
            <PeriodView
              type={type}
              rangeBand
              selected={value}
              view={shown[end]}
              onViewChange={(view) =>
                setViews({ ...views, [end]: view, moved: end })
              }
              bounds={endBounds({ end, bounds, viewMonths })}
              limits={{ min, max }}
              calendarProps={calendarProps}
              onPick={(period) => onChange(pickRange(value, period))}
            />
          </div>
        ))}
      </div>
      <PickerPresets presets={presets} onSelect={changeAndShow} />
    </div>
  )
}

export { PeriodRangePicker }
