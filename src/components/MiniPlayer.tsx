import { usePlayerStore } from '@/components/PlayerStoreContext';
import { RepeatMode } from '@/stores/PlayQueueStore';
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

export const MiniPlayer = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const diva = useNostalgicDiva();

	const handleLoaded = React.useCallback(async (): Promise<void> => {
		await diva.play();
	}, [diva]);

	const handleEnded = React.useCallback(async (): Promise<void> => {
		switch (playerStore.repeat) {
			case RepeatMode.One:
				await diva.setCurrentTime(0);
				break;

			case RepeatMode.Off:
			case RepeatMode.All:
				if (playerStore.isLastItem) {
					switch (playerStore.repeat) {
						case RepeatMode.Off:
							playerStore.onEnded();
							break;

						case RepeatMode.All:
							if (playerStore.hasMultipleItems) {
								await playerStore.goToFirst();
							} else {
								await diva.setCurrentTime(0);
							}
							break;
					}
				} else {
					await playerStore.next();
				}
				break;
		}
	}, [playerStore, diva]);

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
				{playerStore.currentItem && (
					<NostalgicDiva
						type={playerStore.currentItem.type}
						videoId={playerStore.currentItem.videoId}
						options={options}
					/>
				)}
			</div>
		</div>
	);
});
