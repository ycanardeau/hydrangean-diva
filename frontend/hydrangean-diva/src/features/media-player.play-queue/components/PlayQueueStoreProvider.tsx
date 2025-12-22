import { MobXObservableStateProvider } from '@/features/common/stores/MobXObservableStateProvider';
import { PlayQueueStoreContext } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueStoreContext';
import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { reaction } from 'mobx';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

interface PlayQueueStoreProviderProps {
	children?: ReactNode;
}

export const PlayQueueStoreProvider = ({
	children,
}: PlayQueueStoreProviderProps): ReactElement => {
	const [playQueueStore] = useState(
		() => new PlayQueueStore(new MobXObservableStateProvider()),
	);

	const diva = useNostalgicDiva();

	useEffect(() => {
		return reaction(
			() => playQueueStore.currentItem,
			async (currentItem, previousItem) => {
				if (currentItem === undefined || previousItem === undefined) {
					return;
				}

				if (
					currentItem.type === previousItem.type &&
					currentItem.videoId === previousItem.videoId
				) {
					await diva.setCurrentTime(0);
				}
			},
		);
	}, [playQueueStore, diva]);

	return (
		<PlayQueueStoreContext.Provider value={playQueueStore}>
			{children}
		</PlayQueueStoreContext.Provider>
	);
};
