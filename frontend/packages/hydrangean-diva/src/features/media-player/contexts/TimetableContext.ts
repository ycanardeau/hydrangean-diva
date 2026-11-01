import type { ITimetableStore } from '@/features/media-player/interfaces/ITimetableStore';
import { createContext, useContext } from 'react';

export const TimetableContext = createContext<ITimetableStore>(undefined!);

export const useTimetable = (): ITimetableStore => {
	return useContext(TimetableContext);
};
