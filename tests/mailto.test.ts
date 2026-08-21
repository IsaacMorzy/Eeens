import { describe, expect, it } from 'vitest';
import { createMailtoHref } from '../src/lib/mailto';

describe('createMailtoHref', () => {
	it('encodes the subject and every non-empty form field in the body', () => {
		expect(createMailtoHref('hello@eens.co.ke', 'Viewing request - EE-MLO-014', [
			['Full name', 'Amina Ochieng'],
			['Email address', 'amina@example.com'],
			['Message', 'Please share Tuesday times.'],
		])).toBe(
			'mailto:hello@eens.co.ke?subject=Viewing%20request%20-%20EE-MLO-014&body=Full%20name%3A%20Amina%20Ochieng%0A%0AEmail%20address%3A%20amina%40example.com%0A%0AMessage%3A%20Please%20share%20Tuesday%20times.',
		);
	});

	it('omits blank optional values and encodes user text as data', () => {
		expect(createMailtoHref('hello@eens.co.ke', 'Job application', [
			['Full name', ''],
			['Role', 'Operations & logistics'],
			['Message', 'Line one\nLine two'],
		])).toBe(
			'mailto:hello@eens.co.ke?subject=Job%20application&body=Role%3A%20Operations%20%26%20logistics%0A%0AMessage%3A%20Line%20one%0ALine%20two',
		);
	});
});
