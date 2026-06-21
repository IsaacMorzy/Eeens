This is a [TinaCMS](https://tina.io/) starter project.

Edit your site visually in the browser, ship it as fast static HTML.

## Getting started

Create the project:

```sh
pnpm dlx create-tina-app@latest --template tina-astro-starter
```

Install dependencies:

> [!NOTE]
> **[Which package manager is best for Node.js?](https://www.ssw.com.au/rules/best-package-manager-for-node)** The right one makes a real difference to your workflow. We recommend pnpm for its speed and efficient dependency handling — this SSW rule explains why.

```sh
pnpm install
```

Start the dev server, then edit visually at `localhost:4321/admin/`:

```sh
pnpm dev
```

![homepage](./public/home-page.png)

**Figure: Homepage UI**

## Features

- Visual editing via [`@tinacms/astro`](https://www.npmjs.com/package/@tinacms/astro) — a vanilla-JS bridge, with no React in the page tree
- Tailwind CSS v4 block builder: Hero, CTA, Features, Stats, Testimonial, Callout, Content, Split, and Video
- Light/dark theme toggle with a Tina-ember space theme
- Markdown and MDX with `<TinaMarkdown>` rich-text rendering
- Collections for Pages, Blog, and global Config
- Astro view transitions, SEO meta, OpenGraph, sitemap, and RSS
- Icons via [`astro-icon`](https://github.com/natemoo-re/astro-icon) and the Tabler set

## A note on React

`react` and `react-dom@^18.3.1` are pinned in `devDependencies` for the TinaCMS admin UI build only — the site itself ships zero React. Without the pin, pnpm resolves `react@19` against `react-dom@18` and the admin crashes on init. This is tracked in [tinacms#6985](https://github.com/tinacms/tinacms/issues/6985); remove the pin once that lands.

## Deploy to Vercel

`vercel.json` is committed at the repo root, pinning the build command to `pnpm build && pnpm build:search`. The first half builds the static site; the second half pushes the Tina Cloud search index so `/admin`'s search works in production. Without this pin, Vercel picks Astro's default `astro build` — the static adapter still runs, but **skips both** the Tina content build and the search-index sync, so the `/admin` route wouldn't deploy or be searchable.

**Option A — Git integration (recommended for the production site).**

1. Push this repo to GitHub.
2. In the Vercel dashboard, **Add New Project → Import** the repo.
3. Vercel auto-detects Astro. Leave **Framework Preset** as Astro and **Build Command** untouched — the committed `vercel.json` overrides it.
4. Add the Tina Cloud environment variables in *Project → Settings → Environment Variables* (Production + Preview). Names and meanings are documented in the next subsection.
5. Push to `main` and Vercel builds + deploys on every commit.

**Option B — Vercel CLI.**

```sh
pnpm dlx vercel@latest        # first run scopes the project + opens browser for auth
pnpm dlx vercel@latest --prod # promote the latest preview to production
```

The first run requires the three Tina Cloud env vars to be present, or `tinacms build` will fail its Cloud health check.

### Tina Cloud env vars

Three env vars must be set in **both** the Vercel project *and* your local `.env` (already gitignored):

| Var | Where it lives in the Tina dashboard | Scope |
|---|---|---|
| `PUBLIC_TINA_CLIENT_ID` | App → *Setup* | Always-public client identifier |
| `TINA_TOKEN` | App → *Tokens* → Content | **Read-only** in this repo's current setup. Saves from `/admin` will 403 until swapped for a `Read-and-write` token. |
| `TINA_SEARCH_TOKEN` | App → *Tokens* → Search | Search-index push, run by `tinacms build:search`. |

`pnpm build:local` (the offline fallback `tinacms build --local --skip-cloud-checks`) skips both creds and is no longer used; `vercel.json` invokes the full cloud path now.

### Search index sync

`pnpm build:search` (a second step chained in `vercel.json`) reads every collection via the GraphQL client and writes the index back to Tina Cloud. Without it, `/admin` search returns zero results in production even though the schema is wired. The chained command runs on every deploy; if it fails, the deploy still ships but search will be stale until the next deploy.

## Want to learn more?

Read the [TinaCMS documentation](https://tina.io/docs) and the [Astro documentation](https://docs.astro.build), or come and say hello in the [TinaCMS Discord server](https://discord.gg/cG2UNREu).
