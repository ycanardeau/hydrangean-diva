import { localStorageStateKeys } from '@/features/common/stores/localStorageStateKeys';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { BottomBarContext } from '@/features/media-player.player/contexts/BottomBarContext';
import { usePlayer } from '@/features/media-player.player/contexts/PlayerContext';
import { BottomBarStore } from '@/features/media-player.player/stores/BottomBarStore';
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
