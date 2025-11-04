import { EuiEmptyPrompt } from '@elastic/eui';
import { Cd16Regular } from '@fluentui/react-icons';
import { ReactElement } from 'react';

import { CreatePlaylistButton } from '@/features/media-player.playlists/components/CreatePlaylistButton';

export const PlaylistsEmptyPrompt = (): ReactElement => {
	return (
		<EuiEmptyPrompt
			iconType={Cd16Regular}
			title={<h2>You don't have any playlists{/* LOC */}</h2>}
			actions={<CreatePlaylistButton />}
		/>
	);
};
