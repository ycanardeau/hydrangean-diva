export const featureFlags = {
	mediaPlayer: {
		enablePlaylists: process.env.NODE_ENV !== 'production',
	},
} as const;
