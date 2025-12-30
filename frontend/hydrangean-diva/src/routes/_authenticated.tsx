import { Header } from '@/features/media-player.header/components/Header';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueStoreContext';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { MediaPlayerLayout } from '@/features/media-player.player/components/MediaPlayerLayout';
import { BottomBar } from '@/features/media-player.player/components/bottom-bar/BottomBar';
import { MiniPlayer } from '@/features/media-player.player/components/mini-player/MiniPlayer';
import { useLocalStorageStateStore } from '@aigamo/route-sphere';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

const RouteComponent = observer((): ReactElement => {
	const playQueueStore = usePlayQueueStore();

	useLocalStorageStateStore(
		'PlayQueueStore',
		playQueueStore as PlayQueueStore,
	);

	return (
		<>
			<Header />

			<MediaPlayerLayout>
				<Outlet />
			</MediaPlayerLayout>

			{!playQueueStore.isEmpty && <MiniPlayer />}

			<BottomBar />
		</>
	);
});

export const Route = createFileRoute('/_authenticated')({
	component: RouteComponent,
});
