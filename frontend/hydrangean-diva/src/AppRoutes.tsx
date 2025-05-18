import { EuiPageTemplate, EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import {
	BottomBar,
	bottomBarHeight,
} from '@/features/media-player/components/BottomBar';
import { Header } from '@/features/media-player/components/Header';
import {
	MiniPlayer,
	miniPlayerSize,
} from '@/features/media-player/components/MiniPlayer';
import { usePlayerStore } from '@/features/media-player/components/PlayerStoreContext';
import { usePlayQueueStore } from '@/features/media-player/components/PlayQueueStoreContext';
import { PlayQueuePage } from '@/features/media-player/pages/PlayQueuePage';

export const AppRoutes = observer((): React.ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	return (
		<>
			<Header />

			<EuiPageTemplate
				panelled
				style={{
					minBlockSize: `max(460px, 100vh - ${bottomBarHeight}px)`,
				}}
			>
				<PlayQueuePage />

				{!playQueueStore.isEmpty && (
					<EuiSpacer style={{ blockSize: miniPlayerSize.height }} />
				)}
			</EuiPageTemplate>

			{!playQueueStore.isEmpty && (
				<MiniPlayer
					playerStore={playerStore}
					playQueueStore={playQueueStore}
				/>
			)}

			<BottomBar
				playerStore={playerStore}
				playQueueStore={playQueueStore}
			/>
		</>
	);
});
