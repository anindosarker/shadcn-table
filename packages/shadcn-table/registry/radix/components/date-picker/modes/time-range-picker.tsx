import * as React from "react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LabelsContext } from "../utils/labels"
import { TimeField } from "../components/time-field"
import type { ControlProps, PopoverContentProps, RangeValue } from "../types"
import { putEnd, rangeEnds } from "../utils/range"

type TimeRangePickerProps = ControlProps<RangeValue> & {
  step?: number
  popoverProps?: PopoverContentProps
}

function TimeRangePicker({
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  popoverProps,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  ...props
}: TimeRangePickerProps) {
  const labels = React.useContext(LabelsContext)
  const ownId = React.useId()
  const fromId = id ?? ownId
  const ids = { from: fromId, to: `${fromId}-to` }
  const [from, to] = value
  const times = { from, to }
  return (
    <FieldGroup role="group" {...props}>
      {rangeEnds.map((end) => (
        <Field key={end}>
          <FieldLabel htmlFor={ids[end]}>{labels[end]}</FieldLabel>
          <TimeField
            id={ids[end]}
            label={labels[end]}
            pickerLabel={labels.selectTimeFor(labels[end])}
            value={times[end]}
            onValueChange={(time) =>
              onChange(putEnd({ range: value, end, text: time }))
            }
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            popoverProps={popoverProps}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedby}
          />
        </Field>
      ))}
    </FieldGroup>
  )
}

export { TimeRangePicker }
