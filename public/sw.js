const CACHE_NAME = 'eens-pwa-v2';
const STATIC_ASSETS = [
	'/',
	'/shops',
	'/warehouses',
	'/business-parks/eens',
	'/contact',
	'/manifest.webmanifest',
	'/pwa-192.png',
	'/pwa-512.png',
];
const OFFLINE_HTML = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fafaf9"><title>Eens Business Park | Offline</title><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:15vh auto;padding:1.5rem;color:#0f172a;background:#fafaf9"><p style="color:#0e7490;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Eens Business Park</p><h1>Connection unavailable.</h1><p>Previously visited listings remain available when cached. Reconnect to load the latest address, area, price, availability, and terms.</p><a href="/" style="color:#0e7490">Return to the register</a></body></html>';

const isExcluded = (url, request) =>
	request.method !== 'GET' ||
	url.origin !== self.location.origin ||
	url.pathname === '/admin' ||
	url.pathname.startsWith('/admin/') ||
	url.pathname.startsWith('/api/') ||
	url.pathname.startsWith('/.tina/');

const cacheResponse = (request, response) => {
	if (!response.ok || response.type !== 'basic') return response;
	return caches.open(CACHE_NAME).then((cache) => {
		cache.put(request, response.clone()).catch(() => undefined);
		return response;
	});
};

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => Promise.all(STATIC_ASSETS.map((asset) => cache.add(asset).catch(() => undefined))))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((key) => key.startsWith('eens-pwa-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (isExcluded(url, request)) return;

	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => cacheResponse(request, response))
				.catch(() => caches.match(request).then((cached) => cached ?? new Response(OFFLINE_HTML, {
					status: 503,
					statusText: 'Offline',
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				}))),
		);
		return;
	}

	const staticRequest = ['style', 'script', 'image', 'font'].includes(request.destination);
	if (!staticRequest) return;

	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) return cached;
			return fetch(request)
				.then((response) => cacheResponse(request, response))
				.catch(() => new Response('', { status: 503, statusText: 'Offline' }));
		}),
	);
});
