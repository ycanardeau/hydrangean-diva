import { NiconicoPlayerController } from '@/controllers/NiconicoPlayerController';
import type { PlayerOptions } from '@/controllers/PlayerController';
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

const origin = 'https://embed.nicovideo.jp';

let iframe: HTMLIFrameElement;
let options: { [K in keyof Required<PlayerOptions>]: Mock };
let controller: NiconicoPlayerController;

function send(data: unknown, messageOrigin = origin): void {
	window.dispatchEvent(
		new MessageEvent('message', { origin: messageOrigin, data }),
	);
}

beforeEach(async () => {
	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);

	options = {
		onError: vi.fn(),
		onLoaded: vi.fn(),
		onPlay: vi.fn(),
		onPause: vi.fn(),
		onEnded: vi.fn(),
		onTimeUpdate: vi.fn(),
	};
	controller = new NiconicoPlayerController(
		createTestLogger(),
		iframe,
		options,
	);
	await controller.attach();
});

afterEach(async () => {
	await controller.detach();
	iframe.remove();
});

describe('messages', () => {
	it('should ignore messages from other origins', () => {
		send(
			{ eventName: 'statusChange', data: { playerStatus: 2 } },
			'https://evil.example.com',
		);

		expect(options.onPlay).not.toHaveBeenCalled();
	});

	it.each([
		[2, 'onPlay'],
		[3, 'onPause'],
		[4, 'onEnded'],
	] as const)('statusChange %s should call %s', (playerStatus, callback) => {
		send({ eventName: 'statusChange', data: { playerStatus } });

		expect(options[callback]).toHaveBeenCalledTimes(1);
	});

	it('should not treat playerStatusChange as play/pause', () => {
		send({ eventName: 'playerStatusChange', data: { playerStatus: 2 } });

		expect(options.onPlay).not.toHaveBeenCalled();
	});

	it('should report time in seconds from playerMetadataChange', async () => {
		send({
			eventName: 'playerMetadataChange',
			data: {
				currentTime: 30_000,
				duration: 120_000,
				volume: 0.5,
				muted: true,
			},
		});

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 120,
			percent: 0.25,
			seconds: 30,
		});
		expect(await controller.getCurrentTime()).toBe(30);
		expect(await controller.getDuration()).toBe(120);
		expect(await controller.getVolume()).toBe(0.5);
		expect(await controller.getMuted()).toBe(true);
	});

	it('should keep the previous duration when metadata omits it', async () => {
		send({
			eventName: 'loadComplete',
			data: { videoInfo: { watchId: 'sm9', lengthInSeconds: 320 } },
		});

		send({
			eventName: 'playerMetadataChange',
			data: { currentTime: 32_000, volume: 1, muted: false },
		});

		expect(await controller.getDuration()).toBe(320);
		expect(options.onTimeUpdate).toHaveBeenLastCalledWith({
			duration: 320,
			percent: 0.1,
			seconds: 32,
		});
	});

	it('should report 0 percent before the duration is known', () => {
		send({
			eventName: 'playerMetadataChange',
			data: { currentTime: 5_000, volume: 1, muted: false },
		});

		expect(options.onTimeUpdate).toHaveBeenCalledWith({
			duration: 0,
			percent: 0,
			seconds: 5,
		});
	});

	it('should report loaded with the watch id from loadComplete', async () => {
		send({
			eventName: 'loadComplete',
			data: { videoInfo: { watchId: 'sm9', lengthInSeconds: 320 } },
		});

		expect(options.onLoaded).toHaveBeenCalledWith({ id: 'sm9' });
		expect(await controller.getDuration()).toBe(320);
	});

	it.each(['error', 'player-error:video:play', 'player-error:video:seek'])(
		'%s should call onError',
		(eventName) => {
			const data = { eventName, data: { message: 'boom' } };

			send(data);

			expect(options.onError).toHaveBeenCalledWith(data);
		},
	);

	it('should ignore unknown events', () => {
		send({ eventName: 'somethingNew', data: {} });

		for (const callback of Object.values(options)) {
			expect(callback).not.toHaveBeenCalled();
		}
	});

	it('should stop listening after detach', async () => {
		await controller.detach();

		send({ eventName: 'statusChange', data: { playerStatus: 2 } });

		expect(options.onPlay).not.toHaveBeenCalled();

		await controller.attach();
	});
});

describe('loadVideo', () => {
	it('should point the iframe at the embed URL and resolve once it loads', async () => {
		let resolved = false;
		const promise = controller.loadVideo('sm1234').then(() => {
			resolved = true;
		});

		expect(iframe.src).toBe(
			'https://embed.nicovideo.jp/watch/sm1234?jsapi=1&playerId=1',
		);
		await Promise.resolve();
		expect(resolved).toBe(false);

		iframe.onload?.(new Event('load'));
		await promise;

		expect(resolved).toBe(true);
		expect(iframe.onload).toBeNull();
	});

	it('should reset cached state', async () => {
		send({
			eventName: 'playerMetadataChange',
			data: {
				currentTime: 30_000,
				duration: 120_000,
				volume: 0.5,
				muted: true,
			},
		});

		const promise = controller.loadVideo('sm1234');
		iframe.onload?.(new Event('load'));
		await promise;

		expect(await controller.getCurrentTime()).toBe(0);
		expect(await controller.getDuration()).toBe(0);
		expect(await controller.getVolume()).toBe(0);
		expect(await controller.getMuted()).toBe(false);
	});
});

describe('commands', () => {
	let postMessage: Mock;

	beforeEach(() => {
		postMessage = vi.fn();
		vi.spyOn(iframe, 'contentWindow', 'get').mockReturnValue({
			postMessage,
		} as unknown as Window);
	});

	it.each([
		['play', [], { eventName: 'play' }],
		['pause', [], { eventName: 'pause' }],
		[
			'setCurrentTime',
			[12.5],
			{ eventName: 'seek', data: { time: 12_500 } },
		],
		[
			'setVolume',
			[0.4],
			{ eventName: 'volumeChange', data: { volume: 0.4 } },
		],
		['setMuted', [true], { eventName: 'mute', data: { mute: true } }],
	] as const)('%s should post %j', async (command, args, message) => {
		await (controller[command] as (...a: unknown[]) => Promise<void>)(
			...args,
		);

		expect(postMessage).toHaveBeenCalledWith(
			{ ...message, playerId: '1', sourceConnectorType: 1 },
			origin,
		);
	});

	it.each([
		['setPlaybackRate', false],
		['getPlaybackRate', false],
		['setMuted', true],
		['getMuted', true],
	] as const)('supports(%s) should be %s', (command, expected) => {
		expect(controller.supports(command)).toBe(expected);
	});
});
