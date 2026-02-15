import { usePlaylistList } from '@/features/media-player.playlists.abstractions/contexts/PlaylistListContext';
import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';
import { createFileRoute } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

const RouteComponent = observer((): ReactElement => {
	const { playlistId } = Route.useParams();

	const playlistList = usePlaylistList();
	const playlistListItem = playlistList.items.find(
		(item) => item.id === playlistId,
	);

	if (playlistListItem === undefined) {
		throw new Error('Playlist not found'); // TODO: 404 page
	}

	return <PlaylistDetailsPage playlistListItem={playlistListItem} />;
});

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	component: RouteComponent,
});
