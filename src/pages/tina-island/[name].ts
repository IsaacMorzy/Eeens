import type { APIRoute } from 'astro';

export const prerender = true;

export function getStaticPaths() {
	return [];
}

export const ALL: APIRoute = () =>
	new Response('Not Found', { status: 404 });
