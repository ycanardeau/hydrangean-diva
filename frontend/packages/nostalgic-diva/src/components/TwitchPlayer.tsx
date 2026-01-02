import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { LogLevel } from '@/controllers/Logger';
import { TwitchPlayerController } from '@/controllers/TwitchPlayerController';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { type ReactElement, memo, useCallback } from 'react';

const TwitchPlayer = memo(({ ...props }: PlayerProps): ReactElement => {
	const { logger } = props;

	logger.log(LogLevel.Debug, 'TwitchPlayer');

	const loadScript = useCallback(async () => {
		await ensureScriptLoaded('https://embed.twitch.tv/embed/v1.js', logger);
	}, [logger]);

	const playerFactory = useCallback(
		async (
			element: HTMLDivElement,
			videoId: string,
		): Promise<Twitch.Player> => {
			return Promise.resolve(
				new Twitch.Player(element, {
					video: videoId,
					width: '100%',
					height: '100%',
				}),
			);
		},
		[],
	);

	return (
		<PlayerContainer
			{...props}
			loadScript={loadScript}
			playerFactory={playerFactory}
			controllerFactory={TwitchPlayerController}
		>
			{(elementRef): ReactElement => (
				<div
					ref={elementRef}
					style={{ width: '100%', height: '100%' }}
				/>
			)}
		</PlayerContainer>
	);
});

export default TwitchPlayer;
