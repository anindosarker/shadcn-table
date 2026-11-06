import {
  ArchiveIcon, CalendarIcon, CalendarPlusIcon, CircleDotIcon, ClockIcon, CopyIcon, FlagIcon, FolderIcon,
  HashIcon, LinkIcon, PencilIcon, PercentIcon, RepeatIcon, StickyNoteIcon, TagIcon, Trash2Icon, TypeIcon,
  UserIcon, UserPenIcon, UsersIcon, HistoryIcon,
} from "lucide-react"

export const gateIcons = {
  name: TypeIcon, status: CircleDotIcon, assignee: UserIcon, project: FolderIcon, due: CalendarIcon,
  estimate: ClockIcon, priority: FlagIcon, tags: TagIcon, reporter: UserPenIcon, team: UsersIcon,
  sprint: RepeatIcon, created: CalendarPlusIcon, updated: HistoryIcon, storyPoints: HashIcon,
  progress: PercentIcon, prLink: LinkIcon, archived: ArchiveIcon, notes: StickyNoteIcon,
  edit: PencilIcon, copy: CopyIcon, remove: Trash2Icon,
}
