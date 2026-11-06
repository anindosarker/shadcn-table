export type TaskStatus = 'Not Started' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskTag =
  | 'Frontend'
  | 'Backend'
  | 'Bug'
  | 'Feature'
  | 'Docs'
  | 'Infra';

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  assignee: string;
  project: string;
  due: string;
  estimate: number;
  priority: TaskPriority;
  tags: TaskTag[];
  reporter: string;
  team: string;
  sprint: string;
  created: string;
  updated: string;
  storyPoints: number;
  progress: number;
  prLink: string;
  archived: boolean;
  notes: string;
};

const statuses: TaskStatus[] = [
  'Not Started',
  'In Progress',
  'In Review',
  'Done',
];
const assignees = [
  'Ava Chen',
  'Ben Ortiz',
  'Chloe Park',
  'Dev Patel',
  'Elena Rossi',
  'Farid Khan',
];
const projects = ['Atlas', 'Beacon', 'Comet', 'Delta'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const tags: TaskTag[] = [
  'Frontend',
  'Backend',
  'Bug',
  'Feature',
  'Docs',
  'Infra',
];
const reporters = ['Grace Liu', 'Hugo Silva', 'Iris Novak', 'Jonas Berg'];
const teams = ['Platform', 'Growth', 'Payments', 'Mobile'];
const sprints = [
  'Sprint 41',
  'Sprint 42',
  'Sprint 43',
  'Sprint 44',
  'Sprint 45',
  'Sprint 46',
];
const verbs = [
  'Design',
  'Build',
  'Fix',
  'Review',
  'Refactor',
  'Document',
  'Test',
  'Ship',
];
const nouns = [
  'login flow',
  'billing page',
  'search index',
  'export job',
  'settings panel',
  'audit log',
  'onboarding',
  'rate limiter',
];
const notes = [
  'Waiting on design sign-off before the second pass on spacing and copy.',
  'Blocked by the staging migration; pick up again once the schema lands.',
  'Customer reported this twice last week, keep the scope small and ship.',
  'Pairs with the backend change, merge both in the same release window.',
];

const day = (offset: number) => {
  const d = new Date(Date.UTC(2026, 9, 1 + offset));
  return d.toISOString().slice(0, 10);
};

export const data: Task[] = Array.from({ length: 50 }, (_, i) => ({
  id: `task-${i + 1}`,
  name: `${verbs[i % verbs.length]} ${nouns[(i * 3) % nouns.length]}`,
  status: statuses[i % statuses.length],
  assignee: assignees[(i * 5) % assignees.length],
  project: projects[(i * 7) % projects.length],
  due: day((i * 11) % 60),
  estimate: ((i * 13) % 40) + 1,
  priority: priorities[(i * 3) % priorities.length],
  tags: [tags[i % tags.length], tags[(i + 2) % tags.length]],
  reporter: reporters[i % reporters.length],
  team: teams[(i * 3) % teams.length],
  sprint: sprints[i % sprints.length],
  created: day(-((i * 7) % 30)),
  updated: day((i * 5) % 20),
  storyPoints: [1, 2, 3, 5, 8, 13][i % 6],
  progress: (i * 17) % 101,
  prLink: `https://github.com/acme/app/pull/${1000 + i}`,
  archived: i % 9 === 0,
  notes: notes[i % notes.length],
}));
