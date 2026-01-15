import { MediaPlayerPlaylistsApi } from '@/api/apis/MediaPlayerPlaylistsApi';
import { Configuration } from '@/api/runtime';

const configuration = new Configuration({
	basePath: new URL('api', window.location.origin).toString(),
});

export const mediaPlayerPlaylistsApi = new MediaPlayerPlaylistsApi(
	configuration,
);
