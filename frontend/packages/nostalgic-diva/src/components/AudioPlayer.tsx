import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { AudioPlayerController } from '@/controllers/AudioPlayerController';
import { LogLevel } from '@/controllers/Logger';
import { type ReactElement, memo, useCallback } from 'react';

const AudioPlayer = memo(({ ...props }: PlayerProps): ReactElement => {
	const { logger } = props;

	logger.log(LogLevel.Debug, 'AudioPlayer');

	const playerFactory = useCallback(
		(element: HTMLAudioElement): Promise<HTMLAudioElement> => {
			return Promise.resolve(element);
		},
		[],
	);

	return (
		<PlayerContainer
			{...props}
			loadScript={undefined}
			playerFactory={playerFactory}
			controllerFactory={AudioPlayerController}
		>
			{(elementRef, videoId): ReactElement => (
				<audio
					ref={elementRef}
					src={videoId}
					style={{ width: '100%', height: '100%' }}
					preload="auto"
					autoPlay
					controls
				/>
			)}
		</PlayerContainer>
	);
});

export default AudioPlayer;
