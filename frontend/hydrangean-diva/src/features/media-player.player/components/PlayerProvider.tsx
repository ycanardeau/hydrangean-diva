import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { PlayerContext } from '@/features/media-player.player/contexts/PlayerContext';
import { PlayerStore } from '@/features/media-player.player/stores/PlayerStore';
import React, { type ReactElement, type ReactNode, useState } from 'react';

interface PlayerProviderProps {
	children?: ReactNode;
}

export const PlayerProvider = ({
	children,
}: PlayerProviderProps): ReactElement => {
	const [player] = useState(
		() => new PlayerStore(new MobXObservableStateProvider()),
	);

	return (
		<PlayerContext.Provider value={player}>
			{children}
		</PlayerContext.Provider>
	);
};
