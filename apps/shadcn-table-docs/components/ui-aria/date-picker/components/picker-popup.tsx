"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { ButtonContext } from "react-aria-components"
import { cn } from "cn"
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-aria/dialog"
import { InputGroupAddon } from "@/components/ui-aria/input-group"
import { Popover, PopoverTrigger } from "@/components/ui-aria/popover"
import { useIsMobile } from "@/components/ui-aria/hooks/use-mobile"
import type { PopupActions, PopupOptions } from "../types"
import { LabelsContext } from "../utils/labels"

type PickerPopupProps = PopupOptions & {
  title: string
  trigger: React.ReactElement
  disabled?: boolean
  inBox?: boolean
  popupActions?: React.RefObject<PopupActions | null>
  onClose?: () => void
  children: React.ReactNode
}

const triggerPopover = {
  placement: "bottom start",
} satisfies React.ComponentProps<typeof Popover>

const boxPopover = {
  placement: "bottom end",
  crossOffset: 8,
  offset: 10,
} satisfies React.ComponentProps<typeof Popover>

const PhoneDialogContext = React.createContext(false)

function PickerPopup({
  presentation = "popover",
  popoverProps,
  dialogProps,
  title,
  trigger,
  disabled,
  inBox,
  popupActions,
  onClose,
  children,
}: PickerPopupProps) {
  const labels = React.useContext(LabelsContext)
  const phone = useIsMobile()
  const dialog = presentation === "dialog" || (presentation === "auto" && phone)
  const [ownOpen, setOwnOpen] = React.useState<{
    dialog: boolean
    open: boolean
  }>()
  if (ownOpen && ownOpen.dialog !== dialog) {
    setOwnOpen(undefined)
  }
  function setOpen(nextOpen: boolean): void {
    setOwnOpen({ dialog, open: nextOpen })
    if (!nextOpen) {
      onClose?.()
    }
  }
  React.useImperativeHandle(popupActions, () => ({
    close: () => {
      setOpen(false)
      ;(dialog ? dialogProps : popoverProps)?.onOpenChange?.(false)
    },
  }))

  if (dialog) {
    const { isOpen, defaultOpen, onOpenChange, className, ...contentProps } =
      dialogProps ?? {}
    const dialogTrigger = (
      <ButtonContext.Provider value={{ isDisabled: disabled }}>
        {trigger}
      </ButtonContext.Provider>
    )
    return (
      <DialogTrigger
        isOpen={isOpen ?? ownOpen?.open ?? defaultOpen ?? false}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
      >
        {inBox ? (
          <InputGroupAddon align="inline-end">{dialogTrigger}</InputGroupAddon>
        ) : (
          dialogTrigger
        )}
        <Dialog
          {...contentProps}
          showCloseButton={false}
          className={cn(
            "flex max-h-[calc(100dvh-2rem)] flex-col *:data-[slot=dialog]:min-h-0 *:data-[slot=dialog]:grow *:data-[slot=dialog]:flex-col md:w-max md:max-w-[calc(100%-2rem)]",
            phone && "h-dvh max-h-none max-w-none rounded-none ring-0",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogClose
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            aria-label={labels.close}
          >
            <XIcon />
          </DialogClose>
          <PhoneDialogContext value={phone}>
            <div
              className={cn(
                "flex min-h-0 grow flex-col items-center overflow-y-auto",
                phone && "-m-1 items-stretch p-1"
              )}
            >
              {children}
            </div>
          </PhoneDialogContext>
          <DialogFooter className={cn(phone && "rounded-none")}>
            <DialogClose variant="default" className={cn(phone && "w-full")}>
              {labels.done}
            </DialogClose>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
    )
  }

  const { isOpen, defaultOpen, onOpenChange, className, ...contentProps } =
    popoverProps ?? {}
  const popoverTrigger = (
    <ButtonContext.Provider value={{ isDisabled: disabled }}>
      {trigger}
    </ButtonContext.Provider>
  )
  return (
    <PopoverTrigger
      isOpen={isOpen ?? ownOpen?.open ?? defaultOpen ?? false}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        onOpenChange?.(nextOpen)
      }}
    >
      {inBox ? (
        <InputGroupAddon align="inline-end">{popoverTrigger}</InputGroupAddon>
      ) : (
        popoverTrigger
      )}
      <Popover
        aria-label={title}
        {...(inBox ? boxPopover : triggerPopover)}
        {...contentProps}
        className={cn("w-auto overflow-y-auto", className)}
      >
        {children}
      </Popover>
    </PopoverTrigger>
  )
}

export { PhoneDialogContext, PickerPopup }
