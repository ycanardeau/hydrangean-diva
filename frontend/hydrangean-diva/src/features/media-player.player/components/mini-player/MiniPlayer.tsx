import { bottomBarHeight } from '@/features/common/helpers/bottomBarHeight';
import { miniPlayerSize } from '@/features/common/helpers/miniPlayerSize';
import { useMiniPlayer } from '@/features/media-player.player/contexts/MiniPlayerContext';
import { NostalgicDiva, type PlayerOptions } from '@aigamo/nostalgic-diva';
import { observer } from 'mobx-react-lite';
import React, { type ReactElement, useMemo } from 'react';

export const MiniPlayer = observer((): ReactElement => {
	const miniPlayer = useMiniPlayer();

	const options = useMemo(
		(): PlayerOptions => ({
			onLoaded: miniPlayer.onLoaded,
			onPlay: miniPlayer.onPlay,
			onPause: miniPlayer.onPause,
			onEnded: miniPlayer.onEnded,
			onTimeUpdate: miniPlayer.onTimeUpdate,
		}),
		[miniPlayer],
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
				{miniPlayer.currentItem && (
					<NostalgicDiva
						src={miniPlayer.currentItem.url}
						options={options}
						onControllerChange={miniPlayer.onControllerChange}
					/>
				)}
			</div>
		</div>
	);
});
