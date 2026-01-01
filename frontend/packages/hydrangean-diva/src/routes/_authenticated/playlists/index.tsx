import { PlaylistListPage } from '@/features/media-player.playlists/pages/PlaylistListPage';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	return <PlaylistListPage />;
};

export const Route = createFileRoute('/_authenticated/playlists/')({
	component: RouteComponent,
});
