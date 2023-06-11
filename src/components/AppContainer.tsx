import { HydrangeanDiva } from '@/components/HydrangeanDiva';
import { usePlayerStore } from '@/components/PlayerStoreContext';
import React from 'react';

export const AppContainer = (): React.ReactElement => {
	const playerStore = usePlayerStore();

	return (
		<HydrangeanDiva
			playerStore={playerStore}
			playQueueStore={playerStore.playQueueStore}
		/>
	);
};
