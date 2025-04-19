import { HydrangeanDiva } from '@/components/HydrangeanDiva';
import { usePlayQueueStore } from '@/components/PlayQueueStoreContext';
import { usePlayerStore } from '@/components/PlayerStoreContext';
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
