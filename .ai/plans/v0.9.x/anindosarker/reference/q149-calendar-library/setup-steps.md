# Setup steps for the owner: the calendar library (D162)

Names: repository `shadcn-calendar`, subdomain `calendar.shadcn-table.com`.

Do step 1 now. Steps 2 and 3 can wait until the run has pushed the first code; doing them now is also fine.

## 1. GitHub repository

1. Open https://github.com/new.
2. Owner: `anindosarker` (the account that owns `shadcn-table`).
3. Repository name: `shadcn-calendar`.
4. Visibility: Public (the shadcn CLI installs by GitHub address only from a public repository).
5. Leave it empty: no README, no .gitignore, no license. The run pushes the first commit.
6. Click Create repository.

Check: `gh repo view anindosarker/shadcn-calendar` prints the repository.

## 2. Vercel project

1. Open https://vercel.com/new, in the team that holds the `shadcn-table` project.
2. Import the Git repository `anindosarker/shadcn-calendar`.
   - If it is not in the list: click "Adjust GitHub App Permissions" and give the Vercel app access to `shadcn-calendar`.
3. Project name: `shadcn-calendar`.
4. Leave framework, root directory and build settings as they are. The run sets them in the repository when the docs app exists.
5. Click Deploy. The first deploy of an empty repository may fail; that is expected.

Check: the project `shadcn-calendar` is in the Vercel dashboard.

## 3. Subdomain

1. In the Vercel project `shadcn-calendar`: Settings, Domains.
2. Add `calendar.shadcn-table.com`.
3. Vercel then shows one of two things:
   - "Valid configuration": the DNS of `shadcn-table.com` is on Vercel, nothing more to do.
   - A CNAME record to add: go to the DNS provider of `shadcn-table.com` and add the record exactly as shown (type CNAME, name `calendar`, the value Vercel gives).
4. Wait until the domain shows "Valid configuration".

Check: `dig +short calendar.shadcn-table.com` prints an address.

## 4. Tell the lead

Say "calendar setup done" and which steps you did. If you would rather have the run do step 2 and step 3 with the Vercel CLI on this machine, say so instead and skip them.

## Not needed from you

- No secrets, tokens or environment variables: the calendar site has none at the start.
- No change to the `shadcn-table` project on Vercel or to its repository settings.
