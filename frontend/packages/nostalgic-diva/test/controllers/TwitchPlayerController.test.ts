import type { PlayerOptions } from '@/controllers/PlayerController';
import { TwitchPlayerController } from '@/controllers/TwitchPlayerController';
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

const Player = {
	READY: 'ready',
	PLAYING: 'playing',
	PAUSE: 'pause',
	ENDED: 'ended',
	SEEK: 'seek',
};

class FakeTwitchPlayer {
	listeners = new Map<string, () => void>();
	muted = false;
	volume = 1;

	addEventListener = vi.fn((event: string, listener: () => void) => {
		this.listeners.set(event, listener);
	});
	getVideo = vi.fn(() => 'v1234567890');
	setVideo = vi.fn();
	play = vi.fn();
	pause = vi.fn();
	seek = vi.fn();
	setVolume = vi.fn((v: number) => {
		this.volume = v;
	});
	getVolume = vi.fn(() => this.volume);
	setMuted = vi.fn((m: boolean) => {
		this.muted = m;
	});
	getMuted = vi.fn(() => this.muted);
	getDuration = vi.fn(() => 3600);
	getCurrentTime = vi.fn(() => 60);

	emit(event: string): void {
		this.listeners.get(event)?.();
	}
}

let player: FakeTwitchPlayer;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: TwitchPlayerController;

beforeEach(async () => {
	vi.stubGlobal('Twitch', { Player });

	player = new FakeTwitchPlayer();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new TwitchPlayerController(
		createTestLogger(),
		player as unknown as Twitch.Player,
		options,
	);
	await controller.attach('1234567890');
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('events', () => {
	it('should report loaded with the player video on READY', () => {
		player.emit(Player.READY);

		expect(options.onLoaded).toHaveBeenCalledWith({ id: 'v1234567890' });
	});

	it.each([
		[Player.PLAYING, 'onPlay'],
		[Player.PAUSE, 'onPause'],
		[Player.ENDED, 'onEnded'],
		[Player.SEEK, 'onTimeUpdate'],
	] as const)('%s should call %s', (event, callback) => {
		player.emit(event);

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});
});

describe('commands', () => {
	it('should load from the beginning', async () => {
		await controller.loadVideo('987');

		expect(player.setVideo).toHaveBeenCalledWith('987', 0);
	});

	it('should forward commands and getters', async () => {
		await controller.play();
		await controller.pause();
		await controller.setCurrentTime(30);
		await controller.setVolume(0.5);
		await controller.setMuted(true);

		expect(player.play).toHaveBeenCalled();
		expect(player.pause).toHaveBeenCalled();
		expect(player.seek).toHaveBeenCalledWith(30);
		expect(await controller.getVolume()).toBe(0.5);
		expect(await controller.getMuted()).toBe(true);
		expect(await controller.getDuration()).toBe(3600);
		expect(await controller.getCurrentTime()).toBe(60);
	});

	it.each([
		['setPlaybackRate', false],
		['getPlaybackRate', false],
	] as const)('supports(%s) should be %s', (command, expected) => {
		expect(controller.supports(command)).toBe(expected);
	});
});
