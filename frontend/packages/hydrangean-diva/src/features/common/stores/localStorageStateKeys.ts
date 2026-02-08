export const localStorageStateKeys = {
	playQueue: 'PlayQueueStore',
	bottomBar: 'BottomBarStore',
	playlistList: 'PlaylistListStore',
	playlist: (playlistId: string) => `PlaylistStore/${playlistId}`,
} as const;
