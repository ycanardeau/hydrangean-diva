import { localStorageStateKeys } from '@/features/common/stores/localStorageStateKeys';
import { Header } from '@/features/media-player.header/components/Header';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { MediaPlayerLayout } from '@/features/media-player.player/components/MediaPlayerLayout';
import { BottomBar } from '@/features/media-player.player/components/bottom-bar/BottomBar';
import { MiniPlayer } from '@/features/media-player.player/components/mini-player/MiniPlayer';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';

const RouteComponent = observer((): ReactElement => {
	const playQueue = usePlayQueue();

	useLocalStorageState(
		localStorageStateKeys.playQueue,
		playQueue.localStorageState,
	);

	return (
		<>
			<Header />

			<MediaPlayerLayout>
				<Outlet />
			</MediaPlayerLayout>

			{!playQueue.isEmpty && <MiniPlayer />}

			<BottomBar />
		</>
	);
});

export const Route = createFileRoute('/_authenticated')({
	component: RouteComponent,
});
