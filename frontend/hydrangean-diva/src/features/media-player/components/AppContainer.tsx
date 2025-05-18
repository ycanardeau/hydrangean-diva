import { HydrangeanDiva } from '@/features/media-player/components/HydrangeanDiva';
import { usePlayQueueStore } from '@/features/media-player/components/PlayQueueStoreContext';
import { usePlayerStore } from '@/features/media-player/components/PlayerStoreContext';
import React from 'react';

export const AppContainer = (): React.ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	return (
		<HydrangeanDiva
			playerStore={playerStore}
			playQueueStore={playQueueStore}
		/>
	);
};
