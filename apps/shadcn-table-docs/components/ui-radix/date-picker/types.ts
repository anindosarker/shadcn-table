import type * as React from "react"
import type { PropsBase } from "react-day-picker"
import type { Dialog, DialogContent } from "@/components/ui-radix/dialog"
import type { Popover, PopoverContent } from "@/components/ui-radix/popover"
import type { PickerLabels } from "./utils/labels"

type DatePickerType = "date" | "datetime" | "time" | "week" | "month" | "year"

type RangeValue = [from: string, to: string]

type Preset<Value> = { label: string; value: Value | (() => Value) }

type CalendarProps = Omit<
  PropsBase,
  | "mode"
  | "required"
  | "month"
  | "defaultMonth"
  | "onMonthChange"
  | "numberOfMonths"
  | "components"
  | "hideNavigation"
  | "navLayout"
  | "fixedWeeks"
  | "today"
  | "timeZone"
> & {
  fixedWeeks?: boolean | "blank"
}

type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverContent>,
  "children"
>

type PopoverProps = Pick<
  React.ComponentProps<typeof Popover>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  PopoverContentProps

type DialogProps = Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  Omit<
    React.ComponentProps<typeof DialogContent>,
    "children" | "showCloseButton"
  >

type PresentationProps =
  | {
      presentation?: "popover"
      popoverProps?: PopoverProps
      dialogProps?: never
    }
  | { presentation: "dialog"; popoverProps?: never; dialogProps?: DialogProps }
  | {
      presentation: "auto"
      popoverProps?: PopoverProps
      dialogProps?: DialogProps
    }

type One = {
  range?: false
  value: string
  onChange: (value: string) => void
}

type Two = {
  range: true
  value: RangeValue
  onChange: (value: RangeValue) => void
}

type WithPresets =
  | (One & { presets?: Preset<string>[] })
  | (Two & { presets?: Preset<RangeValue>[] })

type DateProps = PresentationProps &
  WithPresets & { type: "date"; step?: never; calendarProps?: CalendarProps }

type DateTimeProps = PresentationProps &
  WithPresets & {
    type: "datetime"
    step?: number
    calendarProps?: CalendarProps
  }

type TimeProps = { type: "time"; step?: number; presets?: never } & (
  | (One & { popoverProps?: PopoverProps })
  | (Two & { popoverProps?: PopoverContentProps })
)

type WeekProps = PresentationProps &
  WithPresets & {
    type: "week"
    step?: never
    calendarProps?: Omit<CalendarProps, "showWeekNumber" | "ISOWeek">
  }

type MonthYearProps = PresentationProps &
  WithPresets & {
    type: "month" | "year"
    step?: never
    calendarProps?: Pick<CalendarProps, "locale" | "startMonth" | "endMonth">
  }

type TypedPickerProps = HtmlProps &
  Limits & {
    disabled?: boolean
  } & (DateProps | DateTimeProps | TimeProps | WeekProps | MonthYearProps)

type DatePickerProps = TypedPickerProps & {
  labels?: Partial<PickerLabels>
}

type HtmlProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
>

type Limits = { min?: string; max?: string }

type ControlProps<Value> = HtmlProps &
  Limits & {
    value: Value
    onChange: (value: Value) => void
    disabled?: boolean
  }

type PeriodType = "week" | "month" | "year"

type RangeEnd = "from" | "to"

type RangeTimes = Record<RangeEnd, string>

type ClockUnit = {
  index: number
  selected: boolean
  disabled: boolean
  time: string
}

type ListBounds = { start: Date; end: Date }

type PopupOptions = {
  presentation?: "popover" | "dialog" | "auto"
  popoverProps?: PopoverProps
  dialogProps?: DialogProps
}

type PopupActions = { close: () => void }

export type {
  CalendarProps,
  ClockUnit,
  ControlProps,
  DatePickerProps,
  DatePickerType,
  DialogProps,
  HtmlProps,
  Limits,
  ListBounds,
  PeriodType,
  PickerLabels,
  PopoverContentProps,
  PopoverProps,
  PopupActions,
  PopupOptions,
  Preset,
  RangeEnd,
  RangeTimes,
  RangeValue,
  TypedPickerProps,
}
