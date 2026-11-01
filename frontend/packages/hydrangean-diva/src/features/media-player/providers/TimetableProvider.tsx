import { usePlayQueue } from '@/features/media-player/contexts/PlayQueueContext';
import { usePlayer } from '@/features/media-player/contexts/PlayerContext';
import { useSettings } from '@/features/media-player/contexts/SettingsContext';
import { TimetableContext } from '@/features/media-player/contexts/TimetableContext';
import { TimetableStore } from '@/features/media-player/stores/TimetableStore';
import { localStorageStateKeys } from '@/shared/stores/localStorageStateKeys';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';

interface TimetableProviderProps {
	children?: ReactNode;
}

export const TimetableProvider = ({
	children,
}: TimetableProviderProps): ReactElement => {
	const player = usePlayer();
	const playQueue = usePlayQueue();
	const settings = useSettings();

	const [timetable] = useState(
		() => new TimetableStore(player, playQueue, settings),
	);

	useLocalStorageState(
		localStorageStateKeys.timetable,
		timetable.localStorageState,
	);

	useEffect(() => timetable.startAutoFetch(), [timetable]);

	return (
		<TimetableContext.Provider value={timetable}>
			{children}
		</TimetableContext.Provider>
	);
};
