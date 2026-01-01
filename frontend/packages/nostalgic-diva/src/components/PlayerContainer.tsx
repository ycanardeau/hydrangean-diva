import usePreviousDistinct from '@/components/usePreviousDistinct';
import { type ILogger, LogLevel } from '@/controllers/Logger';
import { nullPlayerController } from '@/controllers/NullPlayerController';
import {
	type IPlayerController,
	PlayerController,
	type PlayerOptions,
	PlayerType,
} from '@/controllers/PlayerController';
import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';
import {
	type MutableRefObject,
	type ReactElement,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';

export interface PlayerProps {
	logger: ILogger;
	type: PlayerType;
	onControllerChange: ((value: IPlayerController) => void) | undefined;
	videoId: string;
	options: PlayerOptions | undefined;
}

interface PlayerContainerProps<
	TElement extends HTMLElement,
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
> extends PlayerProps {
	loadScript: (() => Promise<void>) | undefined;
	playerFactory: (element: TElement, videoId: string) => Promise<TPlayer>;
	controllerFactory: new (
		logger: ILogger,
		player: TPlayer,
		options: PlayerOptions | undefined,
	) => TController;
	children: (
		elementRef: MutableRefObject<TElement>,
		videoId: string,
	) => ReactNode;
}

export const PlayerContainer = <
	TElement extends HTMLElement,
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
>({
	logger,
	type,
	loadScript,
	playerFactory,
	onControllerChange,
	videoId,
	options,
	controllerFactory,
	children,
}: PlayerContainerProps<TElement, TPlayer, TController>): ReactElement<
	PlayerContainerProps<TElement, TPlayer, TController>
> => {
	logger.log(LogLevel.Debug, 'PlayerContainer');

	const videoIdRef = useRef(videoId);

	const elementRef = useRef<TElement>(undefined!);

	const [player, setPlayer] = useState<TPlayer>();

	const [controller, setController] =
		useState<IPlayerController>(nullPlayerController);
	useEffect(() => {
		onControllerChange?.(controller);
	}, [controller, onControllerChange]);

	useEffect(() => {
		void (loadScript?.() ?? Promise.resolve())
			.then(() => playerFactory(elementRef.current, videoIdRef.current))
			.then((player) => setPlayer(player));
	}, [loadScript, playerFactory]);

	// Make sure that `options` do not change between re-rendering.
	useEffect(() => {
		if (player === undefined) {
			return;
		}

		const controller = new PlayerController(
			logger,
			type,
			player,
			options,
			controllerFactory,
		);

		setController(controller);
		void controller.attach(videoIdRef.current);

		return (): void => {
			setController(nullPlayerController);
			void controller.detach();
		};
	}, [logger, type, loadScript, player, options, controllerFactory]);

	const previousVideoId = usePreviousDistinct(videoId);
	useEffect(() => {
		// If `previousVideoId` is undefined, then it means that the video has already been loaded by either
		// 1. `<audio>`s `src` attribute (e.g. `AudioPlayer`),
		// 2. `<iframe>`'s `src` attribute (e.g. `NiconicoPlayer`, `SoundCloudPlayer` and `VimeoPlayer`), or
		// 3. the `attach` method of the player API (e.g. `YouTubePlayer`).
		if (previousVideoId === undefined) {
			return;
		}

		void controller.loadVideo(videoId);
	}, [previousVideoId, videoId, controller]);

	// Make sure that `videoId` does not change between re-rendering.
	return <>{children(elementRef, videoIdRef.current)}</>;
};
