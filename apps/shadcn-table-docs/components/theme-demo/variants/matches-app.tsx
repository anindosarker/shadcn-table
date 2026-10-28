'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui-radix/badge';
import { Button } from '@/components/ui-radix/button';
import { Input } from '@/components/ui-radix/input';
import { Progress } from '@/components/ui-radix/progress';

const ThemeTable = dynamic(() => import('../theme-table'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex min-h-[22rem] items-center justify-center text-sm text-muted-foreground"
    >
      Loading table
    </div>
  ),
});

/* The docs app installs no Card part, so this is stock shadcn/ui Card
 * markup: the same classes and slot names. */
function Card({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="card"
      className={`flex flex-col gap-2 rounded-xl border bg-card p-4 text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A small "existing app" built from stock shadcn/ui parts (Input, Button,
 * Badge, Progress, Card) with the table under them. It holds no theme; the
 * ThemeScope around it repaints all of it at once.
 */
export function ExistingApp() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
          >
            A
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Acme</p>
            <p className="text-xs text-muted-foreground">Team members</p>
          </div>
          <Badge variant="secondary">Pro</Badge>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Input
            type="search"
            placeholder="Search"
            aria-label="Search members"
            className="sm:w-56"
          />
          <Button type="button">Upgrade</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-muted-foreground">Seats used</p>
          <p className="text-2xl font-semibold tabular-nums">
            35 <span className="text-base text-muted-foreground">/ 40</span>
          </p>
          <Progress value={87} aria-label="Seats used" />
        </Card>
        <Card className="hidden sm:flex">
          <p className="text-xs text-muted-foreground">Monthly spend</p>
          <p className="flex items-center gap-2 text-2xl font-semibold tabular-nums">
            $1,240
            <Badge variant="outline">+12%</Badge>
          </p>
          <p className="text-xs text-muted-foreground">vs last month</p>
        </Card>
        <Card className="hidden sm:flex">
          <p className="text-xs text-muted-foreground">Pending invites</p>
          <p className="text-2xl font-semibold tabular-nums">2</p>
          <p className="text-xs text-muted-foreground">Sent this week</p>
        </Card>
      </div>

      <div className="min-w-0">
        <ThemeTable />
      </div>
    </div>
  );
}
