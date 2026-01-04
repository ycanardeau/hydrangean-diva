import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import { mediaPlayerPlaylistsApi } from '@/features/media-player.playlists/helpers/mediaPlayerPlaylistsApi';
import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { createFileRoute } from '@tanstack/react-router';
import { type ReactElement, useState } from 'react';

const RouteComponent = (): ReactElement => {
	const playQueue = usePlayQueue();

	const loaderData = Route.useLoaderData();

	const [playlist] = useState(
		() =>
			new PlaylistStore(
				playQueue,
				mediaPlayerPlaylistsApi,
				loaderData.playlist,
			),
	);

	return <PlaylistDetailsPage playlist={playlist} />;
};

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	loader: (context) =>
		mediaPlayerPlaylistsApi.mediaPlayerPlaylistsIdGet({
			id: context.params.playlistId,
		}),
	component: RouteComponent,
});
