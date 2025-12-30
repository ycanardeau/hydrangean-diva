import { IMiniPlayerStore } from '@/features/media-player.player/interfaces/IMiniPlayerStore';
import { createContext, useContext } from 'react';

export const MiniPlayerContext = createContext<IMiniPlayerStore>(undefined!);

export const useMiniPlayer = (): IMiniPlayerStore => {
	return useContext(MiniPlayerContext);
};
