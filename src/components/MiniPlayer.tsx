import { usePlayerStore } from '@/components/PlayerStoreContext';
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

	const options = React.useMemo(
		(): PlayerOptions => ({
			onLoaded: async (): Promise<void> => {
				await diva.play();
			},
			onPlay: () => playerStore.onPlay(),
			onPause: () => playerStore.onPause(),
			onEnded: () => playerStore.onEnded(),
			onTimeUpdate: (e) => playerStore.onTimeUpdate(e),
		}),
		[playerStore, diva],
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
