import {
  ArchiveIcon, CalendarIcon, CalendarPlusIcon, CircleIcon, ClockIcon, CopyIcon, FlagIcon, FolderIcon,
  HashIcon, LinkIcon, PencilSimpleIcon, PercentIcon, RepeatIcon, NoteIcon, TagIcon, TrashIcon, TextTIcon,
  UserIcon, UserGearIcon, UsersIcon, ClockCounterClockwiseIcon,
} from "@phosphor-icons/react"

export const gateIcons = {
  name: TextTIcon, status: CircleIcon, assignee: UserIcon, project: FolderIcon, due: CalendarIcon,
  estimate: ClockIcon, priority: FlagIcon, tags: TagIcon, reporter: UserGearIcon, team: UsersIcon,
  sprint: RepeatIcon, created: CalendarPlusIcon, updated: ClockCounterClockwiseIcon, storyPoints: HashIcon,
  progress: PercentIcon, prLink: LinkIcon, archived: ArchiveIcon, notes: NoteIcon,
  edit: PencilSimpleIcon, copy: CopyIcon, remove: TrashIcon,
}
