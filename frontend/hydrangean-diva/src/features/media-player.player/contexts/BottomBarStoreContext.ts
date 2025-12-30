import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import { createContext, useContext } from 'react';

export const BottomBarStoreContext = createContext<IBottomBarStore>(undefined!);

export const useBottomBarStore = (): IBottomBarStore => {
	return useContext(BottomBarStoreContext);
};
