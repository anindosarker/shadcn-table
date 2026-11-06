"use client"

import { useEffect, useMemo } from "react"
import {
  ShadcnTable,
  ST_ActionMenuItem,
  useShadcnTable,
  type ST_ColumnDef,
} from "@/components/ui/shadcn-table"
import { gateIcons as I } from "./gate-icons"
import { data, type Task } from "./make-data"

export function GateTable({
  persist = false,
  rtl = false,
}: {
  persist?: boolean
  rtl?: boolean
}) {
  const columns = useMemo<ST_ColumnDef<Task>[]>(
    () => [
      { accessorKey: "name", header: "Name", icon: I.name, enableColumnOrdering: false, size: 260 },
      { accessorKey: "status", header: "Status", icon: I.status },
      { accessorKey: "assignee", header: "Assignee", icon: I.assignee },
      { accessorKey: "project", header: "Project", icon: I.project },
      { accessorKey: "due", header: "Due", icon: I.due, enableColumnOrdering: false },
      { accessorKey: "estimate", header: "Estimate", icon: I.estimate },
      { accessorKey: "priority", header: "Priority", icon: I.priority },
      { accessorFn: (row) => row.tags.join(", "), id: "tags", header: "Tags", icon: I.tags },
      { accessorKey: "reporter", header: "Reporter", icon: I.reporter },
      { accessorKey: "team", header: "Team", icon: I.team },
      { accessorKey: "sprint", header: "Sprint", icon: I.sprint },
      { accessorKey: "created", header: "Created", icon: I.created },
      { accessorKey: "updated", header: "Updated", icon: I.updated },
      { accessorKey: "storyPoints", header: "Story points", icon: I.storyPoints },
      { accessorKey: "progress", header: "Progress", icon: I.progress },
      { accessorKey: "prLink", header: "PR link", icon: I.prLink },
      { accessorFn: (row) => (row.archived ? "Yes" : "No"), id: "archived", header: "Archived", icon: I.archived },
      { accessorKey: "notes", header: "Notes", icon: I.notes },
    ],
    [],
  )

  const table = useShadcnTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => [
      <ST_ActionMenuItem icon={<I.edit />} key="edit" label="Edit" onClick={() => void row.id} />,
      <ST_ActionMenuItem icon={<I.copy />} key="duplicate" label="Duplicate" onClick={() => void row.id} />,
      <ST_ActionMenuItem icon={<I.remove />} key="delete" label="Delete" onClick={() => void row.id} />,
    ],
    ...(persist ? { persistViewSettings: true, id: "release-gate-persisted" } : {}),
    ...(rtl
      ? {
          columnResizeDirection: "rtl" as const,
          enableColumnResizing: true,
          enableColumnPinning: true,
          initialState: { columnPinning: { start: ["name"], end: ["st-row-actions"] } },
        }
      : {}),
  })

  useEffect(() => {
    ;(window as unknown as { __gateTable: unknown }).__gateTable = table
  }, [table])

  return <ShadcnTable table={table} />
}
