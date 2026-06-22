import { describe, it, expect } from 'vitest';
import { countWords, readingMinutes } from './blog-walker';

describe('countWords', () => {
	it('returns 0 for null and undefined', () => {
		expect(countWords(null)).toBe(0);
		expect(countWords(undefined)).toBe(0);
	});

	it('returns 0 for an empty string', () => {
		expect(countWords('')).toBe(0);
	});

	it('treats whitespace-only strings as 0', () => {
		expect(countWords('   \n  \t')).toBe(0);
	});

	it('counts a single-word string as 1', () => {
		expect(countWords('hello')).toBe(1);
	});

	it('counts multi-word strings', () => {
		expect(countWords('hello world from kenya')).toBe(4);
	});

	it('collapses runs of whitespace', () => {
		expect(countWords('hello   world')).toBe(2);
	});

	it('descends into an array of strings', () => {
		expect(countWords(['one two', 'three four five'])).toBe(5);
	});

	it('descends into Tina rich-text children and ignores structural keys', () => {
		const node = {
			type: 'root',
			children: [
				{ type: 'p', children: [{ type: 'text', text: 'mombasa road' }] },
				{ type: 'h2', level: 1, children: [{ type: 'text', text: 'syokimau' }] },
			],
		};
		expect(countWords(node)).toBe(3);
	});

	it('sums text fields across deeply nested children', () => {
		const node = {
			children: [
				{
					children: [
						{ text: 'one' },
						{ children: [{ text: 'two three' }] },
					],
				},
			],
		};
		expect(countWords(node)).toBe(3);
	});

	it('handles empty text fields cleanly', () => {
		expect(countWords({ text: '', children: [{ text: 'four' }] })).toBe(1);
	});
});

describe('readingMinutes', () => {
	it('returns null for a zero or negative word count', () => {
		expect(readingMinutes(0)).toBe(null);
		expect(readingMinutes(-5)).toBe(null);
	});

	it('returns minimum 1 for any positive word count', () => {
		expect(readingMinutes(1)).toBe(1);
		expect(readingMinutes(50)).toBe(1);
		expect(readingMinutes(199)).toBe(1);
	});

	it('rounds up at the 200 wpm boundary', () => {
		expect(readingMinutes(200)).toBe(1);
		expect(readingMinutes(201)).toBe(2);
		expect(readingMinutes(400)).toBe(2);
		expect(readingMinutes(401)).toBe(3);
	});

	it('returns 8 for ~1500 words', () => {
		expect(readingMinutes(1500)).toBe(8);
	});
});
