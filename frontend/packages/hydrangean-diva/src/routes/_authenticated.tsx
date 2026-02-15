import { BottomBar } from '@/features/media-player.bottom-bar/components/BottomBar';
import { Header } from '@/features/media-player.header/components/Header';
import { MiniPlayer } from '@/features/media-player.mini-player/components/MiniPlayer';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { MediaPlayerLayout } from '@/features/media-player/components/MediaPlayerLayout';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';

const RouteComponent = observer((): ReactElement => {
	const playQueue = usePlayQueue();

	const navigate = useNavigate();

	const handleClickPlayQueueButton = (): Promise<void> =>
		navigate({ to: '/play-queue' });

	return (
		<>
			<Header />

			<MediaPlayerLayout>
				<Outlet />
			</MediaPlayerLayout>

			{!playQueue.isEmpty && <MiniPlayer />}

			<BottomBar onClickPlayQueueButton={handleClickPlayQueueButton} />
		</>
	);
});

export const Route = createFileRoute('/_authenticated')({
	component: RouteComponent,
});
