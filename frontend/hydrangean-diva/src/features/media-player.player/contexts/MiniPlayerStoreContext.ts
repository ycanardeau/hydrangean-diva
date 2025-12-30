import { IMiniPlayerStore } from '@/features/media-player.player/interfaces/IMiniPlayerStore';
import { createContext, useContext } from 'react';

export const MiniPlayerStoreContext = createContext<IMiniPlayerStore>(
	undefined!,
);

export const useMiniPlayerStore = (): IMiniPlayerStore => {
	return useContext(MiniPlayerStoreContext);
};
