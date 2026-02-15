import type { IMiniPlayerStore } from '@/features/media-player.mini-player.abstractions/interfaces/IMiniPlayerStore';
import { createContext, useContext } from 'react';

export const MiniPlayerContext = createContext<IMiniPlayerStore>(undefined!);

export const useMiniPlayer = (): IMiniPlayerStore => {
	return useContext(MiniPlayerContext);
};
