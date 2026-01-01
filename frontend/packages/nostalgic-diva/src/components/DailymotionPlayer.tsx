import {
	PlayerContainer,
	type PlayerProps,
} from '@/components/PlayerContainer';
import { DailymotionPlayerController } from '@/controllers/DailymotionPlayerController';
import { LogLevel } from '@/controllers/Logger';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import { type ReactElement, memo, useCallback } from 'react';

const DailymotionPlayer = memo(
	({ options, ...props }: PlayerProps): ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'DailymotionPlayer');

		const loadScript = useCallback(async () => {
			await ensureScriptLoaded('https://api.dmcdn.net/all.js', logger);
		}, [logger]);

		const playerFactory = useCallback(
			(element: HTMLDivElement, videoId: string): Promise<DM.player> => {
				return Promise.resolve(
					new DM.player(element, {
						video: videoId,
						width: '100%',
						height: '100%',
						events: {
							apiready: (): void => {
								options?.onLoaded?.({ id: videoId });
							},
							seeked: (): void => {
								options?.onTimeUpdate?.({
									duration: 0,
									percent: 0,
									seconds: 0,
								});
							},
							video_end: (): void => {
								options?.onEnded?.();
							},
							durationchange: (): void => {},
							pause: (): void => {
								options?.onPause?.();
							},
							playing: (): void => {
								options?.onPlay?.();
							},
							waiting: (): void => {},
							error: (error): void => {
								options?.onError?.(error);
							},
						},
					}),
				);
			},
			[options],
		);

		return (
			<PlayerContainer
				{...props}
				options={options}
				loadScript={loadScript}
				playerFactory={playerFactory}
				controllerFactory={DailymotionPlayerController}
			>
				{(elementRef): ReactElement => (
					<div style={{ width: '100%', height: '100%' }}>
						<div ref={elementRef} />
					</div>
				)}
			</PlayerContainer>
		);
	},
);

export default DailymotionPlayer;
