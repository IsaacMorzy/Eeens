/**
 * TypeScript re-export of the canonical audit-guard logic at
 * `scripts/lib/audit-guard.mjs`. The .mjs is the single source of
 * truth (Node ESM imports it natively; vitest loads it via Vite;
 * TypeScript reads its JSDoc for typed signatures via the
 * `astro/tsconfigs/strict` preset which enables `allowJs`).
 *
 * Vitest consumes via `from './audit-guard'`; the runtime CLI
 * consumes via `import { ... } from './lib/audit-guard.mjs'`.
 * Both sites point at the same file — drift is structurally
 * impossible.
 */
export {
	DEFAULT_WINDOW_DAYS,
	resolveWindow,
	validateWindow,
	daysBetween,
	decideGuardAction,
} from '../../scripts/lib/audit-guard.mjs';

// Re-derive the typedefs JSDoc on the lib module so consumers see
// typed signatures through TypeScript's allowJs passthrough.
export type WindowResolution =
	| { ok: true; value: number; source: 'cli' | 'env' | 'default' }
	| { ok: false; message: string };

export type CounterSnapshot = {
	lastResult: string | null;
	lastRunAt: string | null;
};

export type GuardDecision =
	| { kind: 'pass'; message: string }
	| { kind: 'fail'; message: string };
