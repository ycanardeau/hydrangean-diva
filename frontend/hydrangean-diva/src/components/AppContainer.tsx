import { HydrangeanDiva } from '@/components/HydrangeanDiva';
import { usePlayQueueStore } from '@/components/PlayQueueStoreContext';
import { usePlayerStore } from '@/components/PlayerStoreContext';
import { ShareTarget } from '@/components/ShareTarget';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const AppContainer = (): React.ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	return (
		<Routes>
			<Route
				path="/share-target"
				element={<ShareTarget playQueueStore={playQueueStore} />}
			/>
			<Route
				path="*"
				element={
					<HydrangeanDiva
						playerStore={playerStore}
						playQueueStore={playQueueStore}
					/>
				}
			/>
		</Routes>
	);
};
