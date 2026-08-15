import type { Template } from 'tinacms';

export const galleryBlockSchema: Template = {
	name: 'Gallery',
	label: 'Gallery',
	ui: {
		defaultItem: {
			title: 'Gallery',
			description: 'Use approved images and identify contextual photography clearly.',
		},
	},
	fields: [
		{ name: 'title', label: 'Title', type: 'string' },
		{ name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
		{
			name: 'items',
			label: 'Images',
			type: 'object',
			list: true,
			ui: { itemProps: (item: { caption?: string }) => ({ label: item?.caption ?? 'Image' }) },
			fields: [
				{
					name: 'image',
					label: 'Image',
					type: 'object',
					fields: [
						{ name: 'src', label: 'Image source', type: 'image', required: true },
						{ name: 'alt', label: 'Alt text', type: 'string', required: true },
					],
				},
				{ name: 'caption', label: 'Caption', type: 'string', required: true },
				{ name: 'kind', label: 'Image role', type: 'string', options: [
					{ label: 'Contextual photography', value: 'Contextual photography' },
					{ label: 'Eens project material', value: 'Eens project material' },
				] },
				{ name: 'sourceUrl', label: 'Source URL (optional)', type: 'string' },
			],
		},
	],
};
