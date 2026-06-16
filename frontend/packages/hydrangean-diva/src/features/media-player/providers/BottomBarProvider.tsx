import { BottomBarContext } from '@/features/media-player/contexts/BottomBarContext';
import { usePlayQueue } from '@/features/media-player/contexts/PlayQueueContext';
import { usePlayer } from '@/features/media-player/contexts/PlayerContext';
import { BottomBarStore } from '@/features/media-player/stores/BottomBarStore';
import { localStorageStateKeys } from '@/shared/stores/localStorageStateKeys';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { type ReactElement, type ReactNode, useState } from 'react';

interface BottomBarProviderProps {
	children?: ReactNode;
}

export const BottomBarProvider = ({
	children,
}: BottomBarProviderProps): ReactElement => {
	const player = usePlayer();
	const playQueue = usePlayQueue();

	const [bottomBar] = useState(() => new BottomBarStore(player, playQueue));

	useLocalStorageState(
		localStorageStateKeys.bottomBar,
		bottomBar.localStorageState,
	);

	return (
		<BottomBarContext.Provider value={bottomBar}>
			{children}
		</BottomBarContext.Provider>
	);
};
