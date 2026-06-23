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
- Icons via `src/components/ui/Icon.astro` (a thin local wrapper around [`astro-icon`](https://github.com/natemoo-re/astro-icon) + the Tabler set). All page-level icons route through this wrapper — import it instead of `astro-icon/components` directly so prefix handling and sizing stay consistent.

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

`vercel.json` invokes `pnpm build && pnpm build:search` against TinaCloud with `PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN` + `TINA_SEARCH_TOKEN` set; this is the production build path and the deployments you see on Vercel come off this path. `pnpm build:local` (`tinacms build --local --skip-cloud-checks`) is the dev-box fallback that keeps a local datalayer-server alive on port 9106 to answer the data-fetch queries when the Tina Cloud env contract isn't satisfied — `--local` only steers where mutations land, not where reads go, so without `TINA_TOKEN` set on a host without a local datalayer the cloud path surfaces a TinaCloud 400 at Astro prerender. See `plan.md` §28.3 for the full dev-box-vs-cloud distinction.

### Search index sync

`pnpm build:search` reads every collection via the GraphQL client and writes the index back to Tina Cloud. Without it, `/admin` search returns zero results in production even though the schema is wired. The command is chained after `pnpm build` in `vercel.json`, and the chain is **soft-failed**: if the Tina Cloud search write errors out (5xx, network blip, token rotation), the static site still deploys and a warning is logged in the Vercel build output. Run `pnpm build:search` manually later to backfill the index.

### Upgrading TINA_TOKEN from read-only to read-and-write

The token currently wired into this repo (from app.tina.io → *Tokens*) is `Content` / `Read-only`. The live editor loads in production, but **saving** changes from `/admin` returns `403 Forbidden` until you swap it:

1. app.tina.io → *Tokens* → select branch → *Generate token* with scope **Read and write** for the Content token type.
2. Replace `TINA_TOKEN` in your local `.env` (chmod 600, gitignored) and in Vercel → *Project → Settings → Environment Variables* (Production + Preview).
3. Push to `main` to redeploy. `/admin` saves now succeed.

Keep `TINA_SEARCH_TOKEN` separate regardless — Tina Cloud's two token types have distinct scopes; merging them is not supported.

## Want to learn more?

Read the [TinaCMS documentation](https://tina.io/docs) and the [Astro documentation](https://docs.astro.build), or come and say hello in the [TinaCMS Discord server](https://discord.gg/cG2UNREu).
