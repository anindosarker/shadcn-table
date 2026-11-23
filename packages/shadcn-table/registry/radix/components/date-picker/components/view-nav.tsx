import * as React from "react"
import { Calendar1Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LabelsContext } from "../utils/labels"

type NavArrowProps = {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}

type TodayButtonProps = {
  onClick: () => void
}

function NavArrow({ label, disabled, onClick, children }: NavArrowProps) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      aria-disabled={disabled}
      className="aria-disabled:opacity-50"
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Button>
  )
}

function TodayButton({ onClick }: TodayButtonProps) {
  const labels = React.useContext(LabelsContext)
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={labels.goToToday}
      title={labels.goToToday}
      onClick={onClick}
    >
      <Calendar1Icon />
    </Button>
  )
}

export { NavArrow, TodayButton }
