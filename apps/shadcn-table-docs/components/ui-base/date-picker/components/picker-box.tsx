"use client"

import type * as React from "react"
import { CalendarIcon } from "lucide-react"
import { InputGroupButton } from "@/components/ui-base/input-group"
import type { PopupActions, PopupOptions } from "../types"
import { PickerField } from "./picker-field"
import { PickerPopup } from "./picker-popup"

type PickerBoxProps = Omit<
  React.ComponentProps<typeof PickerField>,
  "children"
> &
  PopupOptions & {
    pickerLabel: string
    popupActions?: React.RefObject<PopupActions | null>
    children: React.ReactNode
  }

function PickerBox({
  pickerLabel,
  popupActions,
  presentation,
  popoverProps,
  dialogProps,
  children,
  ...props
}: PickerBoxProps) {
  return (
    <PickerField {...props}>
      <PickerPopup
        inBox
        presentation={presentation}
        popoverProps={popoverProps}
        dialogProps={dialogProps}
        title={pickerLabel}
        trigger={
          <InputGroupButton size="icon-xs" aria-label={pickerLabel}>
            <CalendarIcon />
          </InputGroupButton>
        }
        disabled={props.disabled}
        popupActions={popupActions}
      >
        {children}
      </PickerPopup>
    </PickerField>
  )
}

export { PickerBox }
