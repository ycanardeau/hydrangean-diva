import { type ILogger, LogLevel, defaultLogger } from '@/controllers/Logger';
import { nullPlayerController } from '@/controllers/NullPlayerController';
import type {
	IPlayerCommands,
	IPlayerController,
} from '@/controllers/PlayerController';
import {
	type ReactElement,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';

interface NostalgicDivaContextProps extends IPlayerController {
	logger: ILogger;
	handleControllerChange: (value: IPlayerController) => void;
}

const NostalgicDivaContext = createContext<NostalgicDivaContextProps>(
	undefined!,
);

export interface NostalgicDivaProviderProps {
	children?: ReactNode;
	logger?: ILogger;
}

export const NostalgicDivaProvider = ({
	children,
	logger = defaultLogger,
}: NostalgicDivaProviderProps): ReactElement => {
	const controllerRef = useRef<IPlayerController>(nullPlayerController);

	const handleControllerChange = useCallback(
		(value: IPlayerController): void => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.handleControllerChange',
				controllerRef.current,
				value,
			);

			controllerRef.current = value;
		},
		[logger],
	);

	const loadVideo = useCallback(
		async (id: string): Promise<void> => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.loadVideo',
				controllerRef.current,
			);

			await controllerRef.current.loadVideo(id);
		},
		[logger],
	);

	const play = useCallback(async (): Promise<void> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.play',
			controllerRef.current,
		);

		await controllerRef.current.play();
	}, [logger]);

	const pause = useCallback(async (): Promise<void> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.pause',
			controllerRef.current,
		);

		await controllerRef.current.pause();
	}, [logger]);

	const setCurrentTime = useCallback(
		async (seconds: number): Promise<void> => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.setCurrentTime',
				controllerRef.current,
			);

			await controllerRef.current.setCurrentTime(seconds);
			await controllerRef.current.play();
		},
		[logger],
	);

	const setVolume = useCallback(
		async (volume: number): Promise<void> => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.setVolume',
				controllerRef.current,
			);

			await controllerRef.current.setVolume(volume);
		},
		[logger],
	);

	const setMuted = useCallback(
		async (muted: boolean): Promise<void> => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.setMuted',
				controllerRef.current,
			);

			await controllerRef.current.setMuted(muted);
		},
		[logger],
	);

	const setPlaybackRate = useCallback(
		async (playbackRate: number): Promise<void> => {
			logger.log(
				LogLevel.Debug,
				'NostalgicDivaProvider.setPlaybackRate',
				controllerRef.current,
			);

			await controllerRef.current.setPlaybackRate(playbackRate);
		},
		[logger],
	);

	const getDuration = useCallback(async (): Promise<number> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.getDuration',
			controllerRef.current,
		);

		return await controllerRef.current.getDuration();
	}, [logger]);

	const getCurrentTime = useCallback(async (): Promise<number> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.getCurrentTime',
			controllerRef.current,
		);

		return await controllerRef.current.getCurrentTime();
	}, [logger]);

	const getVolume = useCallback(async (): Promise<number> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.getVolume',
			controllerRef.current,
		);

		return await controllerRef.current.getVolume();
	}, [logger]);

	const getMuted = useCallback(async (): Promise<boolean> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.getMuted',
			controllerRef.current,
		);

		return await controllerRef.current.getMuted();
	}, [logger]);

	const getPlaybackRate = useCallback(async (): Promise<number> => {
		logger.log(
			LogLevel.Debug,
			'NostalgicDivaProvider.getPlaybackRate',
			controllerRef.current,
		);

		return await controllerRef.current.getPlaybackRate();
	}, [logger]);

	const supports = useCallback(
		(command: keyof IPlayerCommands): boolean =>
			controllerRef.current.supports(command),
		[],
	);

	const value = useMemo(
		(): NostalgicDivaContextProps => ({
			logger,
			handleControllerChange,
			loadVideo,
			play,
			pause,
			setCurrentTime,
			setVolume,
			setMuted,
			setPlaybackRate,
			getDuration,
			getCurrentTime,
			getVolume,
			getMuted,
			getPlaybackRate,
			supports,
		}),
		[
			logger,
			handleControllerChange,
			loadVideo,
			play,
			pause,
			setCurrentTime,
			setVolume,
			setMuted,
			setPlaybackRate,
			getDuration,
			getCurrentTime,
			getVolume,
			getMuted,
			getPlaybackRate,
			supports,
		],
	);

	return (
		<NostalgicDivaContext.Provider value={value}>
			{children}
		</NostalgicDivaContext.Provider>
	);
};

export const useNostalgicDiva = (): NostalgicDivaContextProps => {
	return useContext(NostalgicDivaContext);
};
