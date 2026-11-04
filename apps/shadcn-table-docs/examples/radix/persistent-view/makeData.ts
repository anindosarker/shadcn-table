export type Task = {
  archived: boolean;
  assignee: string;
  created: string;
  due: string;
  estimate: number;
  id: string;
  name: string;
  notes: string;
  priority: string;
  /** Percent, 0 to 100 */
  progress: number;
  prLink: string;
  project: string;
  reporter: string;
  sprint: string;
  status: string;
  storyPoints: number;
  tags: string[];
  team: string;
  updated: string;
};

export const statuses = ['Not Started', 'In Progress', 'In Review', 'Done'];
export const assignees = [
  'Ava Chen',
  'Ben Ortiz',
  'Chloe Park',
  'Dev Patel',
  'Elena Rossi',
  'Farid Khan',
];
export const projects = ['Atlas', 'Beacon', 'Comet', 'Delta'];
export const priorities = ['Low', 'Medium', 'High', 'Urgent'];
export const tags = ['Frontend', 'Backend', 'Bug', 'Feature', 'Docs', 'Infra'];
export const reporters = [
  'Grace Liu',
  'Hugo Silva',
  'Iris Novak',
  'Jonas Berg',
];
export const teams = ['Platform', 'Growth', 'Payments', 'Mobile'];
export const sprints = [
  'Sprint 41',
  'Sprint 42',
  'Sprint 43',
  'Sprint 44',
  'Sprint 45',
  'Sprint 46',
];
const notes = [
  'Waiting on design sign-off before the second pass on spacing and copy.',
  'Blocked by the staging migration; pick up again once the schema lands.',
  'Customer reported this twice last week, keep the scope small and ship.',
  'Pairs with the backend change, merge both in the same release window.',
  'Needs a follow-up ticket for the edge cases found during review.',
  'Low risk, mostly copy and layout changes behind the existing flag.',
];
const verbs = [
  'Design',
  'Build',
  'Review',
  'Refactor',
  'Test',
  'Document',
  'Ship',
  'Plan',
];
const nouns = [
  'onboarding flow',
  'billing page',
  'search index',
  'auth service',
  'settings panel',
  'export job',
  'dashboard charts',
  'notification center',
  'audit log',
  'API rate limits',
];

// A seeded generator, so every render shows the same rows.
const makeRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const random = makeRandom(42);
const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)];
const day = 86_400_000;
const start = Date.UTC(2026, 10, 1);
const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10);

export const data: Task[] = Array.from({ length: 50 }, (_, index) => {
  const due = isoDate(start + Math.floor(random() * 90) * day);
  const created = Date.UTC(2026, 8, 1) + Math.floor(random() * 50) * day;
  const updated = created + Math.floor(random() * 30) * day;
  const name = `${pick(verbs)} ${pick(nouns)}`;
  const status = pick(statuses);
  const assignee = pick(assignees);
  const project = pick(projects);
  const estimate = 1 + Math.floor(random() * 40);
  const priority = pick(priorities);
  const tagCount = 1 + Math.floor(random() * 3);
  const picked = new Set<string>();
  while (picked.size < tagCount) picked.add(pick(tags));
  const task = {
    assignee,
    created: isoDate(created),
    due,
    estimate,
    id: `task-${index + 1}`,
    name,
    priority,
    project,
    reporter: pick(reporters),
    status,
    tags: tags.filter((tag) => picked.has(tag)),
    team: pick(teams),
    sprint: pick(sprints),
    updated: isoDate(updated),
    storyPoints: pick([1, 2, 3, 5, 8, 13]),
  };
  const progress = Math.floor(random() * 21) * 5;
  const prLink = `https://github.com/acme/app/pull/${1200 + index * 7}`;
  const archived = random() < 0.2;
  return { ...task, progress, prLink, archived, notes: pick(notes) };
});
