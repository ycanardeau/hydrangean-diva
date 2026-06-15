import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { LogLevel } from '@/controllers/Logger';
import { SpotifyPlayerController } from '@/controllers/SpotifyPlayerController';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { type ReactElement, memo, useCallback } from 'react';

// The Spotify iframe API hands the `IFrameAPI` object to a global callback
// rather than exposing it on a namespace, so stash it for `playerFactory`.
let iFrameAPI: Spotify.IFrameAPI | undefined;

const SpotifyPlayer = memo(({ ...props }: PlayerProps): ReactElement => {
	const { logger } = props;

	logger.log(LogLevel.Debug, 'SpotifyPlayer');

	const loadScript = useCallback((): Promise<void> => {
		return new Promise(async (resolve, _reject) => {
			const first = await ensureScriptLoaded(
				'https://open.spotify.com/embed/iframe-api/v1',
				logger,
			);

			if (first) {
				window.onSpotifyIframeApiReady = (api): void => {
					iFrameAPI = api;
					logger.log(LogLevel.Debug, 'Spotify iframe API ready');
					resolve();
				};
			} else {
				resolve();
			}
		});
	}, [logger]);

	const playerFactory = useCallback(
		(
			element: HTMLDivElement,
			videoId: string,
		): Promise<Spotify.EmbedController> => {
			return new Promise((resolve) => {
				iFrameAPI!.createController(
					element,
					{ uri: videoId, width: '100%', height: '100%' },
					(controller) => resolve(controller),
				);
			});
		},
		[],
	);

	return (
		<PlayerContainer
			{...props}
			loadScript={loadScript}
			playerFactory={playerFactory}
			controllerFactory={SpotifyPlayerController}
		>
			{(elementRef): ReactElement => (
				// Spotify replaces the host element with its iframe, so keep a
				// React-owned wrapper around it (as `YouTubePlayer` does).
				<div style={{ width: '100%', height: '100%' }}>
					<div ref={elementRef} />
				</div>
			)}
		</PlayerContainer>
	);
});

export default SpotifyPlayer;
