import { Configuration, MediaPlayerPlaylistsApi } from '@/api';

const configuration = new Configuration({
	basePath: new URL('api', window.location.origin).toString(),
});

export const mediaPlayerPlaylistsApi = new MediaPlayerPlaylistsApi(
	configuration,
);
