import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions';
import { BottomBarStoreContext } from '@/features/media-player.player/contexts/BottomBarStoreContext';
import { usePlayerStore } from '@/features/media-player.player/contexts/PlayerStoreContext';
import { BottomBarStore } from '@/features/media-player.player/stores/BottomBarStore';
import React, { ReactElement, ReactNode, useState } from 'react';

interface BottomBarStoreProviderProps {
	children?: ReactNode;
}

export const BottomBarStoreProvider = ({
	children,
}: BottomBarStoreProviderProps): ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	const [bottomBarStore] = useState(
		() =>
			new BottomBarStore(
				new MobXObservableStateProvider(),
				playerStore,
				playQueueStore,
			),
	);

	return (
		<BottomBarStoreContext.Provider value={bottomBarStore}>
			{children}
		</BottomBarStoreContext.Provider>
	);
};
