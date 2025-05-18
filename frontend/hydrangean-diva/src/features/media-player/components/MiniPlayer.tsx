import { bottomBarHeight } from '@/features/media-player/components/BottomBar';
import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';
import { PlayerStore } from '@/features/media-player/stores/PlayerStore';
import { RepeatMode } from '@/features/media-player/stores/RepeatMode';
import {
	NostalgicDiva,
	PlayerOptions,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const miniPlayerSize = {
	width: 16 * 25,
	height: 9 * 25,
} as const;

interface MiniPlayerProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

export const MiniPlayer = observer(
	({ playerStore, playQueueStore }: MiniPlayerProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		const handleLoaded = React.useCallback(async (): Promise<void> => {
			if (!playQueueStore.interacted) {
				return;
			}

			await diva.play();
		}, [playQueueStore, diva]);

		const handleEnded = React.useCallback(async (): Promise<void> => {
			switch (playQueueStore.repeat) {
				case RepeatMode.One:
					await diva.setCurrentTime(0);
					break;

				case RepeatMode.Off:
				case RepeatMode.All:
					if (playQueueStore.isLastItem) {
						switch (playQueueStore.repeat) {
							case RepeatMode.Off:
								playerStore.onEnded();
								break;

							case RepeatMode.All:
								if (playQueueStore.hasMultipleItems) {
									await playQueueStore.goToFirst();
								} else {
									await diva.setCurrentTime(0);
								}
								break;
						}
					} else {
						await playQueueStore.next();
					}
					break;
			}
		}, [playQueueStore, playerStore, diva]);

		const options = React.useMemo(
			(): PlayerOptions => ({
				onLoaded: handleLoaded,
				onPlay: playerStore.onPlay,
				onPause: playerStore.onPause,
				onEnded: handleEnded,
				onTimeUpdate: playerStore.onTimeUpdate,
			}),
			[playerStore, handleLoaded, handleEnded],
		);

		return (
			<div
				css={{
					position: 'fixed',
					right: 0,
					bottom: bottomBarHeight,
					width: miniPlayerSize.width,
					height: miniPlayerSize.height,
					zIndex: 998,
					backgroundColor: 'rgb(39, 39, 39)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div css={{ flexGrow: 1, backgroundColor: 'black' }}>
					{playQueueStore.currentItem && (
						<NostalgicDiva
							src={playQueueStore.currentItem.url}
							options={options}
						/>
					)}
				</div>
			</div>
		);
	},
);
