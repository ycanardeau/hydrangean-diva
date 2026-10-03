import { type ILogger, LogLevel } from '@/controllers/Logger';
import { nullPlayerController } from '@/controllers/NullPlayerController';
import {
	type IPlayerCommands,
	PlayerController,
	type PlayerOptions,
} from '@/controllers/PlayerController';
import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestLogger } from '../testLogger';

interface FakePlayer {
	name: string;
}

const calls: unknown[][] = [];

class FullImpl extends PlayerControllerImpl<FakePlayer> {
	async attach(id: string): Promise<void> {
		calls.push(['attach', id]);
	}
	async detach(): Promise<void> {
		calls.push(['detach']);
	}
	async loadVideo(id: string): Promise<void> {
		calls.push(['loadVideo', id]);
	}
	async play(): Promise<void> {
		calls.push(['play']);
	}
	async pause(): Promise<void> {
		calls.push(['pause']);
	}
	async setCurrentTime(seconds: number): Promise<void> {
		calls.push(['setCurrentTime', seconds]);
	}
	async setVolume(volume: number): Promise<void> {
		calls.push(['setVolume', volume]);
	}
	async setMuted(muted: boolean): Promise<void> {
		calls.push(['setMuted', muted]);
	}
	async setPlaybackRate(playbackRate: number): Promise<void> {
		calls.push(['setPlaybackRate', playbackRate]);
	}
	async getDuration(): Promise<number> {
		return 100;
	}
	async getCurrentTime(): Promise<number> {
		return 42;
	}
	async getVolume(): Promise<number> {
		return 0.5;
	}
	async getMuted(): Promise<boolean> {
		return true;
	}
	async getPlaybackRate(): Promise<number> {
		return 1.5;
	}
}

class MinimalImpl extends PlayerControllerImpl<FakePlayer> {
	async attach(): Promise<void> {}
	async detach(): Promise<void> {}
	loadVideo = undefined;
	play = undefined;
	pause = undefined;
	setCurrentTime = undefined;
	setVolume = undefined;
	setMuted = undefined;
	setPlaybackRate = undefined;
	getDuration = undefined;
	getCurrentTime = undefined;
	getVolume = undefined;
	getMuted = undefined;
	getPlaybackRate = undefined;
}

const commands: (keyof IPlayerCommands)[] = [
	'loadVideo',
	'play',
	'pause',
	'setCurrentTime',
	'setVolume',
	'setMuted',
	'setPlaybackRate',
	'getDuration',
	'getCurrentTime',
	'getVolume',
	'getMuted',
	'getPlaybackRate',
];

const args: Record<keyof IPlayerCommands, unknown[]> = {
	loadVideo: ['abc'],
	play: [],
	pause: [],
	setCurrentTime: [10],
	setVolume: [0.25],
	setMuted: [true],
	setPlaybackRate: [2],
	getDuration: [],
	getCurrentTime: [],
	getVolume: [],
	getMuted: [],
	getPlaybackRate: [],
};

// Most commands throw synchronously while `loadVideo` (being `async`) rejects;
// normalize both into a rejected promise.
async function invoke(
	controller: PlayerController<FakePlayer, PlayerControllerImpl<FakePlayer>>,
	command: keyof IPlayerCommands,
): Promise<unknown> {
	return (controller[command] as (...a: unknown[]) => Promise<unknown>)(
		...args[command],
	);
}

let logger: ReturnType<typeof createTestLogger>;
const player: FakePlayer = { name: 'fake' };

beforeEach(() => {
	calls.length = 0;
	logger = createTestLogger();
});

function create(
	factory: new (
		logger: ILogger,
		player: FakePlayer,
		options: PlayerOptions | undefined,
	) => PlayerControllerImpl<FakePlayer> = FullImpl,
	options?: PlayerOptions,
): PlayerController<FakePlayer, PlayerControllerImpl<FakePlayer>> {
	return new PlayerController(logger, 'Fake', player, options, factory);
}

describe('attach', () => {
	it('should construct the impl with logger, player and options and attach it', async () => {
		const options: PlayerOptions = { onPlay: vi.fn() };
		const factory = vi.fn(function (this: unknown, ...a: unknown[]) {
			return new (FullImpl as any)(...a);
		});

		const controller = new PlayerController(
			logger,
			'Fake',
			player,
			options,
			factory as any,
		);
		await controller.attach('video1');

		expect(factory).toHaveBeenCalledTimes(1);
		expect(factory).toHaveBeenCalledWith(logger, player, options);
		expect(calls).toEqual([['attach', 'video1']]);
	});

	it('should ignore a second attach', async () => {
		const controller = create();

		await controller.attach('video1');
		await controller.attach('video2');

		expect(calls).toEqual([['attach', 'video1']]);
	});

	it('should allow re-attaching after detach', async () => {
		const controller = create();

		await controller.attach('video1');
		await controller.detach();
		await controller.attach('video2');

		expect(calls).toEqual([
			['attach', 'video1'],
			['detach'],
			['attach', 'video2'],
		]);
	});

	it('should prefix log messages with the type and a unique id', async () => {
		const a = create();
		const b = create();

		await a.attach('x');
		await b.attach('y');

		const messages = logger.log.mock.calls
			.filter(([level]) => level === LogLevel.Debug)
			.map(([, message]) => message as string)
			.filter((message) => message.endsWith(' attach'));

		expect(messages).toHaveLength(2);
		expect(messages[0]).toMatch(/^Fake#\d+ attach$/);
		expect(messages[1]).toMatch(/^Fake#\d+ attach$/);
		expect(messages[0]).not.toBe(messages[1]);
	});
});

describe('detach', () => {
	it('should reject when not attached', async () => {
		const controller = create();

		await expect(controller.detach()).rejects.toThrow(
			'player is not attached',
		);
		expect(logger.log).toHaveBeenCalledWith(
			LogLevel.Error,
			expect.stringContaining('player is not attached'),
		);
	});

	it('should reject on a second detach', async () => {
		const controller = create();

		await controller.attach('video1');
		await controller.detach();

		await expect(controller.detach()).rejects.toThrow(
			'player is not attached',
		);
	});
});

describe.each(commands)('%s', (command) => {
	it('should fail when not attached', async () => {
		const controller = create();

		await expect(invoke(controller, command)).rejects.toThrow(
			'player is not attached',
		);
	});

	it('should fail when not supported by the impl', async () => {
		const controller = create(MinimalImpl);
		await controller.attach('video1');

		await expect(invoke(controller, command)).rejects.toThrow(
			`${command} is not supported`,
		);
	});

	it('should fail after detach', async () => {
		const controller = create();
		await controller.attach('video1');
		await controller.detach();

		await expect(invoke(controller, command)).rejects.toThrow(
			'player is not attached',
		);
	});
});

describe('commands', () => {
	it('should forward setters to the impl', async () => {
		const controller = create();
		await controller.attach('video1');
		calls.length = 0;

		await controller.loadVideo('video2');
		await controller.play();
		await controller.pause();
		await controller.setCurrentTime(10);
		await controller.setVolume(0.25);
		await controller.setMuted(true);
		await controller.setPlaybackRate(2);

		expect(calls).toEqual([
			['loadVideo', 'video2'],
			['play'],
			['pause'],
			['setCurrentTime', 10],
			['setVolume', 0.25],
			['setMuted', true],
			['setPlaybackRate', 2],
		]);
	});

	it('should return values from the impl getters', async () => {
		const controller = create();
		await controller.attach('video1');

		expect(await controller.getDuration()).toBe(100);
		expect(await controller.getCurrentTime()).toBe(42);
		expect(await controller.getVolume()).toBe(0.5);
		expect(await controller.getMuted()).toBe(true);
		expect(await controller.getPlaybackRate()).toBe(1.5);
	});
});

describe('supports', () => {
	it('should throw when not attached', () => {
		const controller = create();

		expect(() => controller.supports('play')).toThrow(
			'player is not attached',
		);
	});

	it.each(commands)('should report %s as supported', async (command) => {
		const controller = create(FullImpl);
		await controller.attach('video1');

		expect(controller.supports(command)).toBe(true);
	});

	it.each(commands)('should report %s as unsupported', async (command) => {
		const controller = create(MinimalImpl);
		await controller.attach('video1');

		expect(controller.supports(command)).toBe(false);
	});
});

describe('nullPlayerController', () => {
	it('should be a harmless no-op', async () => {
		await expect(nullPlayerController.loadVideo('x')).resolves.toBe(
			undefined,
		);
		await expect(nullPlayerController.play()).resolves.toBe(undefined);
		await expect(nullPlayerController.pause()).resolves.toBe(undefined);
		await expect(nullPlayerController.getDuration()).resolves.toBe(0);
		await expect(nullPlayerController.getCurrentTime()).resolves.toBe(0);
		await expect(nullPlayerController.getVolume()).resolves.toBe(0);
		await expect(nullPlayerController.getMuted()).resolves.toBe(false);
		await expect(nullPlayerController.getPlaybackRate()).resolves.toBe(0);
	});

	it.each(commands)('should not support %s', (command) => {
		expect(nullPlayerController.supports(command)).toBe(false);
	});
});
