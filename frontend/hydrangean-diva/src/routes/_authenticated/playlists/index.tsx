import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

import { PlaylistListPage } from '@/features/media-player.playlists/pages/PlaylistListPage';

const RouteComponent = (): ReactElement => {
	return <PlaylistListPage />;
};

export const Route = createFileRoute('/_authenticated/playlists/')({
	component: RouteComponent,
});
