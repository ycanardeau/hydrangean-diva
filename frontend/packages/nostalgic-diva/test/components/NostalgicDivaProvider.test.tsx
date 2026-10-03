import {
	NostalgicDivaProvider,
	useNostalgicDiva,
} from '@/components/NostalgicDivaProvider';
import type { IPlayerController } from '@/controllers/PlayerController';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '../render';
import { createTestLogger } from '../testLogger';

type Diva = ReturnType<typeof useNostalgicDiva>;

function createFakeController(): IPlayerController & {
	calls: unknown[][];
} {
	const calls: unknown[][] = [];
	const record =
		(name: string) =>
		async (...args: unknown[]): Promise<void> => {
			calls.push([name, ...args]);
		};
	return {
		calls,
		loadVideo: record('loadVideo'),
		play: record('play'),
		pause: record('pause'),
		setCurrentTime: record('setCurrentTime'),
		setVolume: record('setVolume'),
		setMuted: record('setMuted'),
		setPlaybackRate: record('setPlaybackRate'),
		getDuration: async () => 100,
		getCurrentTime: async () => 10,
		getVolume: async () => 0.5,
		getMuted: async () => true,
		getPlaybackRate: async () => 1.5,
		supports: vi.fn(() => true),
	};
}

let captured: Diva[];

function Capture(): ReactElement {
	captured.push(useNostalgicDiva());
	return <></>;
}

beforeEach(() => {
	captured = [];
});

describe('NostalgicDivaProvider', () => {
	it('should be a no-op before any controller is registered', async () => {
		await render(
			<NostalgicDivaProvider logger={createTestLogger()}>
				<Capture />
			</NostalgicDivaProvider>,
		);
		const diva = captured.at(-1)!;

		await expect(diva.play()).resolves.toBeUndefined();
		await expect(diva.getDuration()).resolves.toBe(0);
		expect(diva.supports('play')).toBe(false);
	});

	it('should delegate to the registered controller', async () => {
		await render(
			<NostalgicDivaProvider logger={createTestLogger()}>
				<Capture />
			</NostalgicDivaProvider>,
		);
		const diva = captured.at(-1)!;
		const controller = createFakeController();

		diva.handleControllerChange(controller);

		await diva.loadVideo('x');
		await diva.play();
		await diva.pause();
		await diva.setVolume(0.2);
		await diva.setMuted(true);
		await diva.setPlaybackRate(2);

		expect(controller.calls).toEqual([
			['loadVideo', 'x'],
			['play'],
			['pause'],
			['setVolume', 0.2],
			['setMuted', true],
			['setPlaybackRate', 2],
		]);
		expect(await diva.getDuration()).toBe(100);
		expect(await diva.getCurrentTime()).toBe(10);
		expect(await diva.getVolume()).toBe(0.5);
		expect(await diva.getMuted()).toBe(true);
		expect(await diva.getPlaybackRate()).toBe(1.5);
		expect(diva.supports('pause')).toBe(true);
		expect(controller.supports).toHaveBeenCalledWith('pause');
	});

	it('should resume playback after seeking', async () => {
		await render(
			<NostalgicDivaProvider logger={createTestLogger()}>
				<Capture />
			</NostalgicDivaProvider>,
		);
		const diva = captured.at(-1)!;
		const controller = createFakeController();
		diva.handleControllerChange(controller);

		await diva.setCurrentTime(42);

		expect(controller.calls).toEqual([['setCurrentTime', 42], ['play']]);
	});

	it('should always use the latest controller', async () => {
		await render(
			<NostalgicDivaProvider logger={createTestLogger()}>
				<Capture />
			</NostalgicDivaProvider>,
		);
		const diva = captured.at(-1)!;
		const first = createFakeController();
		const second = createFakeController();

		diva.handleControllerChange(first);
		diva.handleControllerChange(second);
		await diva.play();

		expect(first.calls).toEqual([]);
		expect(second.calls).toEqual([['play']]);
	});

	// `NostalgicDiva` derives its `onControllerChange` from the context value,
	// and `PlayerContainer` re-attaches whenever that changes, so the value
	// must be stable across re-renders.
	it('should keep the context value stable across re-renders', async () => {
		const logger = createTestLogger();
		const { rerender } = await render(
			<NostalgicDivaProvider logger={logger}>
				<Capture />
			</NostalgicDivaProvider>,
		);

		await rerender(
			<NostalgicDivaProvider logger={logger}>
				<Capture />
			</NostalgicDivaProvider>,
		);

		expect(captured.length).toBeGreaterThanOrEqual(2);
		expect(captured.at(-1)).toBe(captured[0]);
	});
});
