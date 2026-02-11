import { PlaylistTable } from '@/features/media-player.playlists/components/PlaylistTable';
import type { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { EuiPageTemplate } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';

interface PlaylistSectionProps {
	playlist: PlaylistStore;
}

export const PlaylistSection = observer(
	({ playlist }: PlaylistSectionProps): ReactElement => {
		return (
			<EuiPageTemplate.Section>
				{playlist.isEmpty ? (
					<></>
				) : (
					<PlaylistTable playlist={playlist} />
				)}
			</EuiPageTemplate.Section>
		);
	},
);
