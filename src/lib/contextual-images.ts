import { PEXELS_IMAGES, type PexelsImage } from './pexels-images';

export type ContextualVisual = PexelsImage;

const visuals = PEXELS_IMAGES;

const pageHeroVisuals: Record<string, ContextualVisual> = {
	about: visuals.businessPark,
	contact: visuals.godown,
	'lease-terms': visuals.warehouse,
	locations: visuals.businessPark,
};

const pageContentVisuals: Record<string, ContextualVisual[]> = {
	about: [visuals.warehouse],
	contact: [visuals.businessPark],
	'lease-terms': [visuals.warehouse, visuals.apartment],
	locations: [visuals.warehouse, visuals.godown, visuals.businessPark, visuals.apartment],
};

const blogVisuals: Record<string, ContextualVisual> = {
	'locations-we-dont-operate-in': visuals.businessPark,
	'mombasa-road-corridor': visuals.warehouse,
	'reading-warehouse-spec-sheets': visuals.godown,
	'three-months-syokimau-godown': visuals.godown,
	'why-we-publish-per-sqft': visuals.warehouse,
};

export const getPageHeroVisual = (slug: string | null | undefined): ContextualVisual | null =>
	slug ? (pageHeroVisuals[slug] ?? null) : null;

export const getPageContentVisual = (
	slug: string | null | undefined,
	index: number,
): ContextualVisual | null => {
	if (!slug) return null;
	return pageContentVisuals[slug]?.[index] ?? null;
};

export const getBlogVisual = (slug: string | null | undefined): ContextualVisual =>
	(slug && blogVisuals[slug]) || visuals.warehouse;

export const getZoneVisual = (zone: string | null | undefined): ContextualVisual | null => {
	if (zone === 'Mlolongo') return visuals.warehouse;
	if (zone === 'Syokimau') return visuals.godown;
	if (zone === 'Baba Dogo') return visuals.businessPark;
	if (zone === 'Thika') return visuals.apartment;
	return null;
};

export const getPropertyVisual = (type: string | null | undefined): ContextualVisual | null => {
	if (type === 'WAREHOUSE') return visuals.warehouse;
	if (type === 'GODOWN') return visuals.godown;
	if (type === 'BUSINESS_PARK') return visuals.businessPark;
	if (type === 'APARTMENT') return visuals.apartment;
	return null;
};
