import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import { createContext, useContext } from 'react';

export const BottomBarContext = createContext<IBottomBarStore>(undefined!);

export const useBottomBar = (): IBottomBarStore => {
	return useContext(BottomBarContext);
};
