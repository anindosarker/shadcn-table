# Setup for the date picker library (D162, D163)

Names: repository `shadcn-date-picker`, subdomain `date-picker.shadcn-table.com`.

## Done by the lead, 2026-11-24, with the owner's logged-in CLIs

- GitHub repository `anindosarker/shadcn-date-picker`: created, public, empty. https://github.com/anindosarker/shadcn-date-picker
- Vercel project `shadcn-date-picker` in the team `anindo-sarkers-projects`: created, connected to that repository. Framework, root directory and build settings are left at their defaults; the run sets them in the repository when the docs app exists.
- Domain `date-picker.shadcn-table.com`: assigned to the project `shadcn-date-picker`.

## Left for the owner: one DNS record

The DNS of `shadcn-table.com` is not on Vercel (name servers `aster.dns-parking.com`, `helios.dns-parking.com`), so the record is added at that provider, where the `storybook` record was added.

1. Open the DNS records of `shadcn-table.com` at the domain's provider.
2. Add a record:
   - Type: `CNAME`
   - Name: `date-picker`
   - Value: `7c01400999e33fe7.vercel-dns-017.com.`
   - TTL: the default.
3. Save.

Check: `dig +short CNAME date-picker.shadcn-table.com` prints `7c01400999e33fe7.vercel-dns-017.com.`; in the Vercel project, Settings, Domains shows "Valid configuration".

Not urgent: the site has nothing to show until the run pushes a docs page.

## Not needed from the owner

- No secrets, tokens or environment variables: the site has none at the start.
- No change to the `shadcn-table` project on Vercel or to its repository settings.
