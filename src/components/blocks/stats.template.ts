import type { Template } from 'tinacms';
import type { StatItem } from '../../lib/data';

export const statsBlockSchema: Template = {
	name: 'stats',
	label: 'Stats',
	fields: [
		{ type: 'string', label: 'Title', name: 'title' },
		{ type: 'string', label: 'Description', name: 'description' },
		{
			type: 'object', label: 'Stats', name: 'stats', list: true,
			ui: { defaultItem: { stat: '3-yr', type: 'Standard industrial lease term' }, itemProps: (i: StatItem) => ({ label: `${i.stat ?? ''} ${i.type ?? ''}` }) },
			fields: [
				{ type: 'string', label: 'Stat', name: 'stat' },
				{ type: 'string', label: 'Type', name: 'type' },
			],
		},
	],
	ui: {
		defaultItem: {
			title: 'Four zones. One clear standard.',
			description: 'The same facts appear on every listing: where it is, what it measures, what it costs, and what happens next.',
			stats: [
				{ stat: '4', type: 'Zones on Mombasa Road + Thika' },
				{ stat: '2018', type: 'Year established' },
				{ stat: '3-yr', type: 'Standard industrial lease term' },
			],
		},
	},
};
