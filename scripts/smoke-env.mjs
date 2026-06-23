#!/usr/bin/env node
// Pre-build env preflight for CI.
//
// `tinacms build` reads PUBLIC_TINA_CLIENT_ID / TINA_TOKEN /
// TINA_SEARCH_TOKEN at config-evaluation time. Without this guard, a
// missing var surfaces as a downstream opaque failure (e.g. a ZodError
// on the generated client, or a runtime 403 on /admin). This script
// fails fast with a clear list of what's missing.
//
// Wired in two places:
//   1. `prebuild` npm hook in package.json — so `pnpm build` runs it
//      automatically (Vercel's buildCommand invokes `pnpm build`).
//   2. Standalone `pnpm run smoke:env` — for local ad-hoc checks.
//
// On the Vercel project, the three required vars are configured under
// Settings → Environment Variables for Production + Preview +
// Development. README's "Deploy to Vercel" section documents them.

const required = [
  'PUBLIC_TINA_CLIENT_ID',
  'TINA_TOKEN',
  'TINA_SEARCH_TOKEN',
];

const missing = required.filter(
  (k) => !process.env[k] || process.env[k].trim() === '',
);

if (missing.length > 0) {
  console.error('env-smoke: FAIL');
  console.error('Missing required TinaCMS environment variables:');
  for (const k of missing) console.error(`  - ${k}`);
  console.error(
    'Set them in the Vercel project settings (Production + Preview + Development) before re-deploying.',
  );
  process.exit(1);
}

console.log(`env-smoke: ${required.length} TinaCMS env vars present ✓`);
