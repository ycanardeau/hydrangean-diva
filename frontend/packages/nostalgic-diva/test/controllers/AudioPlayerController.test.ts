import { AudioPlayerController } from '@/controllers/AudioPlayerController';
import type { PlayerOptions } from '@/controllers/PlayerController';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

let audio: HTMLAudioElement;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: AudioPlayerController;

beforeEach(async () => {
	audio = document.createElement('audio');
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new AudioPlayerController(createTestLogger(), audio, options);
	await controller.attach();
});

describe('events', () => {
	it('should report loaded with the current src', () => {
		audio.src = 'https://example.com/audio.mp3';

		audio.dispatchEvent(new Event('loadeddata'));

		expect(options.onLoaded).toHaveBeenCalledWith({
			id: 'https://example.com/audio.mp3',
		});
	});

	it.each([
		['play', 'onPlay'],
		['pause', 'onPause'],
		['ended', 'onEnded'],
	] as const)('%s should call %s', (event, callback) => {
		audio.dispatchEvent(new Event(event));

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});

	it('should forward errors', () => {
		const event = new Event('error');
		audio.dispatchEvent(event);

		expect(options.onError).toHaveBeenCalledWith(event);
	});

	it('should report time updates', () => {
		Object.defineProperty(audio, 'duration', { value: 200 });
		audio.currentTime = 50;

		audio.dispatchEvent(new Event('timeupdate'));

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 200,
			percent: 0.25,
			seconds: 50,
		});
	});

	it('should stop reporting after detach', async () => {
		await controller.detach();

		for (const event of [
			'loadeddata',
			'play',
			'pause',
			'ended',
			'error',
			'timeupdate',
		]) {
			audio.dispatchEvent(new Event(event));
		}

		for (const callback of Object.values(options)) {
			expect(callback).not.toHaveBeenCalled();
		}
	});
});

describe('commands', () => {
	it('should load by setting src', async () => {
		await controller.loadVideo('https://example.com/other.mp3');

		expect(audio.src).toBe('https://example.com/other.mp3');
	});

	it('should play and pause the element', async () => {
		const play = vi.spyOn(audio, 'play').mockResolvedValue();
		const pause = vi.spyOn(audio, 'pause').mockImplementation(() => {});

		await controller.play();
		await controller.pause();

		expect(play).toHaveBeenCalledTimes(1);
		expect(pause).toHaveBeenCalledTimes(1);
	});

	it('should propagate a rejected play() (e.g. autoplay policy)', async () => {
		const error = new DOMException('blocked', 'NotAllowedError');
		vi.spyOn(audio, 'play').mockRejectedValue(error);

		await expect(controller.play()).rejects.toBe(error);
	});

	it('should set and get element properties', async () => {
		await controller.setCurrentTime(12);
		await controller.setVolume(0.3);
		await controller.setMuted(true);
		await controller.setPlaybackRate(1.25);

		expect(await controller.getCurrentTime()).toBe(12);
		expect(await controller.getVolume()).toBe(0.3);
		expect(await controller.getMuted()).toBe(true);
		expect(await controller.getPlaybackRate()).toBe(1.25);
	});
});
