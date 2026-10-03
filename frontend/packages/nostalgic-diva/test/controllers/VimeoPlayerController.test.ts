import type { PlayerOptions } from '@/controllers/PlayerController';
import { VimeoPlayerController } from '@/controllers/VimeoPlayerController';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

class FakeVimeoPlayer {
	listeners = new Map<string, (data: any) => void>();
	resolveReady!: () => void;
	readyPromise = new Promise<void>((resolve) => {
		this.resolveReady = resolve;
	});

	ready = vi.fn(() => this.readyPromise);
	on = vi.fn((event: string, callback: (data: any) => void) => {
		this.listeners.set(event, callback);
	});
	off = vi.fn((event: string) => {
		this.listeners.delete(event);
	});
	loadVideo = vi.fn(async () => 0);
	play = vi.fn(async () => {});
	pause = vi.fn(async () => {});
	setCurrentTime = vi.fn(async (s: number) => s);
	setVolume = vi.fn(async (v: number) => v);
	setMuted = vi.fn(async (m: boolean) => m);
	setPlaybackRate = vi.fn(async (r: number) => r);
	getDuration = vi.fn(async () => 300);
	getCurrentTime = vi.fn(async () => 15);
	getVolume = vi.fn(async () => 0.8);
	getMuted = vi.fn(async () => true);
	getPlaybackRate = vi.fn(async () => 2);

	emit(event: string, data?: unknown): void {
		this.listeners.get(event)?.(data);
	}
}

let player: FakeVimeoPlayer;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: VimeoPlayerController;

beforeEach(() => {
	player = new FakeVimeoPlayer();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new VimeoPlayerController(
		createTestLogger(),
		player as unknown as Vimeo.Player,
		options,
	);
});

async function attach(): Promise<void> {
	player.resolveReady();
	await controller.attach();
}

describe('attach', () => {
	it('should wait for the player to be ready before binding events', async () => {
		const promise = controller.attach();
		await Promise.resolve();

		expect(player.on).not.toHaveBeenCalled();

		player.resolveReady();
		await promise;

		expect(player.on).toHaveBeenCalled();
	});
});

describe('events', () => {
	beforeEach(attach);

	it('should report loaded with a string id', () => {
		player.emit('loaded', { id: 76979871 });

		expect(options.onLoaded).toHaveBeenCalledWith({ id: '76979871' });
	});

	it.each([
		['play', 'onPlay'],
		['pause', 'onPause'],
		['ended', 'onEnded'],
	] as const)('%s should call %s', (event, callback) => {
		player.emit(event, {});

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});

	it('should forward errors', () => {
		const error = { name: 'PrivacyError', message: 'x', method: 'play' };
		player.emit('error', error);

		expect(options.onError).toHaveBeenCalledWith(error);
	});

	it('should forward time updates', () => {
		player.emit('timeupdate', { duration: 300, percent: 0.1, seconds: 30 });

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 300,
			percent: 0.1,
			seconds: 30,
		});
	});

	it('should unbind every event on detach', async () => {
		await controller.detach();

		expect(player.listeners.size).toBe(0);
	});
});

describe('commands', () => {
	beforeEach(attach);

	it('should forward setters', async () => {
		await controller.loadVideo('12345');
		await controller.play();
		await controller.pause();
		await controller.setCurrentTime(10);
		await controller.setVolume(0.5);
		await controller.setMuted(true);
		await controller.setPlaybackRate(1.5);

		expect(player.loadVideo).toHaveBeenCalledWith('12345');
		expect(player.play).toHaveBeenCalled();
		expect(player.pause).toHaveBeenCalled();
		expect(player.setCurrentTime).toHaveBeenCalledWith(10);
		expect(player.setVolume).toHaveBeenCalledWith(0.5);
		expect(player.setMuted).toHaveBeenCalledWith(true);
		expect(player.setPlaybackRate).toHaveBeenCalledWith(1.5);
	});

	it('should forward getters', async () => {
		expect(await controller.getDuration()).toBe(300);
		expect(await controller.getCurrentTime()).toBe(15);
		expect(await controller.getVolume()).toBe(0.8);
		expect(await controller.getMuted()).toBe(true);
		expect(await controller.getPlaybackRate()).toBe(2);
	});

	it('should propagate rejections', async () => {
		const error = new Error('PasswordError');
		player.play.mockRejectedValueOnce(error);

		await expect(controller.play()).rejects.toBe(error);
	});
});
