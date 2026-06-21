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

A `vercel.json` is committed at the repo root, pinning the build command to `pnpm build:local`. Without this pin, Vercel picks Astro’s default `astro build` — the static adapter still runs, but it **skips the Tina content build**, so the `/admin` route wouldn’t deploy. **Update this file once you wire up Tina Cloud** to use `pnpm build` instead; see *Adding Tina Cloud editor support* below.

**Option A — Git integration (recommended for the production site).**

1. Push this repo to GitHub.
2. In the Vercel dashboard, **Add New Project → Import** the repo.
3. Vercel auto-detects Astro. Leave **Framework Preset** as Astro and **Build Command** untouched — the committed `vercel.json` overrides it.
4. Add whichever environment variables you have to *Project → Settings → Environment Variables*. The minimum for a static frontend is `SITE_URL` (your production origin). Leave Tina Cloud vars blank until you complete the steps in *Adding Tina Cloud editor support*. `GITHUB_BRANCH` is only needed if you pin a non-`main` content branch.
5. Push to `main` and Vercel builds + deploys on every commit.

**Option B — Vercel CLI.**

```sh
pnpm dlx vercel@latest        # first run scopes the project + opens browser for auth
pnpm dlx vercel@latest --prod # promote the latest preview to production
```

`pnpm build:local` (pinned in `vercel.json`) calls `tinacms build --local --skip-cloud-checks` then `astro build`, so the deploy succeeds without Tina Cloud credentials.

### Adding Tina Cloud editor support

When you’re ready for the live editor in production — do all three steps together, in this order:

1. Create the project at [app.tina.io](https://app.tina.io/) and connect this GitHub repo.
2. Copy `PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` from the Tina dashboard into Vercel env vars *and* into your local `.env`.
3. Edit `vercel.json` and change `buildCommand` from `"pnpm build:local"` to `"pnpm build"`. Commit. Next deploy runs the full Tina Cloud build with live editor.

## Want to learn more?

Read the [TinaCMS documentation](https://tina.io/docs) and the [Astro documentation](https://docs.astro.build), or come and say hello in the [TinaCMS Discord server](https://discord.gg/cG2UNREu).
