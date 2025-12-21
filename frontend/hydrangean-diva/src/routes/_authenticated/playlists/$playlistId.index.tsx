import { mediaPlayerPlaylistsApi } from '@/features/media-player.playlists/helpers/mediaPlayerPlaylistsApi';
import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';
import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	const { playlist } = Route.useLoaderData();

	return <PlaylistDetailsPage playlist={playlist} />;
};

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	loader: (context) =>
		mediaPlayerPlaylistsApi.mediaPlayerPlaylistsIdGet({
			id: context.params.playlistId,
		}),
	component: RouteComponent,
});
