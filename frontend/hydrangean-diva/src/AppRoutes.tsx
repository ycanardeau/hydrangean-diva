import { useLocalStorageStateStore } from '@aigamo/route-sphere';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

import { usePlayQueueStore } from '@/features/media-player.play-queue/components/PlayQueueStoreContext';
import { PlayQueuePage } from '@/features/media-player.play-queue/pages/PlayQueuePage';
import { BottomBar } from '@/features/media-player.player/components/BottomBar';
import { MediaPlayerLayout } from '@/features/media-player.player/components/MediaPlayerLayout';
import { MiniPlayer } from '@/features/media-player.player/components/MiniPlayer';
import { usePlayerStore } from '@/features/media-player.player/components/PlayerStoreContext';
import { Header } from '@/features/media-player/components/Header';

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
