import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { usePlayer } from '@/features/media-player.player.abstractions/contexts/PlayerContext';
import { useBottomBar } from '@/features/media-player.player/contexts/BottomBarContext';
import { MiniPlayerContext } from '@/features/media-player.player/contexts/MiniPlayerContext';
import { MiniPlayerStore } from '@/features/media-player.player/stores/MiniPlayerStore';
import { type ReactElement, type ReactNode, useState } from 'react';

interface MiniPlayerProviderProps {
	children?: ReactNode;
}

export const MiniPlayerProvider = ({
	children,
}: MiniPlayerProviderProps): ReactElement => {
	const player = usePlayer();
	const playQueue = usePlayQueue();
	const bottomBar = useBottomBar();

	const [miniPlayer] = useState(
		() => new MiniPlayerStore(player, playQueue, bottomBar),
	);

	return (
		<MiniPlayerContext.Provider value={miniPlayer}>
			{children}
		</MiniPlayerContext.Provider>
	);
};
