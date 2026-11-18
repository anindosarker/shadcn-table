# 66: Code panels show the table's code, Storybook Code tab, tracker

Status: running
Branch `v0.9/storybook-code-tab`, worktree 08
Checks:
- Check: Code tab read on 0.9.5 (P11), `pnpm --filter shadcn-table storybook:build:base` at detached origin/master da4f513f, then `pnpm test storybook-static --base base --url <served build> --ids 0:215|215:430|430:700` (test at 88aaec58): fail as required, 645 of 645 ids fail (0 pass; 3 slices, 456 s, 452 s, 444 s), `basic--basic` shows its story object with its play (quoted under Notes)

- Task 1: done, 88aaec58
- Task 2: planned
- Task 3: planned
- Task 4: planned
- Task 5: planned

## Attention

## Notes

- `basic--basic` on 0.9.5, the whole Code tab text:

```
{
  render: () => <BasicExample />,
  play: async ({
    canvasElement
  }: StoryContext) => {
    await within(canvasElement).findByText('Rolluffs');
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(addresses.length);
    rows.forEach((row, index) => {
      const entry = addresses[index]!;
      expect([...row.querySelectorAll('td')].map(cell => (cell.textContent ?? '').trim())).toEqual([entry.name.firstName, entry.name.lastName, entry.address, entry.city, entry.state]);
    });
  }
}
```
