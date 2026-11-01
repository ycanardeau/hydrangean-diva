import type { YouTubeComment } from '@/features/media-player/helpers/youTubeDataApi';
import type { IPlayQueueItemStore } from '@/features/media-player/interfaces/IPlayQueueItemStore';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';
import { PlayerStore } from '@/features/media-player/stores/PlayerStore';
import { SettingsStore } from '@/features/media-player/stores/SettingsStore';
import { TimetableStore } from '@/features/media-player/stores/TimetableStore';
import { when } from 'mobx';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const description = 'Setlist\n0:00 Song 1\n3:00 Song 2\n6:00 Song 3';

let player: PlayerStore;
let playQueue: PlayQueueStore;
let settings: SettingsStore;
let fetchDescription: ReturnType<
	typeof vi.fn<
		(videoId: string, apiKey: string) => Promise<string | undefined>
	>
>;
let fetchComments: ReturnType<
	typeof vi.fn<(videoId: string, apiKey: string) => Promise<YouTubeComment[]>>
>;
let timetable: TimetableStore;

let youTubeItem: IPlayQueueItemStore;
let niconicoItem: IPlayQueueItemStore;

beforeEach(() => {
	player = new PlayerStore();
	playQueue = new PlayQueueStore();
	settings = new SettingsStore();
	fetchDescription = vi.fn(() => Promise.resolve(description));
	fetchComments = vi.fn(() => Promise.resolve([]));
	timetable = new TimetableStore(player, playQueue, settings, {
		fetchVideoDescription: fetchDescription,
		fetchTopComments: fetchComments,
	});

	youTubeItem = playQueue.createItemFromDto({
		url: 'https://www.youtube.com/watch?v=jUe7dDLGpv8',
		type: 'YouTube',
		videoId: 'jUe7dDLGpv8',
		title: 'YouTube video',
	});
	niconicoItem = playQueue.createItemFromDto({
		url: 'https://www.nicovideo.jp/watch/sm23384530',
		type: 'Niconico',
		videoId: 'sm23384530',
		title: 'Niconico video',
	});
});

describe('fetch', () => {
	it('should not fetch without an API key', async () => {
		await playQueue.addItems([youTubeItem]);

		expect(timetable.canFetch).toBe(false);

		await timetable.fetch();

		expect(fetchDescription).not.toHaveBeenCalled();
		expect(timetable.entries).toBeUndefined();
	});

	it('should not fetch for non-YouTube videos', async () => {
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([niconicoItem]);

		expect(timetable.canFetch).toBe(false);
	});

	it('should parse the fetched description', async () => {
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([youTubeItem]);

		await timetable.fetch();

		expect(fetchDescription).toHaveBeenCalledWith('jUe7dDLGpv8', 'key');
		expect(fetchComments).not.toHaveBeenCalled();
		expect(timetable.entries).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
			{ seconds: 360, title: 'Song 3' },
		]);
		expect(timetable.loading).toBe(false);
		expect(timetable.error).toBeUndefined();
	});

	it('should fall back to the comments when the description has no timetable', async () => {
		fetchDescription.mockResolvedValue('1. Song 1\n2. Song 2\n3. Song 3');
		fetchComments.mockResolvedValue([
			{ text: 'Great live!', likeCount: 5000 },
			{ text: '0:10 Song 1\n3:00 Song 2\n6:00 Song 3', likeCount: 900 },
		]);
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([youTubeItem]);

		await timetable.fetch();

		expect(fetchComments).toHaveBeenCalledWith('jUe7dDLGpv8', 'key');
		expect(timetable.entries).toEqual([
			{ seconds: 10, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
			{ seconds: 360, title: 'Song 3' },
		]);
	});

	it('should store an empty timetable when neither the description nor the comments have one', async () => {
		fetchDescription.mockResolvedValue('No timestamps here');
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([youTubeItem]);

		await timetable.fetch();

		expect(timetable.entries).toEqual([]);
	});

	it('should not fetch the comments when the video does not exist', async () => {
		fetchDescription.mockResolvedValue(undefined);
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([youTubeItem]);

		await timetable.fetch();

		expect(fetchComments).not.toHaveBeenCalled();
		expect(timetable.entries).toEqual([]);
	});

	it('should set the error when the request fails', async () => {
		fetchDescription.mockRejectedValue(new Error('Quota exceeded'));
		settings.setYouTubeApiKey('key');
		await playQueue.addItems([youTubeItem]);

		await timetable.fetch();

		expect(timetable.entries).toBeUndefined();
		expect(timetable.error).toBe('Quota exceeded');
	});
});

describe('startAutoFetch', () => {
	it('should fetch once when a YouTube video becomes current', async () => {
		settings.setYouTubeApiKey('key');
		const dispose = timetable.startAutoFetch();

		await playQueue.addItems([youTubeItem]);
		await when(() => timetable.entries !== undefined);

		playQueue.setCurrentItem(undefined);
		playQueue.setCurrentItem(youTubeItem);

		expect(fetchDescription).toHaveBeenCalledTimes(1);

		dispose();
	});

	it('should fetch when an API key is set later', async () => {
		const dispose = timetable.startAutoFetch();

		await playQueue.addItems([youTubeItem]);

		expect(fetchDescription).not.toHaveBeenCalled();

		settings.setYouTubeApiKey('key');
		await when(() => timetable.entries !== undefined);

		expect(fetchDescription).toHaveBeenCalledTimes(1);

		dispose();
	});

	it('should not retry automatically after an error', async () => {
		fetchDescription.mockRejectedValue(new Error('Quota exceeded'));
		settings.setYouTubeApiKey('key');
		const dispose = timetable.startAutoFetch();

		await playQueue.addItems([youTubeItem]);
		await when(() => timetable.error !== undefined);

		expect(fetchDescription).toHaveBeenCalledTimes(1);

		dispose();
	});
});

describe('setText', () => {
	it('should set the timetable of the current video', async () => {
		await playQueue.addItems([niconicoItem]);

		timetable.setText('0:00 Song 1\n1:00 Song 2');

		expect(timetable.entries).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 60, title: 'Song 2' },
		]);
	});

	it('should keep timetables per video', async () => {
		await playQueue.addItems([niconicoItem, youTubeItem]);

		timetable.setText('0:00 Song 1\n1:00 Song 2');
		await playQueue.next();

		expect(timetable.entries).toBeUndefined();
	});
});

describe('currentEntryIndex', () => {
	beforeEach(async () => {
		await playQueue.addItems([niconicoItem]);
		timetable.setText('0:10 Song 1\n3:00 Song 2\n6:00 Song 3');
	});

	it('should be undefined before the first entry', () => {
		player.onTimeUpdate({ duration: 600, percent: 0, seconds: 5 });

		expect(timetable.currentEntryIndex).toBeUndefined();
	});

	it('should be the last entry that has started', () => {
		player.onTimeUpdate({ duration: 600, percent: 0.3, seconds: 180 });
		expect(timetable.currentEntryIndex).toBe(1);

		player.onTimeUpdate({ duration: 600, percent: 0.9, seconds: 540 });
		expect(timetable.currentEntryIndex).toBe(2);
	});
});

describe('localStorageState', () => {
	it('should round-trip timetables', async () => {
		await playQueue.addItems([niconicoItem]);
		timetable.setText('0:00 Song 1\n1:00 Song 2');

		const state = timetable.localStorageState.state;
		expect(timetable.localStorageState.validateState(state)).toBe(true);

		const restored = new TimetableStore(player, playQueue, settings);
		restored.localStorageState.state = state;

		expect(restored.entries).toEqual(timetable.entries);
	});
});
