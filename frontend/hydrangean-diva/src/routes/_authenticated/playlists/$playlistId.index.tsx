import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

import { PlaylistDetailsPage } from '@/features/media-player.playlists/pages/PlaylistDetailsPage';

const RouteComponent = (): ReactElement => {
	return <PlaylistDetailsPage />;
};

export const Route = createFileRoute('/_authenticated/playlists/$playlistId/')({
	component: RouteComponent,
});
