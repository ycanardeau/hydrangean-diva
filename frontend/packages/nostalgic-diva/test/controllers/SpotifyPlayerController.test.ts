import type { PlayerOptions } from '@/controllers/PlayerController';
import { SpotifyPlayerController } from '@/controllers/SpotifyPlayerController';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

const TRACK_A = 'spotify:track:aaaaaaaaaaaaaaaaaaaaaa';
const TRACK_B = 'spotify:track:bbbbbbbbbbbbbbbbbbbbbb';

class FakeEmbedController {
	listeners = new Map<string, ((e: any) => void)[]>();

	addListener = vi.fn((eventName: string, listener: (e: any) => void) => {
		this.listeners.set(eventName, [
			...(this.listeners.get(eventName) ?? []),
			listener,
		]);
	});
	loadUri = vi.fn();
	play = vi.fn();
	resume = vi.fn();
	pause = vi.fn();
	restart = vi.fn();
	seek = vi.fn();

	emit(eventName: string, e?: unknown): void {
		for (const listener of this.listeners.get(eventName) ?? []) {
			listener(e);
		}
	}

	update(data: Partial<Spotify.PlaybackUpdateData>): void {
		this.emit('playback_update', {
			data: {
				playingURI: TRACK_A,
				isPaused: false,
				isBuffering: false,
				duration: 200_000,
				position: 0,
				...data,
			},
		});
	}
}

let player: FakeEmbedController;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: SpotifyPlayerController;

beforeEach(async () => {
	player = new FakeEmbedController();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new SpotifyPlayerController(
		createTestLogger(),
		player as unknown as Spotify.EmbedController,
		options,
	);
	await controller.attach(TRACK_A);
});

describe('attach', () => {
	it('should report loaded only once the embed is ready', () => {
		expect(options.onLoaded).not.toHaveBeenCalled();

		player.emit('ready');

		expect(options.onLoaded).toHaveBeenCalledWith({ id: TRACK_A });
	});
});

describe('playback_update', () => {
	it('should convert milliseconds into seconds', () => {
		player.update({ position: 50_000, duration: 200_000 });

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 200,
			percent: 0.25,
			seconds: 50,
		});
	});

	it('should report 0 percent when the duration is unknown', () => {
		player.update({ position: 0, duration: 0 });

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 0,
			percent: 0,
			seconds: 0,
		});
	});

	it('should cache duration and position for the getters', async () => {
		player.update({ position: 12_000, duration: 180_000 });

		expect(await controller.getDuration()).toBe(180);
		expect(await controller.getCurrentTime()).toBe(12);
	});

	it('should derive play and pause from isPaused transitions', () => {
		player.update({ isPaused: true }); // initial state is paused
		expect(options.onPlay).not.toHaveBeenCalled();
		expect(options.onPause).not.toHaveBeenCalled();

		player.update({ isPaused: false, position: 1_000 });
		player.update({ isPaused: false, position: 2_000 });
		expect(options.onPlay).toHaveBeenCalledTimes(1);

		player.update({ isPaused: true, position: 2_000 });
		player.update({ isPaused: true, position: 2_000 });
		expect(options.onPause).toHaveBeenCalledTimes(1);

		player.update({ isPaused: false, position: 2_500 });
		expect(options.onPlay).toHaveBeenCalledTimes(2);
	});
});

describe('ended', () => {
	it('should fire once when position reaches duration', () => {
		player.update({ position: 199_000 });
		expect(options.onEnded).not.toHaveBeenCalled();

		player.update({ position: 200_000 });
		player.update({ position: 200_000 });
		player.update({ position: 200_500 });

		expect(options.onEnded).toHaveBeenCalledTimes(1);
	});

	it('should not fire when duration is unknown', () => {
		player.update({ position: 0, duration: 0 });

		expect(options.onEnded).not.toHaveBeenCalled();
	});

	it('should fire again after the track restarts (repeat-one)', () => {
		player.update({ position: 200_000 });
		player.update({ position: 0 });
		player.update({ position: 200_000 });

		expect(options.onEnded).toHaveBeenCalledTimes(2);
	});

	it('should ignore a stale end update for the previous track after loadVideo', async () => {
		player.update({ playingURI: TRACK_A, position: 200_000 });
		expect(options.onEnded).toHaveBeenCalledTimes(1);

		// The host reacts to `onEnded` by loading the next track...
		await controller.loadVideo(TRACK_B);
		// ...but Spotify keeps reporting the end of the previous track.
		player.update({ playingURI: TRACK_A, position: 200_000 });
		player.update({ playingURI: TRACK_A, position: 200_000 });

		expect(options.onEnded).toHaveBeenCalledTimes(1);
	});

	it('should fire for the next track once it ends', async () => {
		player.update({ playingURI: TRACK_A, position: 200_000 });
		await controller.loadVideo(TRACK_B);
		player.update({ playingURI: TRACK_A, position: 200_000 });

		player.update({ playingURI: TRACK_B, position: 0, duration: 100_000 });
		player.update({
			playingURI: TRACK_B,
			position: 50_000,
			duration: 100_000,
		});
		expect(options.onEnded).toHaveBeenCalledTimes(1);

		player.update({
			playingURI: TRACK_B,
			position: 100_000,
			duration: 100_000,
		});
		expect(options.onEnded).toHaveBeenCalledTimes(2);
	});

	it('should fire when the new track starts already at its end', () => {
		player.update({ playingURI: TRACK_A, position: 200_000 });

		player.update({
			playingURI: TRACK_B,
			position: 100_000,
			duration: 100_000,
		});

		expect(options.onEnded).toHaveBeenCalledTimes(2);
	});
});

describe('loadVideo', () => {
	it('should load the URI and report loaded', async () => {
		await controller.loadVideo(TRACK_B);

		expect(player.loadUri).toHaveBeenCalledWith(TRACK_B);
		expect(options.onLoaded).toHaveBeenCalledWith({ id: TRACK_B });
	});

	it('should reset the cached time and paused state', async () => {
		player.update({ isPaused: false, position: 50_000 });
		expect(options.onPlay).toHaveBeenCalledTimes(1);

		await controller.loadVideo(TRACK_B);

		expect(await controller.getDuration()).toBe(0);
		expect(await controller.getCurrentTime()).toBe(0);

		// Playback of the new track counts as a new `play`.
		player.update({ playingURI: TRACK_B, isPaused: false });
		expect(options.onPlay).toHaveBeenCalledTimes(2);
	});
});

describe('commands', () => {
	it('should use resume rather than play', async () => {
		await controller.play();

		expect(player.resume).toHaveBeenCalledTimes(1);
		expect(player.play).not.toHaveBeenCalled();
	});

	it('should pause', async () => {
		await controller.pause();

		expect(player.pause).toHaveBeenCalledTimes(1);
	});

	it('should seek in seconds', async () => {
		await controller.setCurrentTime(42);

		expect(player.seek).toHaveBeenCalledWith(42);
		expect(player.restart).not.toHaveBeenCalled();
	});

	it.each([0, -1])('should restart instead of seeking to %s', async (s) => {
		await controller.setCurrentTime(s);

		expect(player.restart).toHaveBeenCalledTimes(1);
		expect(player.seek).not.toHaveBeenCalled();
	});

	it.each([
		['loadVideo', true],
		['play', true],
		['pause', true],
		['setCurrentTime', true],
		['getDuration', true],
		['getCurrentTime', true],
		['setVolume', false],
		['setMuted', false],
		['setPlaybackRate', false],
		['getVolume', false],
		['getMuted', false],
		['getPlaybackRate', false],
	] as const)('supports(%s) should be %s', (command, expected) => {
		expect(controller.supports(command)).toBe(expected);
	});
});
