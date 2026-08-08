export interface PexelsImage {
	src: string;
	alt: string;
	label: string;
	sourceUrl: string;
	photographer?: string;
}

/**
 * Local copies of Pexels photos. Keeping the source page beside each asset
 * makes the static build independent of the CDN while preserving provenance.
 * Pexels License: free personal and commercial use; attribution is optional.
 */
export const PEXELS_IMAGES = {
	warehouse: {
		src: '/photography/pexels-photo-9716363.jpeg',
		alt: 'Aerial view of organized cargo containers in an industrial logistics yard.',
		label: 'Industrial logistics · warehouse context',
		sourceUrl: 'https://www.pexels.com/photo/aerial-shot-of-blue-cargo-containers-9716363/',
	},
	godown: {
		src: '/photography/pexels-photo-19634723.jpeg',
		alt: 'Logistics yard with stacked cargo containers and a worker walking between loading areas.',
		label: 'Logistics yard · godown context',
		sourceUrl: 'https://www.pexels.com/photo/man-with-backpack-walking-among-red-containers-at-warehouse-19634723/',
	},
	businessPark: {
		src: '/photography/pexels-photo-19920921.jpeg',
		alt: 'Contemporary commercial building with glass-fronted façades in an urban business setting.',
		label: 'Commercial architecture · business park context',
		sourceUrl: 'https://www.pexels.com/photo/an-office-building-in-a-city-19920921/',
	},
	apartment: {
		src: '/photography/pexels-photo-34604972.jpeg',
		alt: 'Modern apartment building exterior with balconies and landscaped surroundings.',
		label: 'Residential architecture · apartment context',
		sourceUrl: 'https://www.pexels.com/photo/modern-residential-apartment-building-exterior-34604972/',
	},
} satisfies Record<string, PexelsImage>;

export const getPexelsSource = (src: string | null | undefined): string | null =>
	Object.values(PEXELS_IMAGES).find((image) => image.src === src)?.sourceUrl ?? null;
