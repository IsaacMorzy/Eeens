const LOCAL_SITE_URL = 'http://localhost:4321';

export function resolveSiteUrl(rawSiteUrl, production) {
	const value = rawSiteUrl?.trim();
	if (!value) {
		if (production) {
			throw new Error('SITE_URL is required for production builds');
		}
		return LOCAL_SITE_URL;
	}

	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error('SITE_URL must be an absolute URL');
	}

	if (url.username || url.password) {
		throw new Error('SITE_URL must not contain credentials');
	}
	if (production && url.protocol !== 'https:') {
		throw new Error('SITE_URL must use HTTPS in production');
	}
	if (url.pathname !== '/' || url.search || url.hash) {
		throw new Error('SITE_URL must be an origin without a path, query, or fragment');
	}

	return url.origin;
}
