import { describe, expect, it } from 'vitest';
import { isPublicProperty } from '../src/lib/property-visibility';
import type { PropertyNode } from '../src/lib/data';

describe('isPublicProperty', () => {
	it('hides records explicitly marked unpublished', () => {
		expect(isPublicProperty({ occupancyState: 'unpublished' })).toBe(false);
	});

	it('keeps records without an occupancy state public for backwards compatibility', () => {
		expect(isPublicProperty({ occupancyState: null })).toBe(true);
		expect(isPublicProperty({} satisfies PropertyNode)).toBe(true);
	});
});
