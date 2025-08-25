import { ReactElement } from 'react';

import { HydrangeanDiva } from '@/features/media-player.play-queue/components/HydrangeanDiva';
import { usePlayQueueStore } from '@/features/media-player.play-queue/components/PlayQueueStoreContext';

export const PlayQueuePage = (): ReactElement => {
	const playQueueStore = usePlayQueueStore();

	return <HydrangeanDiva playQueueStore={playQueueStore} />;
};
