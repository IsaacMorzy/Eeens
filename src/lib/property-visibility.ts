import type { PropertyNode } from './data';

export const isPublicProperty = (property: PropertyNode): boolean =>
	property.occupancyState !== 'unpublished';
