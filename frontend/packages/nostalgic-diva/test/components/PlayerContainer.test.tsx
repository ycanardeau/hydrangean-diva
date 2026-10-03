import { PlayerContainer } from '@/components/PlayerContainer';
import type { ILogger } from '@/controllers/Logger';
import { nullPlayerController } from '@/controllers/NullPlayerController';
import type {
	IPlayerController,
	PlayerOptions,
} from '@/controllers/PlayerController';
import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';
import type { MutableRefObject, ReactElement } from 'react';
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { flush, render } from '../render';
import { createTestLogger } from '../testLogger';

interface FakePlayer {
	element: HTMLDivElement;
	videoId: string;
}

const events: unknown[][] = [];
let attachGate: Promise<void> | undefined;

class FakeController extends PlayerControllerImpl<FakePlayer> {
	async attach(id: string): Promise<void> {
		events.push(['attach', id]);
		await attachGate;
	}
	async detach(): Promise<void> {
		events.push(['detach']);
	}
	async loadVideo(id: string): Promise<void> {
		events.push(['loadVideo', id]);
	}
	async play(): Promise<void> {
		events.push(['play']);
	}
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

let logger: ILogger;
let loadScript: Mock<() => Promise<void>>;
let playerFactory: Mock<
	(element: HTMLDivElement, videoId: string) => Promise<FakePlayer>
>;
let onControllerChange: Mock<(value: IPlayerController) => void>;
let children: Mock<
	(
		elementRef: MutableRefObject<HTMLDivElement>,
		videoId: string,
	) => ReactElement
>;
const defaultOptions: PlayerOptions = {};

beforeEach(() => {
	events.length = 0;
	attachGate = undefined;
	logger = createTestLogger();
	loadScript = vi.fn(async () => {
		events.push(['loadScript']);
	});
	playerFactory = vi.fn(
		async (
			element: HTMLDivElement,
			videoId: string,
		): Promise<FakePlayer> => {
			events.push(['playerFactory', videoId]);
			return { element, videoId };
		},
	);
	onControllerChange = vi.fn();
	children = vi.fn(
		(
			elementRef: MutableRefObject<HTMLDivElement>,
			videoId: string,
		): ReactElement => <div ref={elementRef} data-video-id={videoId} />,
	);
});

afterEach(() => {
	document.body.innerHTML = '';
});

function Container({
	videoId,
	options = defaultOptions,
}: {
	videoId: string;
	options?: PlayerOptions;
}): ReactElement {
	return (
		<PlayerContainer
			logger={logger}
			type="Fake"
			loadScript={loadScript}
			playerFactory={playerFactory}
			controllerFactory={FakeController}
			onControllerChange={onControllerChange}
			videoId={videoId}
			options={options}
		>
			{children}
		</PlayerContainer>
	);
}

function lastController(): IPlayerController {
	return onControllerChange.mock.calls.at(-1)![0];
}

describe('PlayerContainer', () => {
	it('should load the script, create the player and attach the controller in order', async () => {
		const { container } = await render(<Container videoId="v1" />);
		await flush();

		expect(events).toEqual([
			['loadScript'],
			['playerFactory', 'v1'],
			['attach', 'v1'],
		]);
		expect(playerFactory).toHaveBeenCalledWith(
			container.querySelector('[data-video-id]'),
			'v1',
		);
	});

	it('should work without loadScript', async () => {
		await render(
			<PlayerContainer
				logger={logger}
				type="Fake"
				loadScript={undefined}
				playerFactory={playerFactory}
				controllerFactory={FakeController}
				onControllerChange={onControllerChange}
				videoId="v1"
				options={defaultOptions}
			>
				{children}
			</PlayerContainer>,
		);
		await flush();

		expect(events).toEqual([
			['playerFactory', 'v1'],
			['attach', 'v1'],
		]);
	});

	it('should publish the controller only after attach completes', async () => {
		let release!: () => void;
		attachGate = new Promise((resolve) => (release = resolve));

		await render(<Container videoId="v1" />);
		await flush();

		expect(events).toContainEqual(['attach', 'v1']);
		expect(onControllerChange).not.toHaveBeenCalled();

		release();
		await flush();

		expect(onControllerChange).toHaveBeenCalledTimes(1);
		const controller = lastController();
		expect(controller).not.toBe(nullPlayerController);
		expect(controller.supports('play')).toBe(true);
		expect(controller.supports('pause')).toBe(false);

		await controller.play();
		expect(events.at(-1)).toEqual(['play']);
	});

	it('should not call loadVideo on the first mount', async () => {
		await render(<Container videoId="v1" />);
		await flush();

		expect(events).not.toContainEqual(['loadVideo', 'v1']);
	});

	it('should call loadVideo when videoId changes', async () => {
		const { rerender } = await render(<Container videoId="v1" />);
		await flush();

		await rerender(<Container videoId="v2" />);
		await flush();
		await rerender(<Container videoId="v3" />);
		await flush();

		expect(events.filter(([e]) => e === 'loadVideo')).toEqual([
			['loadVideo', 'v2'],
			['loadVideo', 'v3'],
		]);
		// The player is reused, not recreated.
		expect(playerFactory).toHaveBeenCalledTimes(1);
		expect(events.filter(([e]) => e === 'attach')).toHaveLength(1);
	});

	it('should keep passing the initial videoId to children', async () => {
		const { rerender, container } = await render(
			<Container videoId="v1" />,
		);
		await flush();

		await rerender(<Container videoId="v2" />);
		await flush();

		expect(
			container
				.querySelector('[data-video-id]')!
				.getAttribute('data-video-id'),
		).toBe('v1');
	});

	it('should load the latest videoId if it changes before attach completes', async () => {
		let release!: () => void;
		attachGate = new Promise((resolve) => (release = resolve));

		const { rerender } = await render(<Container videoId="v1" />);
		await flush();
		await rerender(<Container videoId="v2" />);
		await flush();

		release();
		await flush();

		expect(events.at(-1)).toEqual(['loadVideo', 'v2']);
	});

	it('should detach and publish nullPlayerController on unmount', async () => {
		const { unmount } = await render(<Container videoId="v1" />);
		await flush();

		await unmount();
		await flush();

		expect(events.at(-1)).toEqual(['detach']);
		expect(lastController()).toBe(nullPlayerController);
	});

	it('should reattach (but reuse the player) when options change', async () => {
		const { rerender } = await render(<Container videoId="v1" />);
		await flush();

		await rerender(
			<Container videoId="v1" options={{ onPlay: (): void => {} }} />,
		);
		await flush();

		expect(events.filter(([e]) => e !== 'loadScript')).toEqual([
			['playerFactory', 'v1'],
			['attach', 'v1'],
			['detach'],
			['attach', 'v1'],
		]);
		expect(lastController()).not.toBe(nullPlayerController);
	});

	// Known issue: if the container unmounts while `attach` is still pending,
	// the cleanup detaches and publishes `nullPlayerController`, but the
	// pending `attach` later publishes the (now detached) controller, which
	// then throws "player is not attached" on every command.
	it.fails(
		'should not publish a controller whose attach completes after unmount',
		async () => {
			let release!: () => void;
			attachGate = new Promise((resolve) => (release = resolve));

			const { unmount } = await render(<Container videoId="v1" />);
			await flush();

			await unmount();
			await flush();
			expect(lastController()).toBe(nullPlayerController);

			release();
			await flush();

			expect(lastController()).toBe(nullPlayerController);
		},
	);
});
