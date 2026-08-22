/**
 * Cloudinary delivery URLs for the site's published imagery.
 *
 * Local `public/` assets are uploaded to Cloudinary by
 * `scripts/upload-images.mjs` with a folder structure that mirrors their
 * local path, so `/photography/x.jpeg` maps to
 * `.../image/upload/photography/x`.
 *
 * Tina Cloud rewrites CMS image `src` values to its own CDN
 * (`assets.tina.io`); the path after the client UUID mirrors the local
 * `public/` path, so it maps to the same Cloudinary public_id. Unrelated
 * remote URLs pass through unchanged.
 */
export const CLOUDINARY_CLOUD_NAME = 'threads-collection';

const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const TINA_ASSET_RE = /^https:\/\/assets\.tina\.io\/[a-f0-9-]+\/(.+)$/;

const resolvePublicId = (src: string | null | undefined): string | null => {
	if (!src || src.startsWith('data:')) return null;
	if (src.startsWith('/')) return src.replace(/^\//, '');
	const match = TINA_ASSET_RE.exec(src);
	return match ? match[1] : null;
};

const stripExtension = (path: string): string => {
	const dot = path.lastIndexOf('.');
	return dot > 0 ? path.slice(0, dot) : path;
};

export const cloudinaryUrl = (
	src: string | null | undefined,
	transforms = 'f_auto,q_auto',
): string | null => {
	if (!src) return null;
	const publicId = resolvePublicId(src);
	if (!publicId) return src; // unrelated remote URL — pass through
	return `${CLOUDINARY_BASE}/${transforms}/${stripExtension(publicId)}`;
};

/**
 * Responsive `srcset` for Cloudinary-mapped images. Returns `null` for
 * unrelated remote URLs (no width variants available), so the `<img>`
 * falls back to the plain `src`.
 */
export const cloudinarySrcSet = (
	src: string | null | undefined,
	widths: readonly number[],
): string | null => {
	const publicId = resolvePublicId(src);
	if (!publicId) return null;
	const pid = stripExtension(publicId);
	return widths
		.map((width) => `${CLOUDINARY_BASE}/f_auto,q_auto,w_${width}/${pid} ${width}w`)
		.join(', ');
};
