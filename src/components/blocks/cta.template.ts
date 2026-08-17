import type { Template } from 'tinacms';
import type { Action } from '../../lib/data';

export const ctaBlockSchema: Template = {
	name: 'cta',
	label: 'CTA',
	fields: [
		{ type: 'string', label: 'Title', name: 'title' },
		{ type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
		{
			type: 'object', label: 'Actions', name: 'actions', list: true,
			ui: {
				defaultItem: { label: 'Browse listings', type: 'button', link: '/warehouses' },
				itemProps: (item: Action) => ({ label: item.label ?? '' }),
			},
			fields: [
				{ type: 'string', label: 'Label', name: 'label' },
				{ type: 'string', label: 'Type', name: 'type', options: [
					{ label: 'Button', value: 'button' }, { label: 'Link', value: 'link' } ] },
				{ type: 'string', label: 'Icon (Tabler name)', name: 'icon' },
				{ type: 'string', label: 'Link', name: 'link' },
			],
		},
	],
	ui: {
		defaultItem: {
			title: 'Ready to inspect a unit?',
			description: 'Send the listing reference. We reply within one business day with available time slots.',
			actions: [
				{ label: 'Browse listings', type: 'button', link: '/warehouses' },
				{ label: 'Contact Eens', type: 'link', link: '/contact' },
			],
		},
	},
};
