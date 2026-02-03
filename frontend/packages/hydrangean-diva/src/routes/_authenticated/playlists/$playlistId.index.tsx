import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';
import { createFileRoute } from '@tanstack/react-router';
import { type ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	const { playlistId } = Route.useParams();

	return <PlaylistDetailsPage playlistId={playlistId} />;
};

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	component: RouteComponent,
});
