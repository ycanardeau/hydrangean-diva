import { NostalgicDiva } from '@/components/NostalgicDiva';
import {
	NostalgicDivaProvider,
	useNostalgicDiva,
} from '@/components/NostalgicDivaProvider';
import { LogLevel } from '@/controllers/Logger';
import { nullPlayerController } from '@/controllers/NullPlayerController';
import type {
	IPlayerController,
	PlayerOptions,
} from '@/controllers/PlayerController';
import type { ReactElement } from 'react';
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

const AUDIO_1 = 'https://example.com/one.mp3';
const AUDIO_2 = 'https://example.com/two.mp3';

let logger: ReturnType<typeof createTestLogger>;
let diva: ReturnType<typeof useNostalgicDiva>;
let onControllerChange: Mock<(value: IPlayerController) => void>;
const options: PlayerOptions = {};

function Capture(): ReactElement {
	diva = useNostalgicDiva();
	return <></>;
}

function App({ src }: { src: string }): ReactElement {
	return (
		<NostalgicDivaProvider logger={logger}>
			<Capture />
			<NostalgicDiva
				src={src}
				options={options}
				onControllerChange={onControllerChange}
			/>
		</NostalgicDivaProvider>
	);
}

// `AudioPlayer` is lazy-loaded, so wait for the chunk and the attach.
async function settle(): Promise<void> {
	await vi.waitFor(async () => {
		await flush();
		expect(onControllerChange).toHaveBeenCalled();
	});
}

beforeEach(() => {
	logger = createTestLogger();
	onControllerChange = vi.fn();
	vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
	vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
	vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
	document.body.innerHTML = '';
});

describe('NostalgicDiva', () => {
	it.each([
		'',
		'https://example.com/',
		'https://www.youtube.com/playlist?list=PL0123456789',
	])('should render an empty player for %j', async (src) => {
		const { container } = await render(<App src={src} />);

		const iframe = container.querySelector('iframe');
		expect(iframe?.getAttribute('src')).toBe('about:blank');
		expect(logger.log).toHaveBeenCalledWith(
			LogLevel.Warning,
			expect.stringContaining('Returning EmptyPlayer'),
		);
	});

	it('should render the audio player and register its controller', async () => {
		const { container } = await render(<App src={AUDIO_1} />);
		await settle();

		const audio = container.querySelector('audio');
		expect(audio?.getAttribute('src')).toBe(AUDIO_1);

		const controller = onControllerChange.mock.calls.at(-1)![0];
		expect(controller).not.toBe(nullPlayerController);
		expect(diva.supports('setPlaybackRate')).toBe(true);
	});

	it('should route provider commands to the active player', async () => {
		const { container } = await render(<App src={AUDIO_1} />);
		await settle();
		const audio = container.querySelector('audio')!;

		await diva.setVolume(0.25);
		await diva.play();

		expect(audio.volume).toBe(0.25);
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
	});

	it('should load the new source into the same element when src changes', async () => {
		const { container, rerender } = await render(<App src={AUDIO_1} />);
		await settle();
		const audio = container.querySelector('audio')!;

		await rerender(<App src={AUDIO_2} />);
		await flush();

		expect(container.querySelector('audio')).toBe(audio);
		expect(audio.src).toBe(AUDIO_2);
	});

	it('should fall back to the empty player and detach when src becomes unplayable', async () => {
		const { container, rerender } = await render(<App src={AUDIO_1} />);
		await settle();

		await rerender(<App src="https://example.com/" />);
		await flush();

		expect(container.querySelector('audio')).toBeNull();
		expect(container.querySelector('iframe')).not.toBeNull();
		expect(onControllerChange.mock.calls.at(-1)![0]).toBe(
			nullPlayerController,
		);
		expect(diva.supports('play')).toBe(false);
	});

	it('should forward media events to options', async () => {
		const handlers: Required<PlayerOptions> = {
			onError: vi.fn(),
			onLoaded: vi.fn(),
			onPlay: vi.fn(),
			onPause: vi.fn(),
			onEnded: vi.fn(),
			onTimeUpdate: vi.fn(),
		};
		const { container } = await render(
			<NostalgicDivaProvider logger={logger}>
				<NostalgicDiva
					src={AUDIO_1}
					options={handlers}
					onControllerChange={onControllerChange}
				/>
			</NostalgicDivaProvider>,
		);
		await settle();
		const audio = container.querySelector('audio')!;

		audio.dispatchEvent(new Event('play'));
		audio.dispatchEvent(new Event('ended'));

		expect(handlers.onPlay).toHaveBeenCalledTimes(1);
		expect(handlers.onEnded).toHaveBeenCalledTimes(1);
	});
});
