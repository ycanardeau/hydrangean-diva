import type { PlayerOptions } from '@/controllers/PlayerController';
import { YouTubePlayerController } from '@/controllers/YouTubePlayerController';
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { createTestLogger } from '../testLogger';

const PlayerState = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,
};

class FakeYouTubePlayer {
	listeners = new Map<string, ((event: any) => void)[]>();
	currentTime = 0;
	duration = 200;
	volume = 100;
	muted = false;
	playbackRate = 1;

	addEventListener = vi.fn((event: string, handler: (e: any) => void) => {
		this.listeners.set(event, [
			...(this.listeners.get(event) ?? []),
			handler,
		]);
	});
	cueVideoById = vi.fn();
	playVideo = vi.fn();
	pauseVideo = vi.fn();
	seekTo = vi.fn((seconds: number) => {
		this.currentTime = seconds;
	});
	setVolume = vi.fn((volume: number) => {
		this.volume = volume;
	});
	getVolume = vi.fn(() => this.volume);
	mute = vi.fn(() => {
		this.muted = true;
	});
	unMute = vi.fn(() => {
		this.muted = false;
	});
	isMuted = vi.fn(() => this.muted);
	setPlaybackRate = vi.fn((rate: number) => {
		this.playbackRate = rate;
	});
	getPlaybackRate = vi.fn(() => this.playbackRate);
	getCurrentTime = vi.fn(() => this.currentTime);
	getDuration = vi.fn(() => this.duration);

	emit(event: string, data?: unknown): void {
		for (const handler of this.listeners.get(event) ?? []) {
			handler({ target: this, data });
		}
	}
}

let player: FakeYouTubePlayer;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: YouTubePlayerController;

beforeEach(() => {
	vi.useFakeTimers();
	vi.stubGlobal('YT', { PlayerState });

	player = new FakeYouTubePlayer();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new YouTubePlayerController(
		createTestLogger(),
		player as unknown as YT.Player,
		options,
	);
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

async function attach(id = 'bQUB6bbFU7Y'): Promise<void> {
	const promise = controller.attach(id);
	player.emit('onReady');
	await promise;
}

describe('attach', () => {
	it('should not resolve until the player is ready', async () => {
		let resolved = false;
		void controller.attach('bQUB6bbFU7Y').then(() => (resolved = true));

		await vi.advanceTimersByTimeAsync(1000);
		expect(resolved).toBe(false);
		expect(player.cueVideoById).not.toHaveBeenCalled();

		player.emit('onReady');
		await vi.advanceTimersByTimeAsync(0);
		expect(resolved).toBe(true);
	});

	it('should cue the video on ready', async () => {
		await attach('bQUB6bbFU7Y');

		expect(player.cueVideoById).toHaveBeenCalledWith('bQUB6bbFU7Y');
	});
});

describe('events', () => {
	beforeEach(async () => {
		await attach('bQUB6bbFU7Y');
	});

	it('should report CUED as loaded with the attached id', () => {
		player.emit('onStateChange', PlayerState.CUED);

		expect(options.onLoaded).toHaveBeenCalledWith({ id: 'bQUB6bbFU7Y' });
	});

	it('should report PLAYING, PAUSED and ENDED', () => {
		player.emit('onStateChange', PlayerState.PLAYING);
		player.emit('onStateChange', PlayerState.PAUSED);
		player.emit('onStateChange', PlayerState.ENDED);

		expect(options.onPlay).toHaveBeenCalledTimes(1);
		expect(options.onPause).toHaveBeenCalledTimes(1);
		expect(options.onEnded).toHaveBeenCalledTimes(1);
	});

	it('should ignore BUFFERING and UNSTARTED', () => {
		player.emit('onStateChange', PlayerState.BUFFERING);
		player.emit('onStateChange', PlayerState.UNSTARTED);

		expect(options.onPlay).not.toHaveBeenCalled();
		expect(options.onPause).not.toHaveBeenCalled();
		expect(options.onEnded).not.toHaveBeenCalled();
		expect(options.onLoaded).not.toHaveBeenCalled();
	});

	it('should forward errors', () => {
		player.emit('onError', 150);

		expect(options.onError).toHaveBeenCalledWith(150);
	});
});

describe('time updates', () => {
	beforeEach(async () => {
		await attach();
	});

	it('should report the time immediately when playback starts', () => {
		player.currentTime = 50;

		player.emit('onStateChange', PlayerState.PLAYING);

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 200,
			percent: 0.25,
			seconds: 50,
		});
	});

	it('should poll every 250ms while playing and skip unchanged times', () => {
		player.emit('onStateChange', PlayerState.PLAYING);
		expect(options.onTimeUpdate).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(250);
		expect(options.onTimeUpdate).toHaveBeenCalledTimes(1);

		player.currentTime = 1;
		vi.advanceTimersByTime(250);
		expect(options.onTimeUpdate).toHaveBeenCalledTimes(2);
		expect(options.onTimeUpdate).toHaveBeenLastCalledWith({
			duration: 200,
			percent: 1 / 200,
			seconds: 1,
		});
	});

	it.each([
		['PAUSED', PlayerState.PAUSED],
		['ENDED', PlayerState.ENDED],
	])('should stop polling on %s', (_, state) => {
		player.emit('onStateChange', PlayerState.PLAYING);
		player.emit('onStateChange', state);
		options.onTimeUpdate.mockClear();

		player.currentTime = 10;
		vi.advanceTimersByTime(1000);

		expect(options.onTimeUpdate).not.toHaveBeenCalled();
	});

	it('should not stack intervals when PLAYING fires repeatedly', () => {
		player.emit('onStateChange', PlayerState.PLAYING);
		player.emit('onStateChange', PlayerState.PLAYING);
		player.emit('onStateChange', PlayerState.PLAYING);

		expect(vi.getTimerCount()).toBe(1);
	});

	it('should stop polling on detach', async () => {
		player.emit('onStateChange', PlayerState.PLAYING);

		await controller.detach();

		expect(vi.getTimerCount()).toBe(0);
	});

	it('should report the time after seeking', async () => {
		await controller.setCurrentTime(30);

		expect(player.seekTo).toHaveBeenCalledWith(30);
		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 200,
			percent: 30 / 200,
			seconds: 30,
		});
	});

	it('should report the same time again after loading a new video', async () => {
		player.emit('onStateChange', PlayerState.PLAYING);
		player.emit('onStateChange', PlayerState.PAUSED);
		options.onTimeUpdate.mockClear();

		await controller.loadVideo('another0001');
		player.emit('onStateChange', PlayerState.PLAYING);

		expect(player.cueVideoById).toHaveBeenLastCalledWith('another0001');
		expect(options.onTimeUpdate).toHaveBeenCalledTimes(1);
	});
});

describe('commands', () => {
	beforeEach(async () => {
		await attach();
	});

	it('should play and pause', async () => {
		await controller.play();
		await controller.pause();

		expect(player.playVideo).toHaveBeenCalledTimes(1);
		expect(player.pauseVideo).toHaveBeenCalledTimes(1);
	});

	it('should scale volume between 0..1 and 0..100', async () => {
		await controller.setVolume(0.3);

		expect(player.setVolume).toHaveBeenCalledWith(30);
		expect(await controller.getVolume()).toBeCloseTo(0.3);
	});

	it('should mute and unmute', async () => {
		await controller.setMuted(true);
		expect(player.mute).toHaveBeenCalled();
		expect(await controller.getMuted()).toBe(true);

		await controller.setMuted(false);
		expect(player.unMute).toHaveBeenCalled();
		expect(await controller.getMuted()).toBe(false);
	});

	it('should set and get the playback rate', async () => {
		await controller.setPlaybackRate(1.5);

		expect(await controller.getPlaybackRate()).toBe(1.5);
	});

	it('should get duration and current time', async () => {
		player.currentTime = 12;

		expect(await controller.getDuration()).toBe(200);
		expect(await controller.getCurrentTime()).toBe(12);
	});

	it('should support every command', () => {
		expect(controller.supports('setMuted')).toBe(true);
		expect(controller.supports('setPlaybackRate')).toBe(true);
		expect(controller.supports('getPlaybackRate')).toBe(true);
	});
});
