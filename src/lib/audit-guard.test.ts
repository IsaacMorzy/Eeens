import { describe, it, expect } from 'vitest';
import {
	resolveWindow,
	validateWindow,
	daysBetween,
	decideGuardAction,
	DEFAULT_WINDOW_DAYS,
} from './audit-guard';

const TODAY = '2026-06-24';

describe('resolveWindow -- precedence (CLI > env > default)', () => {
	it('returns CLI value when --window is supplied', () => {
		const r = resolveWindow(['--window', '14'], '3', 7);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toBe(14);
			expect(r.source).toBe('cli');
		}
	});

	it('falls back to env when CLI is absent', () => {
		const r = resolveWindow([], '3', 7);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toBe(3);
			expect(r.source).toBe('env');
		}
	});

	it('falls back to default when both CLI and env are absent', () => {
		const r = resolveWindow([], undefined, 7);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toBe(7);
			expect(r.source).toBe('default');
			expect(r.value).toBe(DEFAULT_WINDOW_DAYS);
		}
	});

	it('treats empty env string as absent', () => {
		const r = resolveWindow([], '', 7);
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.source).toBe('default');
	});

	it('returns unset when --window is supplied without a value', () => {
		// CLI invocation `node audit-guard.mjs --window` (no arg). The
		// runtime prints "is empty/unset." and exits 1. resolveWindow
		// surfaces this as `{ ok: false, message: 'unset' }` so the
		// runtime can decide how to format it.
		const r = resolveWindow(['--window'], undefined, 7);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.message).toBe('unset');
	});
});

describe('validateWindow -- input-validation tiers', () => {
	it('accepts non-negative integers', () => {
		expect(validateWindow(0, 'env')).toEqual({ ok: true, value: 0 });
		expect(validateWindow('7', 'cli')).toEqual({ ok: true, value: 7 });
		expect(validateWindow('14', 'env')).toEqual({ ok: true, value: 14 });
	});

	it('rejects negative integers with the right source label', () => {
		const r = validateWindow('-1', 'cli');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.message).toMatch(/"-1"/);
	});

	it('rejects non-integers (decimal, NaN, garbage)', () => {
		expect(validateWindow('0.5', 'env').ok).toBe(false);
		expect(validateWindow(Number.NaN, 'env').ok).toBe(false);
		expect(validateWindow('fourteen', 'cli').ok).toBe(false);
	});

	it('treats empty/null/undefined as unset (caller falls through)', () => {
		expect(validateWindow('', 'env')).toEqual({ ok: false, message: 'unset' });
		expect(validateWindow(null, 'cli')).toEqual({ ok: false, message: 'unset' });
		expect(validateWindow(undefined, 'env')).toEqual({ ok: false, message: 'unset' });
	});
});

describe('decideGuardAction -- four-state truth table', () => {
	it('PASS when lastResult is green (recent or stale, green is green)', () => {
		const d = decideGuardAction({ lastResult: 'green', lastRunAt: TODAY }, 7, TODAY);
		expect(d.kind).toBe('pass');
		if (d.kind === 'pass') expect(d.message).toMatch(/window=7d/);
	});

	it('window=0 PASS path: green survives regardless of window size', () => {
		const d = decideGuardAction({ lastResult: 'green', lastRunAt: TODAY }, 0, TODAY);
		expect(d.kind).toBe('pass');
		if (d.kind === 'pass') expect(d.message).toMatch(/window=0d/);
	});

	it('PASS on first run with no counter (lastResult null)', () => {
		const d = decideGuardAction({ lastResult: null, lastRunAt: null }, 7, TODAY);
		expect(d.kind).toBe('pass');
	});

	it('FAIL when lastResult is red and within the window (today)', () => {
		const d = decideGuardAction({ lastResult: 'red', lastRunAt: TODAY }, 7, TODAY);
		expect(d.kind).toBe('fail');
		if (d.kind === 'fail') expect(d.message).toMatch(/within the \d+-day guard window\)/);
	});

	it('FAIL when lastResult is red and 3 days ago, window=7', () => {
		const d = decideGuardAction({ lastResult: 'red', lastRunAt: '2026-06-21' }, 7, TODAY);
		expect(d.kind).toBe('fail');
	});

	it('PASS when lastResult is red and EXCEEDS the window (8 days ago, window=7)', () => {
		const d = decideGuardAction({ lastResult: 'red', lastRunAt: '2026-06-16' }, 7, TODAY);
		expect(d.kind).toBe('pass');
		if (d.kind === 'pass') expect(d.message).toMatch(/EXCEEDS/);
	});

	it('window=0 blocks ONLY when red is today (1<=0 false)', () => {
		const today = decideGuardAction({ lastResult: 'red', lastRunAt: TODAY }, 0, TODAY);
		expect(today.kind).toBe('fail');
		const yesterday = decideGuardAction({ lastResult: 'red', lastRunAt: '2026-06-23' }, 0, TODAY);
		expect(yesterday.kind).toBe('pass');
	});

	it('FAIL on unparseable lastRunAt date (NaN guard)', () => {
		const d = decideGuardAction({ lastResult: 'red', lastRunAt: 'not-a-date' }, 7, TODAY);
		expect(d.kind).toBe('fail');
		if (d.kind === 'fail') expect(d.message).toMatch(/not a valid date/);
	});

	it('PASS on red with no lastRunAt (safety net for hand-edited counter)', () => {
		const d = decideGuardAction({ lastResult: 'red', lastRunAt: null }, 7, TODAY);
		expect(d.kind).toBe('pass');
	});
});

describe('daysBetween -- date math', () => {
	it('returns 0 for same day', () => {
		expect(daysBetween(TODAY, TODAY)).toBe(0);
	});

	it('returns positive N for past date', () => {
		expect(daysBetween('2026-06-17', TODAY)).toBe(7);
		expect(daysBetween('2026-06-14', TODAY)).toBe(10);
	});

	it('returns negative N for future date', () => {
		expect(daysBetween('2026-06-25', TODAY)).toBe(-1);
	});

	it('returns NaN for unparseable input', () => {
		expect(Number.isNaN(daysBetween('not-a-date', TODAY))).toBe(true);
	});
});
