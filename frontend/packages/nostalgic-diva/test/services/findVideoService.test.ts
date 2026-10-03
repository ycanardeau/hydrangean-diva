import { findVideoService } from '@/services/findVideoService';
import { describe, expect, it } from 'vitest';

describe('findVideoService', () => {
	it.each([
		[
			'https://www.youtube.com/watch?v=bQUB6bbFU7Y',
			'YouTube',
			'bQUB6bbFU7Y',
		],
		['https://youtube.com/watch?v=bQUB6bbFU7Y', 'YouTube', 'bQUB6bbFU7Y'],
		['https://youtu.be/bQUB6bbFU7Y', 'YouTube', 'bQUB6bbFU7Y'],
		[
			'https://www.youtube.com/watch?feature=share&v=bQUB6bbFU7Y',
			'YouTube',
			'bQUB6bbFU7Y',
		],
		['https://www.youtube.com/embed/bQUB6bbFU7Y', 'YouTube', 'bQUB6bbFU7Y'],
		[
			'https://www.youtube-nocookie.com/embed/bQUB6bbFU7Y',
			'YouTube',
			'bQUB6bbFU7Y',
		],
		[
			'https://www.youtube.com/shorts/bQUB6bbFU7Y',
			'YouTube',
			'bQUB6bbFU7Y',
		],
		['https://www.youtube.com/live/bQUB6bbFU7Y', 'YouTube', 'bQUB6bbFU7Y'],
		[
			'https://www.youtube.com/watch?v=a-b_c-d_e-f',
			'YouTube',
			'a-b_c-d_e-f',
		],
		['https://www.twitch.tv/videos/1234567890', 'Twitch', '1234567890'],
		['https://go.twitch.tv/videos/1234567890', 'Twitch', '1234567890'],
		['https://twitch.tv/videos/1234567890?t=1h', 'Twitch', '1234567890'],
		['https://vimeo.com/76979871', 'Vimeo', '76979871'],
		['https://www.dailymotion.com/video/x7tgad0', 'Dailymotion', 'x7tgad0'],
		[
			'https://www.dailymotion.com/embed/video/x7tgad0',
			'Dailymotion',
			'x7tgad0',
		],
		['https://dai.ly/x7tgad0', 'Dailymotion', 'x7tgad0'],
		[
			'https://www.dailymotion.com/video/x7tgad0_some-title',
			'Dailymotion',
			'x7tgad0',
		],
		[
			'https://soundcloud.com/tamtamsound/mojito',
			'SoundCloud',
			'https://soundcloud.com/tamtamsound/mojito',
		],
		[
			'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
			'Spotify',
			'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
		],
		[
			'https://open.spotify.com/intl-ja/track/4uLU6hMCjMI75M1A2tKUQC?si=abc',
			'Spotify',
			'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
		],
		[
			'https://open.spotify.com/episode/4uLU6hMCjMI75M1A2tKUQC',
			'Spotify',
			'spotify:episode:4uLU6hMCjMI75M1A2tKUQC',
		],
		[
			'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
			'Spotify',
			'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
		],
		[
			'https://example.com/audio.mp3',
			'Audio',
			'https://example.com/audio.mp3',
		],
		[
			'https://example.com/audio.MP3?token=abc',
			'Audio',
			'https://example.com/audio.MP3?token=abc',
		],
		[
			'https://example.com/video.mp4',
			'Audio',
			'https://example.com/video.mp4',
		],
		[
			'https://example.com/video.webm',
			'Audio',
			'https://example.com/video.webm',
		],
		['https://www.nicovideo.jp/watch/sm9', 'Niconico', 'sm9'],
		['https://nicovideo.jp/watch/sm9', 'Niconico', 'sm9'],
		['https://www.nicovideo.jp/watch/so12345678', 'Niconico', 'so12345678'],
	])('%s → %s (%s)', (url, type, videoId) => {
		const videoService = findVideoService(url);

		expect(videoService?.type).toBe(type);
		expect(videoService?.extractVideoId(url)).toBe(videoId);
	});

	it.each([
		'',
		'https://example.com/',
		'https://example.com/page.html',
		'https://www.nicovideo.jp/watch/sm9?from=0',
		'https://open.spotify.com/user/abc',
		'spotify:user:abc',
		'https://vimeo.com/channels/staffpicks',
	])('%s → undefined', (url) => {
		expect(findVideoService(url)).toBeUndefined();
	});

	// `NostalgicDiva` destructures `extractVideoId` off the service before
	// calling it, so it must not depend on `this`.
	it.each([
		'https://www.youtube.com/watch?v=bQUB6bbFU7Y',
		'https://www.twitch.tv/videos/1234567890',
		'https://vimeo.com/76979871',
		'https://www.dailymotion.com/video/x7tgad0',
		'https://soundcloud.com/tamtamsound/mojito',
		'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
		'https://example.com/audio.mp3',
		'https://www.nicovideo.jp/watch/sm9',
	])('extractVideoId works unbound for %s', (url) => {
		const videoService = findVideoService(url)!;
		const { extractVideoId } = videoService;

		expect(extractVideoId(url)).toBe(videoService.extractVideoId(url));
	});

	// YouTube playlist and user URLs are recognized as YouTube but have no
	// video ID, which `NostalgicDiva` turns into an empty player.
	it.each([
		'https://www.youtube.com/playlist?list=PL0123456789',
		'https://www.youtube.com/user/someone',
	])('%s → YouTube without a video ID', (url) => {
		const videoService = findVideoService(url);

		expect(videoService?.type).toBe('YouTube');
		expect(videoService?.extractVideoId(url)).toBeUndefined();
	});
});
