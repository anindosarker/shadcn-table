"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui-base/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-base/dialog"
import { InputGroupAddon } from "@/components/ui-base/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui-base/popover"
import { useIsMobile } from "@/components/ui-base/hooks/use-mobile"
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
  align: "start",
} satisfies React.ComponentProps<typeof PopoverContent>

const boxPopover = {
  align: "end",
  alignOffset: -8,
  sideOffset: 10,
} satisfies React.ComponentProps<typeof PopoverContent>

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

  if (presentation === "dialog" || (presentation === "auto" && phone)) {
    const { open, defaultOpen, onOpenChange, className, ...contentProps } =
      dialogProps ?? {}
    const dialogTrigger = <DialogTrigger disabled={disabled} render={trigger} />
    return (
      <Dialog
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(nextOpen, details) => {
          if (!nextOpen) {
            onClose?.()
          }
          onOpenChange?.(nextOpen, details)
        }}
        actionsRef={popupActions}
      >
        {inBox ? (
          <InputGroupAddon align="inline-end">{dialogTrigger}</InputGroupAddon>
        ) : (
          dialogTrigger
        )}
        <DialogContent
          {...contentProps}
          showCloseButton={false}
          className={cn(
            "flex max-h-[calc(100dvh-2rem)] flex-col md:w-max md:max-w-[calc(100%-2rem)]",
            phone && "h-dvh max-h-none max-w-none rounded-none ring-0",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2"
                aria-label={labels.close}
              />
            }
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
            <DialogClose render={<Button className={cn(phone && "w-full")} />}>
              {labels.done}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const { open, defaultOpen, onOpenChange, className, ...contentProps } =
    popoverProps ?? {}
  const popoverTrigger = <PopoverTrigger disabled={disabled} render={trigger} />
  return (
    <Popover
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen) {
          onClose?.()
        }
        onOpenChange?.(nextOpen, details)
      }}
      actionsRef={popupActions}
    >
      {inBox ? (
        <InputGroupAddon align="inline-end">{popoverTrigger}</InputGroupAddon>
      ) : (
        popoverTrigger
      )}
      <PopoverContent
        aria-label={title}
        {...(inBox ? boxPopover : triggerPopover)}
        {...contentProps}
        className={cn(
          "max-h-(--available-height) w-auto overflow-y-auto",
          className
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export { PhoneDialogContext, PickerPopup }
