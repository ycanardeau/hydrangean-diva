import type { PlayerOptions } from '@/controllers/PlayerController';
import { SoundCloudPlayerController } from '@/controllers/SoundCloudPlayerController';
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

const Events = {
	ERROR: 'error',
	FINISH: 'finish',
	PAUSE: 'pause',
	PLAY: 'play',
	READY: 'ready',
	PLAY_PROGRESS: 'playProgress',
};

const URL = 'https://soundcloud.com/tamtamsound/mojito';

class FakeWidget {
	listeners = new Map<string, (e: any) => void>();
	duration = 240_000;
	position = 0;
	volume = 100;

	bind = vi.fn((eventName: string, listener: (e: any) => void) => {
		this.listeners.set(eventName, listener);
	});
	unbind = vi.fn((eventName: string) => {
		this.listeners.delete(eventName);
	});
	load = vi.fn((_url: string, options: SC.SoundCloudLoadOptions) => {
		options.callback?.();
	});
	play = vi.fn();
	pause = vi.fn();
	seekTo = vi.fn();
	setVolume = vi.fn((volume: number) => {
		this.volume = volume;
	});
	getDuration = vi.fn((callback: (d: number) => void) =>
		callback(this.duration),
	);
	getPosition = vi.fn((callback: (p: number) => void) =>
		callback(this.position),
	);
	getVolume = vi.fn((callback: (v: number) => void) => callback(this.volume));

	emit(eventName: string, e?: unknown): void {
		this.listeners.get(eventName)?.(e);
	}
}

let widget: FakeWidget;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: SoundCloudPlayerController;

async function attach(): Promise<void> {
	const promise = controller.attach(URL);
	widget.emit(Events.READY);
	await promise;
}

beforeEach(() => {
	vi.stubGlobal('SC', { Widget: { Events } });

	widget = new FakeWidget();
	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new SoundCloudPlayerController(
		createTestLogger(),
		widget as unknown as SC.SoundCloudWidget,
		options,
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('attach', () => {
	it('should wait for READY and then report loaded', async () => {
		let resolved = false;
		void controller.attach(URL).then(() => (resolved = true));
		await Promise.resolve();

		expect(resolved).toBe(false);
		expect(options.onLoaded).not.toHaveBeenCalled();

		widget.emit(Events.READY);
		await Promise.resolve();

		expect(resolved).toBe(true);
		expect(options.onLoaded).toHaveBeenCalledWith({ id: URL });
	});
});

describe('events', () => {
	beforeEach(attach);

	it('should report progress in seconds', async () => {
		widget.emit(Events.PLAY_PROGRESS, { currentPosition: 60_000 });
		await vi.waitFor(() => expect(options.onTimeUpdate).toHaveBeenCalled());

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 240,
			percent: 0.25,
			seconds: 60,
		});
	});

	it.each([
		[Events.PLAY, 'onPlay'],
		[Events.PAUSE, 'onPause'],
		[Events.FINISH, 'onEnded'],
	] as const)('%s should call %s', (event, callback) => {
		widget.emit(event);

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});

	it('should forward errors', () => {
		const error = { message: 'boom' };
		widget.emit(Events.ERROR, error);

		expect(options.onError).toHaveBeenCalledWith(error);
	});

	it('should unbind every event on detach', async () => {
		await controller.detach();

		expect(widget.listeners.size).toBe(0);
		for (const event of Object.values(Events)) {
			expect(widget.unbind).toHaveBeenCalledWith(event);
		}
	});
});

describe('commands', () => {
	beforeEach(attach);

	it('should load with autoplay and report loaded', async () => {
		options.onLoaded.mockClear();
		const next = 'https://soundcloud.com/someone/another';

		await controller.loadVideo(next);

		expect(widget.load).toHaveBeenCalledWith(
			next,
			expect.objectContaining({ auto_play: true }),
		);
		expect(options.onLoaded).toHaveBeenCalledWith({ id: next });
	});

	it('should play and pause', async () => {
		await controller.play();
		await controller.pause();

		expect(widget.play).toHaveBeenCalledTimes(1);
		expect(widget.pause).toHaveBeenCalledTimes(1);
	});

	it('should seek in milliseconds', async () => {
		await controller.setCurrentTime(12.5);

		expect(widget.seekTo).toHaveBeenCalledWith(12_500);
	});

	it('should scale volume between 0..1 and 0..100', async () => {
		await controller.setVolume(0.7);

		expect(widget.setVolume).toHaveBeenCalledWith(70);
		expect(await controller.getVolume()).toBeCloseTo(0.7);
	});

	it('should convert getters to seconds', async () => {
		widget.position = 30_000;

		expect(await controller.getDuration()).toBe(240);
		expect(await controller.getCurrentTime()).toBe(30);
	});

	it.each([
		['setMuted', false],
		['getMuted', false],
		['setPlaybackRate', false],
		['getPlaybackRate', false],
		['setVolume', true],
		['getVolume', true],
	] as const)('supports(%s) should be %s', (command, expected) => {
		expect(controller.supports(command)).toBe(expected);
	});
});
