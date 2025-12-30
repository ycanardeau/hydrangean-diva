import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { usePlayQueueStore } from '@/features/media-player.play-queue.abstractions';
import { MiniPlayerStoreContext } from '@/features/media-player.player/contexts/MiniPlayerStoreContext';
import { usePlayerStore } from '@/features/media-player.player/contexts/PlayerStoreContext';
import { MiniPlayerStore } from '@/features/media-player.player/stores/MiniPlayerStore';
import React, { ReactElement, ReactNode, useState } from 'react';

interface MiniPlayerStoreProviderProps {
	children?: ReactNode;
}

export const MiniPlayerStoreProvider = ({
	children,
}: MiniPlayerStoreProviderProps): ReactElement => {
	const playerStore = usePlayerStore();
	const playQueueStore = usePlayQueueStore();

	const [miniPlayerStore] = useState(
		() =>
			new MiniPlayerStore(
				new MobXObservableStateProvider(),
				playerStore,
				playQueueStore,
			),
	);

	return (
		<MiniPlayerStoreContext.Provider value={miniPlayerStore}>
			{children}
		</MiniPlayerStoreContext.Provider>
	);
};
