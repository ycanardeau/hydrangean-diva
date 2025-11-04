import { createFileRoute } from '@tanstack/react-router';
import { ReactElement } from 'react';

import { PlaylistsEmptyPrompt } from '@/features/media-player.playlists/components/PlaylistsEmptyPrompt';

const RouteComponent = (): ReactElement => {
	return <PlaylistsEmptyPrompt />;
};

export const Route = createFileRoute('/_authenticated/playlists/')({
	component: RouteComponent,
});
