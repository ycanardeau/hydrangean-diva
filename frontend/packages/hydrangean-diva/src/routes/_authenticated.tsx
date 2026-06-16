import { BottomBar } from '@/features/media-player/components/BottomBar';
import { MediaPlayerLayout } from '@/features/media-player/components/MediaPlayerLayout';
import { MiniPlayer } from '@/features/media-player/components/MiniPlayer';
import { usePlayQueue } from '@/features/media-player/contexts/PlayQueueContext';
import { Header } from '@/layout/Header';
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
