"use client"

import * as React from "react"
import { LabelsContext } from "../utils/labels"
import { PeriodView } from "../components/period-views"
import { PickerBox } from "../components/picker-box"
import { PickerPresets } from "../components/picker-presets"
import type {
  CalendarProps,
  ControlProps,
  Limits,
  PeriodType,
  PopupActions,
  PopupOptions,
  Preset,
} from "../types"
import { startOfPeriod } from "../utils/values"
import { clampView, periodBounds, periodViewStart } from "../utils/views"

type PeriodPickerProps = ControlProps<string> &
  PopupOptions & {
    type: PeriodType
    calendarProps?: CalendarProps
    presets?: Preset<string>[]
  }

type PeriodPanelProps = Limits & {
  type: PeriodType
  value: string
  onChange: (value: string) => void
  calendarProps?: CalendarProps
  presets?: Preset<string>[]
  onPicked: () => void
}

function PeriodPicker({
  type,
  value,
  onChange,
  min,
  max,
  calendarProps,
  presets,
  ...props
}: PeriodPickerProps) {
  const labels = React.useContext(LabelsContext)
  const popupActions = React.useRef<PopupActions>(null)
  const boxWords = {
    week: {
      label: labels.week,
      pickerLabel: labels.selectWeek,
    },
    month: {
      label: labels.month,
      pickerLabel: labels.selectMonth,
      placeholder: labels.selectMonth,
    },
    year: {
      label: labels.year,
      pickerLabel: labels.selectYear,
      placeholder: labels.yearPlaceholder,
    },
  }
  return (
    <PickerBox
      type={type}
      {...boxWords[type]}
      value={value}
      onValueChange={onChange}
      min={min}
      max={max}
      popupActions={popupActions}
      {...props}
    >
      <PeriodPanel
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        calendarProps={calendarProps}
        presets={presets}
        onPicked={() => popupActions.current?.close()}
      />
    </PickerBox>
  )
}

function PeriodPanel({
  type,
  value,
  onChange,
  min,
  max,
  calendarProps,
  presets,
  onPicked,
}: PeriodPanelProps) {
  const selected = startOfPeriod(type, value)
  const [view, setView] = React.useState(selected)
  const bounds = periodBounds({
    type,
    days: [selected],
    min,
    max,
    startMonth: calendarProps?.startMonth,
    endMonth: calendarProps?.endMonth,
  })
  return (
    <div className="flex flex-col gap-4">
      <PeriodView
        type={type}
        selected={[value]}
        view={clampView(periodViewStart(type, view ?? new Date()), bounds)}
        onViewChange={setView}
        bounds={bounds}
        limits={{ min, max }}
        calendarProps={calendarProps}
        onPick={(period) => {
          onChange(period)
          onPicked()
        }}
      />
      <PickerPresets
        presets={presets}
        onSelect={(next) => {
          onChange(next)
          setView(startOfPeriod(type, next))
        }}
      />
    </div>
  )
}

export { PeriodPicker }
