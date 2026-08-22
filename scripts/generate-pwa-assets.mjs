#!/usr/bin/env node
/**
 * generate-pwa-assets.mjs — derive the PWA icon set from the Eens glyph.
 *
 * Produces:
 *   - pwa-maskable-512.png   maskable icon (glyph inside the 80% safe zone)
 *   - apple-touch-icon.png   180×180 iOS home-screen icon
 *   - splash-<WxH>.png       iOS launch images (navy canvas + centered glyph)
 *
 * Uses `sharp`, which is already a project dependency.
 */
import sharp from 'sharp';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
const NAVY = { r: 15, g: 23, b: 42, alpha: 1 }; // #0F172A

const glyph = async (size) =>
	sharp(join(publicDir, 'eens-glyph.svg')).resize(size, size).png().toBuffer();

async function composite({ width, height, glyphSize, out }) {
	const input = await glyph(glyphSize);
	const left = Math.round((width - glyphSize) / 2);
	const top = Math.round((height - glyphSize) / 2);
	await sharp({ create: { width, height, channels: 4, background: NAVY } })
		.composite([{ input, left, top }])
		.png()
		.toFile(join(publicDir, out));
	console.log(`wrote ${out} (${width}×${height})`);
}

// Maskable icon: glyph scaled to ~62% so it survives the safe-zone mask.
await composite({ width: 512, height: 512, glyphSize: 317, out: 'pwa-maskable-512.png' });

// iOS home-screen icon: full-bleed (iOS applies its own rounding).
await composite({ width: 180, height: 180, glyphSize: 180, out: 'apple-touch-icon.png' });

// iOS launch images for the most common devices (portrait).
await composite({ width: 1290, height: 2796, glyphSize: 220, out: 'splash-1290x2796.png' });
await composite({ width: 1170, height: 2532, glyphSize: 200, out: 'splash-1170x2532.png' });
await composite({ width: 750, height: 1334, glyphSize: 160, out: 'splash-750x1334.png' });
await composite({ width: 2048, height: 2732, glyphSize: 320, out: 'splash-2048x2732.png' });

console.log('PWA assets generated.');
