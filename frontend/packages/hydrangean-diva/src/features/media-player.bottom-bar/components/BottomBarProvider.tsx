import { BottomBarContext } from '@/features/media-player.bottom-bar.abstractions/contexts/BottomBarContext';
import { BottomBarStore } from '@/features/media-player.bottom-bar/stores/BottomBarStore';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { usePlayer } from '@/features/media-player.player.abstractions/contexts/PlayerContext';
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

	return (
		<BottomBarContext.Provider value={bottomBar}>
			{children}
		</BottomBarContext.Provider>
	);
};
