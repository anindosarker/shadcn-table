'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui-radix/badge';
import { Button } from '@/components/ui-radix/button';
import { Input } from '@/components/ui-radix/input';
import { Label } from '@/components/ui-radix/label';
import { Progress } from '@/components/ui-radix/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-radix/select';
import { Switch } from '@/components/ui-radix/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-radix/tabs';
import { cn } from '@/lib/cn';

const ThemeTable = dynamic(
  () => import('@/components/theme-demo/theme-table'),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-[22rem] items-center justify-center text-sm text-muted-foreground"
      >
        Loading table
      </div>
    ),
  },
);

// weekly active members, drawn as the sparkline
const ACTIVE = [18, 21, 19, 24, 22, 26, 28];

/* The docs app installs no Card part, so this is stock shadcn/ui Card
 * markup: the same classes and slot names. */
function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-2 rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Logo({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
    >
      {name[0]}
    </span>
  );
}

/** A tiny line chart in --primary, scaled to its box. */
function Sparkline({ values }: { values: readonly number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * 100},${28 - ((v - min) / (max - min)) * 24}`,
    )
    .join(' ');
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="h-6 w-full overflow-visible text-primary"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Inside the frame: a whole members page built from stock shadcn/ui parts
 * (top bar, Tabs, KPI cards, a settings form) with the table among them. It
 * holds no theme; the ThemeScope around it repaints all of it at once. Its
 * layout follows the frame's width (container queries), so the card row
 * gives way before the table does.
 */
export function WholeAppSite({ name }: { name: string }) {
  return (
    <div className="@container flex min-w-0 flex-1 flex-col">
      <div className="flex h-12 items-center gap-2 border-b px-3 @lg:px-4">
        <span className="flex items-center gap-2 @lg:mr-2">
          <Logo name={name} />
          <span className="font-semibold">{name}</span>
        </span>
        <div className="relative hidden @lg:block">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search"
            placeholder="Search"
            className="h-8 w-52 pl-8"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm">Upgrade</Button>
          <span
            aria-label="Ada Brooks"
            role="img"
            className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground"
          >
            AB
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 p-3 @lg:p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="leading-tight">
            <h2 className="text-lg font-semibold">Members</h2>
            <p className="text-xs text-muted-foreground">
              People in your workspace
            </p>
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="invited">Invited</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-3 @xl:grid-cols-3">
          <Card>
            <p className="text-xs text-muted-foreground">Seats used</p>
            <p className="text-xl font-semibold tabular-nums">
              35 <span className="text-sm text-muted-foreground">/ 40</span>
            </p>
            <Progress value={87} aria-label="Seats used" />
          </Card>
          <Card>
            <p className="text-xs text-muted-foreground">Active this week</p>
            <p className="flex items-center gap-2 text-xl font-semibold tabular-nums">
              28
              <Badge variant="secondary">+12%</Badge>
            </p>
            <Sparkline values={ACTIVE} />
          </Card>
          <Card className="hidden @xl:flex">
            <p className="text-xs text-muted-foreground">Storage</p>
            <p className="text-xl font-semibold tabular-nums">
              62%{' '}
              <span className="text-sm text-muted-foreground">of 50 GB</span>
            </p>
            <Progress value={62} aria-label="Storage" />
          </Card>
        </div>

        <div className="min-w-0">
          <ThemeTable />
        </div>

        <Card className="gap-3">
          <div className="leading-tight">
            <h3 className="text-sm font-semibold">Invite settings</h3>
            <p className="text-xs text-muted-foreground">
              Applies to new members.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid items-end gap-3 @xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
          >
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="wa-domain" className="text-xs">
                Allowed domain
              </Label>
              <Input
                id="wa-domain"
                defaultValue="example.com"
                className="h-8"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wa-role" className="text-xs">
                Default role
              </Label>
              <Select defaultValue="editor">
                <SelectTrigger id="wa-role" className="w-full @xl:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex h-8 items-center gap-2">
              <Switch id="wa-email" defaultChecked />
              <Label htmlFor="wa-email" className="text-xs">
                Email invite
              </Label>
            </div>
            <Button type="submit" size="sm" variant="outline">
              Save
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
