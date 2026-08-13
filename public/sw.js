const CACHE_NAME = 'eens-pwa-v1';
const OFFLINE_HTML = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Eens Limited | Offline</title><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:15vh auto;padding:1.5rem;color:#0f172a;background:#fafaf9"><p style="color:#0e7490;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Eens Limited</p><h1>You are offline.</h1><p>Previously visited Eens pages will be available when cached. Reconnect to load the latest listings.</p></body></html>';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('eens-pwa-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname === '/admin' || url.pathname.startsWith('/admin/') || url.pathname.startsWith('/api/') || url.pathname.startsWith('/.tina/')) return;
	event.respondWith(
		fetch(request)
			.then((response) => {
				if (response.ok && response.type === 'basic') {
					caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone())).catch(() => undefined);
				}
				return response;
			})
			.catch(() => caches.match(request).then((cached) => {
				if (cached) return cached;
				if (request.mode === 'navigate') return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503, statusText: 'Offline' });
				return new Response('', { status: 503, statusText: 'Offline' });
			})),
	);
});
