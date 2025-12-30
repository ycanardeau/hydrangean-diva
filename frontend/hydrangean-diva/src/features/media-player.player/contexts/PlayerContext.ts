import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { createContext, useContext } from 'react';

export const PlayerContext = createContext<IPlayerStore>(undefined!);

export const usePlayer = (): IPlayerStore => {
	return useContext(PlayerContext);
};
