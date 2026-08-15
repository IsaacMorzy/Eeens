import type { Template } from 'tinacms';

export const careersFormBlockSchema: Template = {
	name: 'CareersForm',
	label: 'Careers application form',
	ui: {
		defaultItem: {
			title: 'Send an application',
			description: 'Use your email client to send your application to the Eens office.',
			submitLabel: 'Open email application',
			subjectPrefix: 'Job application',
			privacyNote: 'The site does not store applications. Your email client will open with the details you entered.',
		},
	},
	fields: [
		{ name: 'title', label: 'Form title', type: 'string' },
		{ name: 'description', label: 'Form description', type: 'string', ui: { component: 'textarea' } },
		{ name: 'submitLabel', label: 'Submit button label', type: 'string' },
		{ name: 'subjectPrefix', label: 'Email subject prefix', type: 'string' },
		{ name: 'privacyNote', label: 'Privacy note', type: 'string', ui: { component: 'textarea' } },
	],
};
