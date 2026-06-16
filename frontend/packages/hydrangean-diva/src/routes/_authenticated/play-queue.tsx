import { PlayQueuePage } from '@/features/media-player/pages/PlayQueuePage';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	return <PlayQueuePage />;
};

export const Route = createFileRoute('/_authenticated/play-queue')({
	component: RouteComponent,
});
