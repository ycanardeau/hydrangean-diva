import { PlaylistListContext } from '@/features/media-player/contexts/PlaylistListContext';
import { PlaylistListStore } from '@/features/media-player/stores/PlaylistListStore';
import { localStorageStateKeys } from '@/shared/stores/localStorageStateKeys';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { type ReactElement, type ReactNode, useState } from 'react';

interface PlaylistListProviderProps {
	children?: ReactNode;
}

export const PlaylistListProvider = ({
	children,
}: PlaylistListProviderProps): ReactElement => {
	const [playlistList] = useState(() => new PlaylistListStore());

	useLocalStorageState(
		localStorageStateKeys.playlistList,
		playlistList.localStorageState,
	);

	return (
		<PlaylistListContext.Provider value={playlistList}>
			{children}
		</PlaylistListContext.Provider>
	);
};
