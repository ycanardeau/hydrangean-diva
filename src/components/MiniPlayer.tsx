import { PlayQueueStore, RepeatMode } from '@/stores/PlayQueueStore';
import { PlayerStore } from '@/stores/PlayerStore';
import {
	NostalgicDiva,
	PlayerOptions,
	useNostalgicDiva,
} from '@aigamo/nostalgic-diva';
import { observer } from 'mobx-react-lite';
import React from 'react';

const miniPlayerWidth = 16 * 25;
const miniPlayerHeight = 9 * 25;

const bottomBarHeight = 112;

interface MiniPlayerProps {
	playerStore: PlayerStore;
	playQueueStore: PlayQueueStore;
}

export const MiniPlayer = observer(
	({ playerStore, playQueueStore }: MiniPlayerProps): React.ReactElement => {
		const diva = useNostalgicDiva();

		const handleLoaded = React.useCallback(async (): Promise<void> => {
			await diva.play();
		}, [diva]);

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
				onPlay: () => playerStore.onPlay(),
				onPause: () => playerStore.onPause(),
				onEnded: handleEnded,
				onTimeUpdate: (e) => playerStore.onTimeUpdate(e),
			}),
			[playerStore, handleLoaded, handleEnded],
		);

		return (
			<div
				css={{
					position: 'fixed',
					right: 0,
					bottom: bottomBarHeight,
					width: miniPlayerWidth,
					height: miniPlayerHeight,
					zIndex: 998,
					backgroundColor: 'rgb(39, 39, 39)',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div css={{ flexGrow: 1, backgroundColor: 'black' }}>
					{playQueueStore.currentItem && (
						<NostalgicDiva
							type={playQueueStore.currentItem.type}
							videoId={playQueueStore.currentItem.videoId}
							options={options}
						/>
					)}
				</div>
			</div>
		);
	},
);
