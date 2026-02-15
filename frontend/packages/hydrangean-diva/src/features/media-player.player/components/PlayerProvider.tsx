import { PlayerContext } from '@/features/media-player.player.abstractions/contexts/PlayerContext';
import { PlayerStore } from '@/features/media-player.player/stores/PlayerStore';
import { type ReactElement, type ReactNode, useState } from 'react';

interface PlayerProviderProps {
	children?: ReactNode;
}

export const PlayerProvider = ({
	children,
}: PlayerProviderProps): ReactElement => {
	const [player] = useState(() => new PlayerStore());

	return (
		<PlayerContext.Provider value={player}>
			{children}
		</PlayerContext.Provider>
	);
};
