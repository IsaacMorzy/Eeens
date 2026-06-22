import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
	it('returns a single class string untouched', () => {
		expect(cn('foo')).toBe('foo');
	});

	it('concatenates two class strings with a space', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('drops falsy conditional values', () => {
		expect(cn('foo', false && 'bar', null, undefined, '', 'baz')).toBe('foo baz');
	});

	it('expands an object syntax (clsx)', () => {
		expect(cn('base', { active: true, disabled: false })).toBe('base active');
	});

	it('expands an array syntax (clsx)', () => {
		expect(cn(['foo', { active: true }])).toBe('foo active');
	});

	it('resolves conflicting tailwind utilities to the last one (twMerge)', () => {
		expect(cn('px-2', 'px-4')).toBe('px-4');
	});

	it('resolves conflicting text-color utilities to the last one', () => {
		expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
	});

	it('keeps non-conflicting utilities', () => {
		expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
	});
});
