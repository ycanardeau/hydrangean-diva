import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { usePlayQueue } from '@/features/media-player.play-queue.abstractions';
import { BottomBarContext } from '@/features/media-player.player/contexts/BottomBarContext';
import { usePlayer } from '@/features/media-player.player/contexts/PlayerContext';
import { BottomBarStore } from '@/features/media-player.player/stores/BottomBarStore';
import React, { ReactElement, ReactNode, useState } from 'react';

interface BottomBarProviderProps {
	children?: ReactNode;
}

export const BottomBarProvider = ({
	children,
}: BottomBarProviderProps): ReactElement => {
	const player = usePlayer();
	const playQueue = usePlayQueue();

	const [bottomBar] = useState(
		() =>
			new BottomBarStore(
				new MobXObservableStateProvider(),
				player,
				playQueue,
			),
	);

	return (
		<BottomBarContext.Provider value={bottomBar}>
			{children}
		</BottomBarContext.Provider>
	);
};
