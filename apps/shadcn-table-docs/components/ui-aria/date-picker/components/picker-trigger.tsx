"use client"

import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui-aria/button"
import { ButtonGroup } from "@/components/ui-aria/button-group"
import type { HtmlProps, PopupOptions } from "../types"
import { LabelsContext } from "../utils/labels"
import { PickerPopup } from "./picker-popup"

type PickerTriggerProps = HtmlProps &
  PopupOptions & {
    label: string
    text: string
    placeholder: string
    onClear: () => void
    onClose: () => void
    disabled?: boolean
    children: React.ReactNode
  }

function PickerTrigger({
  label,
  text,
  placeholder,
  onClear,
  onClose,
  disabled,
  presentation,
  popoverProps,
  dialogProps,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  className,
  children,
  ...props
}: PickerTriggerProps) {
  const labels = React.useContext(LabelsContext)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const name = ariaLabel ?? label
  return (
    <ButtonGroup
      className={cn("[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!", className)}
      {...props}
    >
      <PickerPopup
        presentation={presentation}
        popoverProps={popoverProps}
        dialogProps={dialogProps}
        title={name}
        trigger={
          <Button
            ref={triggerRef}
            variant="outline"
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            render={(props) => <button {...props} aria-invalid={ariaInvalid} />}
            className="min-w-0 flex-1 justify-start px-2.5 font-normal"
          >
            <CalendarIcon data-icon="inline-start" />
            <span className="truncate">{text || placeholder}</span>
          </Button>
        }
        disabled={disabled}
        onClose={onClose}
      >
        {children}
      </PickerPopup>
      {text !== "" && !disabled && (
        <Button
          variant="outline"
          size="icon"
          aria-label={labels.clear(name)}
          onClick={() => {
            onClear()
            triggerRef.current?.focus()
          }}
        >
          <XIcon />
        </Button>
      )}
    </ButtonGroup>
  )
}

export { PickerTrigger }
