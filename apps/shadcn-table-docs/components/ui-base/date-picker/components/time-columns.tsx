"use client"

import * as React from "react"
import { Button } from "@/components/ui-base/button"
import type { ClockUnit, Limits } from "../types"
import { clockColumns } from "../utils/time"
import { LabelsContext } from "../utils/labels"

type TimeColumnsProps = Limits & {
  value: string
  onValueChange: (value: string) => void
  step?: number
}

type TimeColumnProps = {
  label: string
  units: ClockUnit[]
  texts: string[]
  onPick: (time: string) => void
}

const sixty = Array.from({ length: 60 }, (_, unit) =>
  String(unit).padStart(2, "0")
)

const hours24 = sixty.slice(0, 24)

const hours12 = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

function TimeColumn({ label, units, texts, onPick }: TimeColumnProps) {
  const selectedRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" })
  }, [])

  return (
    <div className="no-scrollbar max-h-56 min-w-18 overflow-y-auto">
      <div role="group" aria-label={label} className="flex flex-col gap-1 p-1">
        {units.map((unit) => (
          <Button
            key={unit.index}
            ref={unit.selected ? selectedRef : undefined}
            size="sm"
            variant={unit.selected ? "default" : "ghost"}
            aria-pressed={unit.selected}
            disabled={unit.disabled}
            className="font-normal tabular-nums"
            onClick={() => onPick(unit.time)}
          >
            {texts[unit.index]}
          </Button>
        ))}
      </div>
    </div>
  )
}

function TimeColumns({
  value,
  onValueChange,
  min,
  max,
  step = 60,
}: TimeColumnsProps) {
  const labels = React.useContext(LabelsContext)
  const { hour12 } = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).resolvedOptions()
  const clock = clockColumns({ value, min, max, step, hour12 })
  return (
    <div className="flex divide-x">
      <TimeColumn
        label={labels.hour}
        units={clock.hour}
        texts={hour12 ? hours12 : hours24}
        onPick={onValueChange}
      />
      <TimeColumn
        label={labels.minute}
        units={clock.minute}
        texts={sixty}
        onPick={onValueChange}
      />
      {clock.second && (
        <TimeColumn
          label={labels.second}
          units={clock.second}
          texts={sixty}
          onPick={onValueChange}
        />
      )}
      {clock.halfDay && (
        <TimeColumn
          label={labels.amPm}
          units={clock.halfDay}
          texts={[labels.am, labels.pm]}
          onPick={onValueChange}
        />
      )}
    </div>
  )
}

export { TimeColumns }
