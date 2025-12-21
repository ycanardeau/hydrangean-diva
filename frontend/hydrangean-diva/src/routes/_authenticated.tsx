import { Header } from '@/features/media-player.header/components/Header';
import { usePlayQueueStore } from '@/features/media-player.play-queue/components/PlayQueueStoreContext';
import { BottomBar } from '@/features/media-player.player/components/BottomBar';
import { MediaPlayerLayout } from '@/features/media-player.player/components/MediaPlayerLayout';
import { MiniPlayer } from '@/features/media-player.player/components/MiniPlayer';
import { usePlayerStore } from '@/features/media-player.player/components/PlayerStoreContext';
import { useLocalStorageStateStore } from '@aigamo/route-sphere';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

const RouteComponent = observer((): ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	useLocalStorageStateStore('PlayQueueStore', playQueueStore);

	return (
		<>
			<Header />

			<MediaPlayerLayout>
				<Outlet />
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

export const Route = createFileRoute('/_authenticated')({
	component: RouteComponent,
});
