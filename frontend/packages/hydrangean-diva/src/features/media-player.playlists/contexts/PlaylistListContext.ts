import type { PlaylistListStore } from '@/features/media-player.playlists/stores/PlaylistListStore';
import { createContext, useContext } from 'react';

export const PlaylistListContext = createContext<PlaylistListStore>(undefined!);

export const usePlaylistList = (): PlaylistListStore => {
	return useContext(PlaylistListContext);
};
