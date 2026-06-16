import type { IPlayQueueStore } from '@/features/media-player/interfaces/IPlayQueueStore';
import { createContext, useContext } from 'react';

export const PlayQueueContext = createContext<IPlayQueueStore>(undefined!);

export const usePlayQueue = (): IPlayQueueStore => {
	return useContext(PlayQueueContext);
};
