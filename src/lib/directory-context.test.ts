import { describe, expect, it } from 'vitest';
import { selectDirectoryContext, type DirectoryContext } from './directory-context';

const contexts: DirectoryContext[] = [
	{ key: 'shops', title: 'Shop units', description: 'Published shop records.' },
	{ key: 'warehouses', title: 'Warehouses', description: 'Published warehouse records.' },
];

describe('selectDirectoryContext', () => {
	it('returns the context matching a canonical directory key', () => {
		expect(selectDirectoryContext(contexts, 'warehouses')).toEqual(contexts[1]);
	});

	it('ignores null records and returns null for a missing key', () => {
		expect(selectDirectoryContext([null, ...contexts], 'apartments')).toBeNull();
	});
});
