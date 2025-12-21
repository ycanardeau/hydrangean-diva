import { MobXObservableStateProvider } from '@/features/common';
import { mediaPlayerPlaylistsApi } from '@/features/media-player.playlists/helpers/mediaPlayerPlaylistsApi';
import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { createFileRoute } from '@tanstack/react-router';
import { ReactElement, useState } from 'react';

const RouteComponent = (): ReactElement => {
	const { playlist } = Route.useLoaderData();

	const [playlistStore] = useState(
		() =>
			new PlaylistStore(
				new MobXObservableStateProvider(),
				mediaPlayerPlaylistsApi,
				playlist,
			),
	);

	return (
		<PlaylistDetailsPage
			playlist={playlist}
			playlistStore={playlistStore}
		/>
	);
};

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	loader: (context) =>
		mediaPlayerPlaylistsApi.mediaPlayerPlaylistsIdGet({
			id: context.params.playlistId,
		}),
	component: RouteComponent,
});
