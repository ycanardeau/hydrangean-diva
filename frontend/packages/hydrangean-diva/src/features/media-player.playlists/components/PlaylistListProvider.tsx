import { PlaylistListContext } from '@/features/media-player.playlists.abstractions/contexts/PlaylistListContext';
import { PlaylistListStore } from '@/features/media-player.playlists/stores/PlaylistListStore';
import { type ReactElement, type ReactNode, useState } from 'react';

interface PlaylistListProviderProps {
	children?: ReactNode;
}

export const PlaylistListProvider = ({
	children,
}: PlaylistListProviderProps): ReactElement => {
	const [playlistList] = useState(() => new PlaylistListStore());

	return (
		<PlaylistListContext.Provider value={playlistList}>
			{children}
		</PlaylistListContext.Provider>
	);
};
