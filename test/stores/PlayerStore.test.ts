import { PlayerStore } from '@/stores/PlayerStore';
import { beforeEach, describe, expect, it } from 'vitest';

let playerStore: PlayerStore;

beforeEach(() => {
	playerStore = new PlayerStore();
});

describe('constructor', () => {
	it('should construct PlayerStore', () => {
		expect(playerStore).toBeDefined();
		expect(playerStore.playing).toBe(false);
		expect(playerStore.percent).toBe(0);
		expect(playerStore.seeking).toBe(false);
	});
});

describe('setPlaying', () => {
	it('should set playing', () => {
		expect(playerStore.playing).toBe(false);

		playerStore.setPlaying(true);

		expect(playerStore.playing).toBe(true);
	});
});

describe('setPercent', () => {
	it('should set percent', () => {
		expect(playerStore.percent).toBe(0);

		playerStore.setPercent(100);

		expect(playerStore.percent).toBe(100);
	});
});

describe('setSeeking', () => {
	it('should set seeking', () => {
		expect(playerStore.seeking).toBe(false);

		playerStore.setSeeking(true);

		expect(playerStore.seeking).toBe(true);
	});
});

describe('onPlay', () => {
	it('should set playing to true', () => {
		expect(playerStore.playing).toBe(false);

		playerStore.onPlay();

		expect(playerStore.playing).toBe(true);
	});
});

describe('onPause', () => {
	it('should set playing to false', () => {
		expect(playerStore.playing).toBe(false);

		playerStore.onPlay();

		expect(playerStore.playing).toBe(true);

		playerStore.onPause();

		expect(playerStore.playing).toBe(false);
	});
});

describe('onEnded', () => {
	it('should set playing to false', () => {
		expect(playerStore.playing).toBe(false);

		playerStore.onPlay();

		expect(playerStore.playing).toBe(true);

		playerStore.onEnded();

		expect(playerStore.playing).toBe(false);
	});
});

describe('onTimeUpdate', () => {
	it('should set percent when not seeking', () => {
		expect(playerStore.seeking).toBe(false);

		playerStore.onTimeUpdate({ duration: 100, percent: 100, seconds: 100 });

		expect(playerStore.percent).toBe(100);
	});

	it('should not set percent when seeking', () => {
		expect(playerStore.seeking).toBe(false);

		playerStore.setSeeking(true);

		expect(playerStore.seeking).toBe(true);

		playerStore.onTimeUpdate({ duration: 100, percent: 100, seconds: 100 });

		expect(playerStore.percent).toBe(0);
	});
});
