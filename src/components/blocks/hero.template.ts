import type { Template } from 'tinacms';
import type { Action } from '../../lib/data';

export const heroBlockSchema: Template = {
	name: 'hero',
	label: 'Hero',
	fields: [
		{ type: 'string', label: 'Headline', name: 'headline' },
		{ type: 'string', label: 'Tagline', name: 'tagline' },
		{
			type: 'object', label: 'Actions', name: 'actions', list: true,
			ui: { defaultItem: { label: 'Browse listings', type: 'button', link: '/warehouses' }, itemProps: (i: Action) => ({ label: i.label ?? '' }) },
			fields: [
				{ type: 'string', label: 'Label', name: 'label' },
				{ type: 'string', label: 'Type', name: 'type', options: [{ label: 'Button', value: 'button' }, { label: 'Link', value: 'link' }] },
				{ type: 'string', label: 'Icon (Tabler name)', name: 'icon' },
				{ type: 'string', label: 'Link', name: 'link' },
			],
		},
		{
			type: 'object', label: 'Image', name: 'image',
			fields: [
				{ name: 'src', label: 'Image Source', type: 'image' },
				{ name: 'alt', label: 'Alt Text', type: 'string' },
			],
		},
	],
	ui: {
		defaultItem: {
			tagline: 'State the address, area, price, and terms that the page publishes.',
			headline: 'Space for the operation you are running.',
		},
	},
};
