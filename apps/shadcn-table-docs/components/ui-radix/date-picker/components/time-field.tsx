"use client"

import * as React from "react"
import { Clock2Icon } from "lucide-react"
import { cn } from "cn"
import { InputGroupButton } from "@/components/ui-radix/input-group"
import type { PopoverProps } from "../types"
import { PickerField } from "./picker-field"
import { PickerPopup } from "./picker-popup"
import { TimeColumns } from "./time-columns"

type TimeFieldProps = Omit<
  React.ComponentProps<typeof PickerField>,
  "type" | "children"
> & {
  pickerLabel: string
  popoverProps?: PopoverProps
}

type ClockPopoverProps = React.ComponentProps<typeof TimeColumns> & {
  label: string
  disabled?: boolean
  popoverProps?: PopoverProps
}

function TimeField({ pickerLabel, popoverProps, ...props }: TimeFieldProps) {
  return (
    <PickerField type="time" {...props}>
      <ClockPopover
        label={pickerLabel}
        value={props.value}
        onValueChange={props.onValueChange}
        disabled={props.disabled}
        min={props.min}
        max={props.max}
        step={props.step}
        popoverProps={popoverProps}
      />
    </PickerField>
  )
}

function ClockPopover({
  label,
  disabled,
  popoverProps,
  ...clock
}: ClockPopoverProps) {
  const popupRef = React.useRef<HTMLDivElement>(null)
  return (
    <PickerPopup
      inBox
      popoverProps={{
        onOpenAutoFocus: (event) => {
          event.preventDefault()
          popupRef.current?.focus()
        },
        ...popoverProps,
        ref: popupRef,
        className: cn("p-0", popoverProps?.className),
      }}
      title={label}
      trigger={
        <InputGroupButton size="icon-xs" aria-label={label}>
          <Clock2Icon />
        </InputGroupButton>
      }
      disabled={disabled}
    >
      <TimeColumns {...clock} />
    </PickerPopup>
  )
}

export { ClockPopover, TimeField }
