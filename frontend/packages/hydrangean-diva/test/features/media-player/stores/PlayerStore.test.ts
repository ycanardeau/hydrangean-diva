import { PlayerStore } from '@/features/media-player.player/stores/PlayerStore';
import { beforeEach, describe, expect, it } from 'vitest';

let player: PlayerStore;

beforeEach(() => {
	player = new PlayerStore();
});

describe('constructor', () => {
	it('should construct PlayerStore', () => {
		expect(player).toBeDefined();
		expect(player.playing).toBe(false);
		expect(player.percent).toBe(0);
		expect(player.seeking).toBe(false);
	});
});

describe('setPlaying', () => {
	it('should set playing', () => {
		player.setPlaying(true);

		expect(player.playing).toBe(true);
	});
});

describe('setPercent', () => {
	it('should set percent', () => {
		player.setPercent(100);

		expect(player.percent).toBe(100);
	});
});

describe('setSeeking', () => {
	it('should set seeking', () => {
		player.setSeeking(true);

		expect(player.seeking).toBe(true);
	});
});

describe('onPlay', () => {
	it('should set playing to true', () => {
		player.onPlay();

		expect(player.playing).toBe(true);
	});
});

describe('onPause', () => {
	it('should set playing to false', () => {
		player.onPlay();

		expect(player.playing).toBe(true);

		player.onPause();

		expect(player.playing).toBe(false);
	});
});

describe('onEnded', () => {
	it('should set playing to false', () => {
		player.onPlay();

		expect(player.playing).toBe(true);

		player.onEnded();

		expect(player.playing).toBe(false);
	});
});

describe('onTimeUpdate', () => {
	it('should set percent when not seeking', () => {
		player.onTimeUpdate({ duration: 100, percent: 100, seconds: 100 });

		expect(player.percent).toBe(100);
	});

	it('should not set percent when seeking', () => {
		player.setSeeking(true);

		expect(player.seeking).toBe(true);

		player.onTimeUpdate({ duration: 100, percent: 100, seconds: 100 });

		expect(player.percent).toBe(0);
	});
});
