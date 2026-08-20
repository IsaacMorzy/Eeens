import { describe, expect, it } from 'vitest';
import { googleMapsDirectionsUrl } from '../src/lib/google-maps';

describe('googleMapsDirectionsUrl', () => {
	it('creates a Google Maps directions link from a property address', () => {
		expect(googleMapsDirectionsUrl('Mlolongo, Mombasa Road, KM 14')).toBe(
			'https://www.google.com/maps/dir/?api=1&destination=Mlolongo%2C%20Mombasa%20Road%2C%20KM%2014',
		);
	});

	it('returns null when no address or zone is available', () => {
		expect(googleMapsDirectionsUrl(null)).toBeNull();
		expect(googleMapsDirectionsUrl('')).toBeNull();
	});
});
