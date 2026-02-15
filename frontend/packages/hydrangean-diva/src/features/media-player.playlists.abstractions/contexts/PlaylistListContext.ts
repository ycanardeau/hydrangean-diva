import type { IPlaylistListStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListStore';
import { createContext, useContext } from 'react';

export const PlaylistListContext = createContext<IPlaylistListStore>(
	undefined!,
);

export const usePlaylistList = (): IPlaylistListStore => {
	return useContext(PlaylistListContext);
};
