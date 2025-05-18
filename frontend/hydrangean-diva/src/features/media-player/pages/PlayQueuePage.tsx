import { HydrangeanDiva } from '@/features/media-player/components/HydrangeanDiva';
import { usePlayerStore } from '@/features/media-player/components/PlayerStoreContext';
import { usePlayQueueStore } from '@/features/media-player/components/PlayQueueStoreContext';
import { ReactElement } from 'react';

export const PlayQueuePage = (): ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	return (
		<HydrangeanDiva
			playerStore={playerStore}
			playQueueStore={playQueueStore}
		/>
	);
};
