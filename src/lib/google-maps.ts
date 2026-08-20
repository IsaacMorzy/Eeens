/** Build a Google Maps directions URL without loading a map on the page. */
export const googleMapsDirectionsUrl = (destination: string | null | undefined): string | null => {
	const value = destination?.trim();
	return value ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(value)}` : null;
};
