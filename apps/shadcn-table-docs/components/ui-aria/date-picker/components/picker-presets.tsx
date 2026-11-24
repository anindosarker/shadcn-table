"use client"

import { Button } from "@/components/ui-aria/button"
import type { Preset } from "../types"

type PickerPresetsProps<Value> = {
  presets?: Preset<Value>[]
  onSelect: (value: Value) => void
}

function PickerPresets<Value>({
  presets,
  onSelect,
}: PickerPresetsProps<Value>) {
  if (!presets?.length) {
    return null
  }
  return (
    <div className="flex w-0 min-w-full flex-wrap gap-2 border-t pt-4">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() =>
            onSelect(
              preset.value instanceof Function ? preset.value() : preset.value
            )
          }
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}

export { PickerPresets }
