import { useLocalStorageStateStore } from '@aigamo/route-sphere';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

import { BottomBar } from '@/features/media-player/components/BottomBar';
import { Header } from '@/features/media-player/components/Header';
import { MediaPlayerLayout } from '@/features/media-player/components/MediaPlayerLayout';
import { MiniPlayer } from '@/features/media-player/components/MiniPlayer';
import { usePlayerStore } from '@/features/media-player/components/PlayerStoreContext';
import { usePlayQueueStore } from '@/features/media-player/components/PlayQueueStoreContext';
import { PlayQueuePage } from '@/features/media-player/pages/PlayQueuePage';

export const AppRoutes = observer((): ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	useLocalStorageStateStore('PlayQueueStore', playQueueStore);

	return (
		<>
			<Header />

			<MediaPlayerLayout>
				<PlayQueuePage />
			</MediaPlayerLayout>

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
