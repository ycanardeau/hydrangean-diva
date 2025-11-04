import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

import { PlayQueuePage } from '@/features/media-player.play-queue/pages/PlayQueuePage';

const RouteComponent = (): ReactElement => {
	return <PlayQueuePage />;
};

export const Route = createFileRoute('/_authenticated/')({
	component: RouteComponent,
});
