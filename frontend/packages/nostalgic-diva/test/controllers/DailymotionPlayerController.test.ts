import { DailymotionPlayerController } from '@/controllers/DailymotionPlayerController';
import type { PlayerOptions } from '@/controllers/PlayerController';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

class FakeDailymotionPlayer {
	listeners = new Map<string, Set<(e: { type: string }) => void>>();
	duration = 100;
	currentTime = 0;
	volume = 1;
	muted = false;
	video = { videoId: 'x7tgad0' };

	addEventListener = vi.fn(
		(event: string, listener: (e: { type: string }) => void) => {
			if (!this.listeners.has(event))
				this.listeners.set(event, new Set());
			this.listeners.get(event)!.add(listener);
		},
	);
	removeEventListener = vi.fn(
		(event: string, listener: (e: { type: string }) => void) => {
			this.listeners.get(event)?.delete(listener);
		},
	);
	load = vi.fn();
	play = vi.fn();
	pause = vi.fn();
	seek = vi.fn();
	setVolume = vi.fn();
	setMuted = vi.fn();

	emit(type: string): void {
		for (const listener of this.listeners.get(type) ?? []) {
			listener({ type });
		}
	}

	get listenerCount(): number {
		let count = 0;
		for (const set of this.listeners.values()) count += set.size;
		return count;
	}
}

let player: FakeDailymotionPlayer;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: DailymotionPlayerController;

beforeEach(async () => {
	player = new FakeDailymotionPlayer();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new DailymotionPlayerController(
		createTestLogger(),
		player as unknown as DM.player,
		options,
	);
	await controller.attach('x7tgad0');
});

describe('events', () => {
	it('should report loaded with the player video id on apiready', () => {
		player.emit('apiready');

		expect(options.onLoaded).toHaveBeenCalledWith({ id: 'x7tgad0' });
	});

	it.each([
		['playing', 'onPlay'],
		['pause', 'onPause'],
		['video_end', 'onEnded'],
		['error', 'onError'],
	] as const)('%s should call %s', (event, callback) => {
		player.emit(event);

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});

	it('should report the time after seeking', () => {
		player.currentTime = 25;

		player.emit('seeked');

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 100,
			percent: 0.25,
			seconds: 25,
		});
	});

	it('should remove every listener on detach', async () => {
		expect(player.listenerCount).toBeGreaterThan(0);

		await controller.detach();

		expect(player.listenerCount).toBe(0);
	});
});

describe('commands', () => {
	it('should forward commands', async () => {
		await controller.loadVideo('x0000');
		await controller.play();
		await controller.pause();
		await controller.setCurrentTime(10);
		await controller.setVolume(0.5);
		await controller.setMuted(true);

		expect(player.load).toHaveBeenCalledWith('x0000');
		expect(player.play).toHaveBeenCalled();
		expect(player.pause).toHaveBeenCalled();
		expect(player.seek).toHaveBeenCalledWith(10);
		expect(player.setVolume).toHaveBeenCalledWith(0.5);
		expect(player.setMuted).toHaveBeenCalledWith(true);
	});

	it('should read player properties', async () => {
		player.currentTime = 12;
		player.volume = 0.4;
		player.muted = true;

		expect(await controller.getDuration()).toBe(100);
		expect(await controller.getCurrentTime()).toBe(12);
		expect(await controller.getVolume()).toBe(0.4);
		expect(await controller.getMuted()).toBe(true);
	});

	it.each([
		['setPlaybackRate', false],
		['getPlaybackRate', false],
		['setMuted', true],
	] as const)('supports(%s) should be %s', (command, expected) => {
		expect(controller.supports(command)).toBe(expected);
	});
});
