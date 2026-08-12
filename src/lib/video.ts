export interface PropertyVideo {
	title?: string | null;
	url?: string | null;
}

export interface ParsedPropertyVideo {
	id: string;
	title?: string | null;
}

export const parseYouTubeId = (url = ''): string | null =>
	url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})(?:[?&#/]|$)/)?.[1] ?? null;

export const parsePropertyVideos = (videos: readonly PropertyVideo[]): ParsedPropertyVideo[] =>
	videos.flatMap((video) => {
		const id = parseYouTubeId(video.url ?? '');
		return id ? [{ id, title: video.title }] : [];
	});
