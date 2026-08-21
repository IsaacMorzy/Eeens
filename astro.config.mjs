// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolveSiteUrl } from './scripts/site-url.mjs';

const isVercelBuild = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
const isAstroBuild = process.argv.includes('build');
// Only a real production deploy requires SITE_URL. Vercel previews (and local
// dev servers) fall back to the localhost origin instead of failing the build.
const isProductionBuild =
	process.env.VERCEL_ENV === 'production' || (!isVercelBuild && isAstroBuild);
const outputDirectory = isVercelBuild
	? './dist/'
	: '../eens_app/public/astro_pages';

// https://astro.build/config
export default defineConfig({
	// Every product supplies its own public origin. Eens production sets
	// SITE_URL=https://vmi3416692.tailc65d30.ts.net:10000; other products use
	// their own Funnel port/origin so metadata never points at Eens by default.
	site: resolveSiteUrl(process.env.SITE_URL, isProductionBuild),
	output: 'static',
	adapter: vercel(),
	// Astro 7.2: this site has no session state, so keep the session runtime
	// out of adapter output and reuse unchanged prerendered pages.
	session: false,
	// Vercel must keep output inside its checkout; its filesystem uses a
	// different device for the external Frappe path. Local builds continue
	// writing to the canonical path consumed by deploy.sh.
	outDir: outputDirectory,
	redirects: { '/home': '/' },
	integrations: [mdx(), sitemap(), icon(), tina()],
	build: {
		// Inline the (~10 KiB) bundled CSS into a <style> in <head> instead of a
		// separate render-blocking <link>. Astro's default ('auto') only inlines
		// stylesheets under ~4 KiB, leaving ours blocking first paint on mobile.
		inlineStylesheets: 'always',
	},
	// Tina Cloud rewrites CMS image src to assets.tina.io; let Astro
	// fetch those URLs at build time so <Image> can transcode + resize them.
	image: {
		// Responsive images: auto-emit srcset so the browser picks a
		// variant matched to the rendered box + DPR, not the full intrinsic size.
		layout: 'constrained',
		remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
	},
	vite: {
		plugins: [tailwindcss(), tinaAdminDevRedirect()],
		// Bundle @tinacms/astro into the SSR build instead of resolving it
		// per-module on every cold request — otherwise each
		// `import TinaMarkdown from '@tinacms/astro/TinaMarkdown.astro'`
		// triggers a full Vite resolve + Astro-plugin compile of the
		// package's source `.astro` files on the first request.
		ssr: {
			noExternal: ['@tinacms/astro', '@tinacms/bridge'],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
						warning.exporter === 'tinacms/dist/client') {
						return;
					}
					warn(warning);
				}
			}
		}
	}
});
