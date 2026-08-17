import type { Template } from 'tinacms';

export const calloutBlockSchema: Template = {
	name: 'callout',
	label: 'Callout',
	fields: [
		{ type: 'string', label: 'Text', name: 'text' },
		{ type: 'string', label: 'Url', name: 'url' },
	],
	ui: {
		defaultItem: { url: '/contact', text: 'Viewing fee: zero. Send the listing reference and we reply within one business day.' },
	},
};
