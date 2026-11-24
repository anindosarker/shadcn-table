import * as React from "react"

type PickerLabels = typeof defaultLabels

const defaultLabels = {
  from: "From",
  to: "To",
  done: "Done",
  close: "Close",
  clear: (name: string) => `Clear ${name}`,
  goToToday: "Go to today",
  selectDate: "Select date",
  selectDateTime: "Select date and time",
  selectTime: "Select time",
  selectTimeFor: (end: string) => `Select time, ${end}`,
  emptyEnd: "...",
  rangeJoin: " - ",
  date: "Date",
  dateTime: "Date and time",
  time: "Time",
  dateRange: "Date range",
  dateTimeRange: "Date and time range",
  pickDateRange: "Pick a date",
  pickDateTimeRange: "Pick a date and time range",
  hour: "Hour",
  minute: "Minute",
  second: "Second",
  amPm: "AM or PM",
  am: "AM",
  pm: "PM",
  weekValue: (week: string, year: string) => `Week ${week}, ${year}`,
  week: "Week",
  month: "Month",
  year: "Year",
  yearPlaceholder: "yyyy",
  decade: (first: string, last: string) => `${first} – ${last}`,
  selectWeek: "Select week",
  selectMonth: "Select month",
  selectYear: "Select year",
  weekRange: "Week range",
  monthRange: "Month range",
  yearRange: "Year range",
  pickWeekRange: "Pick a week range",
  pickMonthRange: "Pick a month range",
  pickYearRange: "Pick a year range",
  previousYear: "Previous year",
  nextYear: "Next year",
  previousYears: "Previous years",
  nextYears: "Next years",
}

const LabelsContext = React.createContext(defaultLabels)

export { defaultLabels, LabelsContext, type PickerLabels }
