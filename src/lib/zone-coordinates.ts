/**
 * zone-coordinates.ts — approximate area centers for the four operating
 * zones, used for the "area map" embed on listing detail pages.
 *
 * These are area-level references (the zone, not the exact plot), which
 * matches how the register publishes addresses ("Mlolongo, Mombasa Road,
 * KM 14") and keeps the map honest: it shows where the zone is, never a
 * fabricated pin. Exact coordinates are not part of the register.
 */
export type ZoneKey = 'Mlolongo' | 'Syokimau' | 'Baba Dogo' | 'Thika';

const ZONE_COORDINATES: Record<ZoneKey, { lat: number; lon: number }> = {
	Mlolongo: { lat: -1.407, lon: 36.936 },
	Syokimau: { lat: -1.367, lon: 36.923 },
	'Baba Dogo': { lat: -1.252, lon: 36.872 },
	Thika: { lat: -1.039, lon: 37.09 },
};

/** Half-span (degrees) of the embed box around the zone center. */
const SPAN = 0.03;

export const zoneCoordinates = (zone: string | null | undefined): { lat: number; lon: number } | null => {
	if (!zone) return null;
	return ZONE_COORDINATES[zone as ZoneKey] ?? null;
};

/**
 * OpenStreetMap embed URL (export/embed) centered on the zone with a
 * marker. Returns null when the zone has no known center.
 */
export const zoneMapEmbedUrl = (zone: string | null | undefined): string | null => {
	const center = zoneCoordinates(zone);
	if (!center) return null;
	const { lat, lon } = center;
	const bbox = [lon - SPAN, lat - SPAN, lon + SPAN, lat + SPAN].join(',');
	return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
};

/** OpenStreetMap browse URL for the zone (full-page map, not an embed). */
export const zoneMapBrowseUrl = (zone: string | null | undefined): string | null => {
	const center = zoneCoordinates(zone);
	return center ? `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lon}#map=13/${center.lat}/${center.lon}` : null;
};
