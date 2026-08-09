import { describe, expect, it } from 'vitest';
import { parsePropertyVideos, parseYouTubeId } from './video';

describe('parseYouTubeId', () => {
	it('extracts IDs from the supported YouTube URL forms', () => {
		expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
		expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
		expect(parseYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
	});

	it('returns null for empty or non-YouTube URLs', () => {
		expect(parseYouTubeId()).toBeNull();
		expect(parseYouTubeId('https://vimeo.com/123456')).toBeNull();
	});
});

describe('parsePropertyVideos', () => {
	it('keeps valid YouTube videos and drops unsupported URLs', () => {
		expect(parsePropertyVideos([
			{ title: 'Walkthrough', url: 'https://youtu.be/dQw4w9WgXcQ' },
			{ title: 'Other host', url: 'https://vimeo.com/123456' },
		])).toEqual([{ title: 'Walkthrough', id: 'dQw4w9WgXcQ' }]);
	});
});
