import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { LogLevel } from '@/controllers/Logger';
import { VimeoPlayerController } from '@/controllers/VimeoPlayerController';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { type ReactElement, memo, useCallback } from 'react';

const VimeoPlayer = memo(({ ...props }: PlayerProps): ReactElement => {
	const { logger } = props;

	logger.log(LogLevel.Debug, 'VimeoPlayer');

	const loadScript = useCallback(async () => {
		await ensureScriptLoaded(
			'https://player.vimeo.com/api/player.js',
			logger,
		);
	}, [logger]);

	const playerFactory = useCallback(
		(element: HTMLIFrameElement): Promise<Vimeo.Player> => {
			return Promise.resolve(new Vimeo.Player(element));
		},
		[],
	);

	return (
		<PlayerContainer
			{...props}
			loadScript={loadScript}
			playerFactory={playerFactory}
			controllerFactory={VimeoPlayerController}
		>
			{(elementRef, videoId): ReactElement => (
				// eslint-disable-next-line jsx-a11y/iframe-has-title
				<iframe
					ref={elementRef}
					src={`https://player.vimeo.com/video/${videoId}`}
					frameBorder={0}
					allow="autoplay"
					style={{ width: '100%', height: '100%' }}
				/>
			)}
		</PlayerContainer>
	);
});

export default VimeoPlayer;
