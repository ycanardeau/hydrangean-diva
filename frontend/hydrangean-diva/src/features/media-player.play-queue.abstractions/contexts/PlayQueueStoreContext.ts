import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces';
import { createContext, useContext } from 'react';

export const PlayQueueStoreContext = createContext<IPlayQueueStore>(undefined!);

export const usePlayQueueStore = (): IPlayQueueStore => {
	return useContext(PlayQueueStoreContext);
};
