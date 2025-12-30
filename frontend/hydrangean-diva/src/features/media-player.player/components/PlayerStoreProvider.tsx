import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { PlayerStoreContext } from '@/features/media-player.player/contexts/PlayerStoreContext';
import { PlayerStore } from '@/features/media-player.player/stores/PlayerStore';
import React, { ReactElement, ReactNode, useState } from 'react';

interface PlayerStoreProviderProps {
	children?: ReactNode;
}

export const PlayerStoreProvider = ({
	children,
}: PlayerStoreProviderProps): ReactElement => {
	const [playerStore] = useState(
		() => new PlayerStore(new MobXObservableStateProvider()),
	);

	return (
		<PlayerStoreContext.Provider value={playerStore}>
			{children}
		</PlayerStoreContext.Provider>
	);
};
