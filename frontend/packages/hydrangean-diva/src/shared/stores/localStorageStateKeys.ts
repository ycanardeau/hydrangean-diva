export const localStorageStateKeys = {
	playQueue: 'PlayQueueStore',
	bottomBar: 'BottomBarStore',
	playlistList: 'PlaylistListStore',
	playlist: (playlistId: string) => `PlaylistStore/${playlistId}`,
	settings: 'SettingsStore',
	timetable: 'TimetableStore',
} as const;
