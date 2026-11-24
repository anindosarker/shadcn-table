"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui-aria/input-group"
import type { HtmlProps, Limits } from "../types"
import { startOfPeriod } from "../utils/values"
import { LabelsContext } from "../utils/labels"

type PickerFieldProps = Omit<HtmlProps, "role"> &
  Limits & {
    type: "date" | "datetime-local" | "time" | "week" | "month" | "year"
    value: string
    onValueChange: (value: string) => void
    label: string
    placeholder?: string
    disabled?: boolean
    step?: number
    required?: boolean
    children?: React.ReactNode
  }

type FieldType = PickerFieldProps["type"]

type Draft = {
  text: string
  value: string
  filled: boolean
}

const nativeInputs = {
  date: { stepBase: undefined, lastValue: "9999-12-31", pattern: undefined },
  "datetime-local": {
    stepBase: "0001-01-01T00:00",
    lastValue: "9999-12-31T23:59",
    pattern: undefined,
  },
  time: { stepBase: "00:00", lastValue: undefined, pattern: undefined },
  week: {
    stepBase: undefined,
    lastValue: "9999-W52",
    pattern: "(?!0000)[0-9]{4}-W[0-9]{2}",
  },
  month: {
    stepBase: undefined,
    lastValue: "9999-12",
    pattern: "[0-9]{4}-[0-9]{2}",
  },
}

const yearInput = {
  type: "text",
  inputMode: "numeric",
  maxLength: 4,
  pattern: "(?!0000)[0-9]{4}",
} satisfies React.ComponentProps<"input">

function isUnreal(type: FieldType, text: string) {
  return (
    (type === "week" || type === "month") &&
    text !== "" &&
    startOfPeriod(type, text) === undefined
  )
}

function PickerField({
  type,
  value,
  onValueChange,
  label,
  placeholder,
  disabled,
  min,
  max,
  step,
  required,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  children,
  ...props
}: PickerFieldProps) {
  const labels = React.useContext(LabelsContext)
  const [draft, setDraft] = React.useState<Draft | null>(null)
  const [resetKey, setResetKey] = React.useState(0)

  function read(input: HTMLInputElement): Draft {
    const text = input.value
    const typed =
      input.validity.patternMismatch || isUnreal(type, text) ? "" : text
    const refused = required && typed === ""
    return {
      text,
      value: refused ? value : typed,
      filled: text !== "" || input.validity.badInput,
    }
  }

  const held = draft?.value === value ? draft : null
  if (draft && !held) {
    setDraft(null)
  }
  const filled = held?.filled ?? false
  const clearable = !disabled && (value !== "" || filled)

  const inputProps =
    type === "year"
      ? { ...yearInput, placeholder }
      : {
          type,
          min: min ?? (step ? nativeInputs[type].stepBase : undefined),
          max: max ?? nativeInputs[type].lastValue,
          step,
          pattern: nativeInputs[type].pattern,
        }

  return (
    <InputGroup {...props}>
      <InputGroupInput
        key={resetKey}
        id={id}
        {...inputProps}
        value={held?.text ?? value}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel ?? (id || ariaLabelledby ? undefined : label)}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        className="peer appearance-none [&::-webkit-calendar-picker-indicator]:hidden supports-[-moz-appearance:none]:[&:is([type=date],[type=datetime-local],[type=time])]:-mr-[calc(min(16px,1em)+0.525em)] supports-[-moz-appearance:none]:[&:is([type=date],[type=datetime-local],[type=time])]:pr-0 supports-[-moz-appearance:none]:[&:is([type=date],[type=datetime-local],[type=time])]:[clip-path:inset(0_calc(min(16px,1em)+0.525em)_0_0)]"
        onChange={(event) => {
          const next = read(event.currentTarget)
          setDraft(next)
          onValueChange(next.value)
        }}
        onBlur={(event) => setDraft(read(event.currentTarget))}
      />
      {placeholder && type !== "year" && value === "" && !filled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 hidden max-w-full items-center ps-2.5 text-sm text-muted-foreground select-none peer-focus:hidden supports-[-webkit-touch-callout:none]:flex"
        >
          <span className="min-w-0 truncate">{placeholder}</span>
        </span>
      )}
      {!required && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={labels.clear(label)}
            className={clearable ? undefined : "not-focus:invisible"}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setDraft(null)
              setResetKey((key) => key + 1)
              onValueChange("")
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
      {children}
    </InputGroup>
  )
}

export { PickerField }
