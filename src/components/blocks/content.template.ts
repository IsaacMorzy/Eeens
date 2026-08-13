import type { Template } from 'tinacms';

export const contentBlockSchema: Template = {
	name: 'content',
	label: 'Content',
	fields: [
		{ type: 'string', label: 'Title', name: 'title' },
		{ type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
		{
			type: 'object',
			label: 'Image (optional)',
			name: 'image',
			fields: [
				{ type: 'image', label: 'Image source', name: 'src' },
				{ type: 'string', label: 'Alt text', name: 'alt' },
			],
		},
		{ type: 'rich-text', label: 'Body', name: 'body' },
	],
	ui: {
		defaultItem: {
			title: 'Add a section title',
			description: 'State the decision or detail this section helps a visitor understand.',
			body: 'Add the supporting facts here.',
		},
	},
};
