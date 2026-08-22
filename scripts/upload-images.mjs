#!/usr/bin/env node
/**
 * upload-images.mjs — upload every image under public/ to Cloudinary,
 * preserving the folder structure as the delivery path.
 *
 * Credentials are read from process.env or the gitignored `.env`:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * The delivery URL for `public/photography/pexels-photo-19920921.jpeg`
 * becomes: https://res.cloudinary.com/<cloud>/image/upload/photography/pexels-photo-19920921
 *
 * Re-runnable: images are overwritten in place (overwrite=true).
 *
 * Usage:
 *   node scripts/upload-images.mjs            # upload everything
 *   node scripts/upload-images.mjs --dry-run  # list only
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, extname, basename, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.ico']);
const DRY_RUN = process.argv.includes('--dry-run');

function loadEnv() {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name === 'admin') continue; // Tina editor build output
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function upload(filePath, { cloudName, apiKey, apiSecret, publicDir }) {
  const rel = relative(publicDir, filePath);
  const folder = dirname(rel) === '.' ? '' : dirname(rel);
  const ext = extname(basename(rel)).toLowerCase();
  const publicId = basename(rel).slice(0, -ext.length);
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const uploadParams = { overwrite: 'true', unique_filename: 'false' };
  if (folder) uploadParams.folder = folder;
  uploadParams.public_id = publicId;

  // Signed upload: sign every parameter (except `file`) plus `api_key` and
  // `timestamp`, sorted alphabetically, then append the API secret.
  const toSign = { ...uploadParams, timestamp };
  const stringToSign = Object.keys(toSign).sort()
    .map((key) => `${key}=${toSign[key]}`)
    .join('&') + apiSecret;
  const signature = createHash('sha1').update(stringToSign).digest('hex');

  const form = new FormData();
  for (const [key, value] of Object.entries(uploadParams)) form.append(key, value);
  form.append('timestamp', timestamp);
  form.append('api_key', apiKey);
  form.append('signature', signature);
  form.append('file', new Blob([readFileSync(filePath)]), basename(rel));

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(url, { method: 'POST', body: form });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(`${rel}: ${json?.error?.message ?? JSON.stringify(json)}`);
  }
  return { rel, public_id: json.public_id, secure_url: json.secure_url, bytes: json.bytes };
}

loadEnv();
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET');
  process.exit(1);
}

const publicDir = join(process.cwd(), 'public');
const files = walk(publicDir);
console.log(`Found ${files.length} image files under public/ (${DRY_RUN ? 'dry run' : 'uploading'})`);

let failures = 0;
for (const file of files) {
  const rel = relative(publicDir, file);
  if (DRY_RUN) {
    console.log(`  ${rel}`);
    continue;
  }
  try {
    const result = await upload(file, { cloudName, apiKey, apiSecret, publicDir });
    console.log(`  OK  ${result.public_id}  (${result.bytes} B)`);
  } catch (error) {
    failures += 1;
    console.error(`  ERR ${error.message}`);
  }
}

if (!DRY_RUN) {
  console.log(failures === 0 ? 'All images uploaded.' : `${failures} upload(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}
