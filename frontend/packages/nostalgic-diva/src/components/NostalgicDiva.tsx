import { useNostalgicDiva } from '@/components/NostalgicDivaProvider';
import type { PlayerProps } from '@/components/PlayerContainer';
import { LogLevel } from '@/controllers/Logger';
import type {
	IPlayerController,
	PlayerOptions,
	PlayerType,
} from '@/controllers/PlayerController';
import { findVideoService } from '@/services/findVideoService';
import {
	type ElementType,
	type ReactElement,
	Suspense,
	lazy,
	memo,
	useCallback,
} from 'react';

export const players: Map<PlayerType, ElementType<PlayerProps>> = new Map(
	Object.entries({
		Audio: lazy(() => import('./AudioPlayer')),
		Dailymotion: lazy(() => import('./DailymotionPlayer')),
		Niconico: lazy(() => import('./NiconicoPlayer')),
		SoundCloud: lazy(() => import('./SoundCloudPlayer')),
		Twitch: lazy(() => import('./TwitchPlayer')),
		Vimeo: lazy(() => import('./VimeoPlayer')),
		YouTube: lazy(() => import('./YouTubePlayer')),
	}),
);

export interface NostalgicDivaProps {
	src: string;
	options?: PlayerOptions;
	onControllerChange?: (value: IPlayerController) => void;
}

function getTypeAndVideoId(
	url: string,
): { type: PlayerType; videoId: string } | undefined {
	const videoService = findVideoService(url);
	if (videoService === undefined) {
		return undefined;
	}

	const { type, extractVideoId } = videoService;

	const videoId = extractVideoId(url);
	if (videoId === undefined) {
		return undefined;
	}

	return { type: type, videoId: videoId };
}

const EmptyPlayer = memo((): ReactElement => {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<iframe
				src="about:blank"
				title="about:blank"
				style={{
					width: '100%',
					height: '100%',
					border: 0,
				}}
			/>
		</div>
	);
});

export const NostalgicDiva = memo(
	({
		src,
		options,
		onControllerChange,
	}: NostalgicDivaProps): ReactElement => {
		const diva = useNostalgicDiva();

		const handleControllerChange = useCallback(
			(value: IPlayerController) => {
				diva.handleControllerChange(value);

				onControllerChange?.(value);
			},
			[diva, onControllerChange],
		);

		diva.logger.log(LogLevel.Debug, 'NostalgicDiva');

		const typeAndVideoId = getTypeAndVideoId(src);
		if (typeAndVideoId === undefined) {
			diva.logger.log(
				LogLevel.Warning,
				`Failed to extract type and videoId from src: "${src}". Returning EmptyPlayer.`,
			);
			return <EmptyPlayer />;
		}

		const { type, videoId } = typeAndVideoId;

		const Player = players.get(type);
		if (Player === undefined) {
			diva.logger.log(
				LogLevel.Warning,
				`No player found for type "${type}" (videoId: "${videoId}"). Returning EmptyPlayer.`,
			);
			return <EmptyPlayer />;
		}

		return (
			<Suspense fallback={null}>
				<Player
					logger={diva.logger}
					type={type}
					onControllerChange={handleControllerChange}
					videoId={videoId}
					options={options}
				/>
			</Suspense>
		);
	},
);
