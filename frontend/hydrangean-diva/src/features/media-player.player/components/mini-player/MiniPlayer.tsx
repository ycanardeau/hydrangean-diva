import { bottomBarHeight } from '@/features/common/helpers/bottomBarHeight';
import { miniPlayerSize } from '@/features/common/helpers/miniPlayerSize';
import { useMiniPlayerStore } from '@/features/media-player.player/contexts/MiniPlayerStoreContext';
import { NostalgicDiva, PlayerOptions } from '@aigamo/nostalgic-diva';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useMemo } from 'react';

export const MiniPlayer = observer((): ReactElement => {
	const miniPlayerStore = useMiniPlayerStore();

	const options = useMemo(
		(): PlayerOptions => ({
			onLoaded: miniPlayerStore.onLoaded,
			onPlay: miniPlayerStore.onPlay,
			onPause: miniPlayerStore.onPause,
			onEnded: miniPlayerStore.onEnded,
			onTimeUpdate: miniPlayerStore.onTimeUpdate,
		}),
		[miniPlayerStore],
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
				{miniPlayerStore.currentItem && (
					<NostalgicDiva
						src={miniPlayerStore.currentItem.url}
						options={options}
						onControllerChange={miniPlayerStore.onControllerChange}
					/>
				)}
			</div>
		</div>
	);
});
