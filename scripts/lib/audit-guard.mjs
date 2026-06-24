/**
 * audit-guard — pure decision logic, canonical source for both
 * `scripts/audit-guard.mjs` (Node CLI) and `src/lib/audit-guard.ts`
 * (typed re-export consumed by vitest).
 *
 * Why this file exists. Node ESM can import .mjs natively; vitest
 * can load .mjs via Vite's loader; and JSDoc here gives TypeScript
 * consumers (astro check, vitest) typed signatures without us
 * needing a separate .d.mts companion. So `scripts/lib/audit-guard.mjs`
 * IS the source of truth, and the two consuming sites are both
 * thin adapters — drift class is structurally impossible rather
 * than discipline-required.
 *
 * Exports:
 *   - DEFAULT_WINDOW_DAYS: number
 *   - resolveWindow(args, envValue, defaultValue): WindowResolution
 *   - validateWindow(value, source): { ok, value? } | { ok: false, message }
 *   - daysBetween(isoDate, todayIso): number (NaN-safe)
 *   - decideGuardAction(counter, windowDays, todayIso?): { kind, message }
 *
 * No fs/path/cwd imports — keep this file pure. `scripts/audit-guard.mjs`
 * owns the I/O + process.exit side effects; this file owns the math.
 */

/** Default window in days when neither CLI nor env overrides are supplied. */
export const DEFAULT_WINDOW_DAYS = 7;

/**
 * @typedef {{ ok: true; value: number; source: 'cli' | 'env' | 'default' }
 *          | { ok: false; message: string }} WindowResolution
 * @typedef {{ lastResult: string | null; lastRunAt: string | null }} CounterSnapshot
 * @typedef {{ kind: 'pass'; message: string }
 *          | { kind: 'fail'; message: string }} GuardDecision
 */

/**
 * Parse + validate one window candidate value.
 * Non-negative-integer contract; `null`/`undefined`/empty string
 * fall through to the next resolution tier (caller's job).
 *
 * @param {unknown} value
 * @param {'cli'|'env'} source
 * @returns {{ ok: true; value: number } | { ok: false; message: string }}
 */
export function validateWindow(value, source) {
	if (value === null || value === undefined || value === '') {
		return { ok: false, message: 'unset' };
	}
	const n = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(n) || n < 0) {
		const label = source === 'cli' ? '--window' : 'AUDIT_RECENCY_DAYS';
		return {
			ok: false,
			message: `${label}="${String(value)}" is not a non-negative integer.`,
		};
	}
	return { ok: true, value: n };
}

/**
 * Resolve the recency window per the documented precedence:
 * CLI `--window N` wins, then `AUDIT_RECENCY_DAYS` env, then default.
 * Returns either an integer window with its source, or a validation
 * error message describing the first invalid tier.
 *
 * @param {readonly string[]} args
 * @param {string | undefined} envValue
 * @param {number} [defaultValue=DEFAULT_WINDOW_DAYS]
 * @returns {WindowResolution}
 */
export function resolveWindow(args, envValue, defaultValue = DEFAULT_WINDOW_DAYS) {
	const winIdx = args.indexOf('--window');
	if (winIdx !== -1) {
		const raw = args[winIdx + 1];
		const result = validateWindow(raw, 'cli');
		if (!result.ok) return result;
		return { ok: true, value: result.value, source: 'cli' };
	}
	if (envValue !== undefined && envValue !== '') {
		const result = validateWindow(envValue, 'env');
		if (!result.ok) return result;
		return { ok: true, value: result.value, source: 'env' };
	}
	return { ok: true, value: defaultValue, source: 'default' };
}

/** Days between two ISO date strings (YYYY-MM-DD). Rounded to whole days. */
export function daysBetween(isoDate, todayIso) {
	return Math.round((new Date(todayIso).getTime() - new Date(isoDate).getTime()) / 86400000);
}

/**
 * Pure decision: given the counter snapshot + window, return either
 * 'pass' or 'fail' with the user-facing log line for the build pipeline.
 *
 * @param {CounterSnapshot} counter
 * @param {number} windowDays
 * @param {string} [todayIso] — Optional ISO date for testability.
 *   Defaults to today via `new Date().toISOString().slice(0, 10)`.
 * @returns {GuardDecision}
 */
export function decideGuardAction(counter, windowDays, todayIso) {
	const today = todayIso ?? new Date().toISOString().slice(0, 10);
	if (counter.lastResult !== 'red') {
		return {
			kind: 'pass',
			message: `audit:guard OK — lastResult="${counter.lastResult ?? 'none'}", window=${windowDays}d, build NOT blocked.`,
		};
	}
	if (!counter.lastRunAt) {
		// Unreachable in practice (cycle() always sets lastRunAt before
		// lastResult), but kept as a safety net for hand-edited counters.
		return {
			kind: 'pass',
			message: 'audit:guard OK — lastResult=red but no recorded run date; cannot evaluate recency (PASS).',
		};
	}
	const raw = daysBetween(counter.lastRunAt, today);
	// Treat unparseable dates as FAIL — NaN <= N evaluates to FALSE in
	// JS, which would silently PASS a build that should be blocked.
	if (!Number.isFinite(raw)) {
		return {
			kind: 'fail',
			message: `audit:guard FAIL — lastRunAt="${counter.lastRunAt}" is not a valid date; counter file is corrupted. Re-run \`pnpm run audit:cycle\` to repair.`,
		};
	}
	if (raw <= windowDays) {
		return {
			kind: 'fail',
			message: `audit:guard FAIL — lastResult=red on ${counter.lastRunAt} (${raw}d ago, within the ${windowDays}-day guard window). Re-run \`pnpm run audit:cycle\` to verify green BEFORE building.`,
		};
	}
	return {
		kind: 'pass',
		message: `audit:guard OK — lastResult=red but ${raw}d ago EXCEEDS the ${windowDays}-day guard window.`,
	};
}
