import type { ISettingsStore } from '@/features/media-player/interfaces/ISettingsStore';
import { createContext, useContext } from 'react';

export const SettingsContext = createContext<ISettingsStore>(undefined!);

export const useSettings = (): ISettingsStore => {
	return useContext(SettingsContext);
};
