import { PlayQueuePage } from '@/features/media-player.play-queue/pages/PlayQueuePage';
import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	return <PlayQueuePage />;
};

export const Route = createFileRoute('/_authenticated/play-queue')({
	component: RouteComponent,
});
