import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions';
import { MiniPlayerContext } from '@/features/media-player.player/contexts/MiniPlayerContext';
import { usePlayer } from '@/features/media-player.player/contexts/PlayerContext';
import { MiniPlayerStore } from '@/features/media-player.player/stores/MiniPlayerStore';
import React, { type ReactElement, type ReactNode, useState } from 'react';

interface MiniPlayerProviderProps {
	children?: ReactNode;
}

export const MiniPlayerProvider = ({
	children,
}: MiniPlayerProviderProps): ReactElement => {
	const player = usePlayer();
	const playQueue = usePlayQueue();

	const [miniPlayer] = useState(
		() =>
			new MiniPlayerStore(
				new MobXObservableStateProvider(),
				player,
				playQueue,
			),
	);

	return (
		<MiniPlayerContext.Provider value={miniPlayer}>
			{children}
		</MiniPlayerContext.Provider>
	);
};
