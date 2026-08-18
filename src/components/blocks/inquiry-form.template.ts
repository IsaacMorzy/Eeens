import type { Template } from 'tinacms';

/**
 * inquiry-form.template.ts — Tina block schema for the viewing-inquiry
 * form. All visible copy is editable; the form composes a mailto message
 * to the configured office address, so no backend is required.
 */
export const inquiryFormBlockSchema: Template = {
	name: 'InquiryForm',
	label: 'Viewing inquiry form',
	ui: {
		defaultItem: {
			title: 'Request a viewing.',
			description: 'Send the listing reference or the space you are considering; the office replies within one business day.',
			submitLabel: 'Request a viewing',
			privacyNote: 'The site does not store inquiries. Your email client will open with the details you entered.',
		},
	},
	fields: [
		{ name: 'title', label: 'Form title', type: 'string' },
		{ name: 'description', label: 'Form description', type: 'string', ui: { component: 'textarea' } },
		{ name: 'submitLabel', label: 'Submit button label', type: 'string' },
		{ name: 'privacyNote', label: 'Privacy note', type: 'string', ui: { component: 'textarea' } },
	],
};
