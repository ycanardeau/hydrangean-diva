import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { createContext, useContext } from 'react';

export const PlayerStoreContext = createContext<IPlayerStore>(undefined!);

export const usePlayerStore = (): IPlayerStore => {
	return useContext(PlayerStoreContext);
};
