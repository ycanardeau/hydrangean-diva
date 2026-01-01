import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { LogLevel } from '@/controllers/Logger';
import { YouTubePlayerController } from '@/controllers/YouTubePlayerController';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { type ReactElement, memo, useCallback } from 'react';

const origin = 'https://www.youtube-nocookie.com';

const YouTubePlayer = memo(({ ...props }: PlayerProps): ReactElement => {
	const { logger } = props;

	logger.log(LogLevel.Debug, 'YouTubePlayer');

	const loadScript = useCallback((): Promise<void> => {
		return new Promise(async (resolve, _reject) => {
			const first = await ensureScriptLoaded(
				'https://www.youtube.com/iframe_api',
				logger,
			);

			if (first) {
				// https://stackoverflow.com/a/18154942.
				window.onYouTubeIframeAPIReady = (): void => {
					logger.log(LogLevel.Debug, 'YouTube iframe API ready');
					resolve();
				};
			} else {
				resolve();
			}
		});
	}, [logger]);

	const playerFactory = useCallback(
		(element: HTMLDivElement): Promise<YT.Player> => {
			return Promise.resolve(
				new YT.Player(element, {
					host: origin,
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
			controllerFactory={YouTubePlayerController}
		>
			{(elementRef): ReactElement => (
				<div style={{ width: '100%', height: '100%' }}>
					<div ref={elementRef} />
				</div>
			)}
		</PlayerContainer>
	);
});

export default YouTubePlayer;
