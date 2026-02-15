import type { IPlaylistStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistStore';
import { PlaylistCommandBar } from '@/features/media-player.playlists/components/PlaylistCommandBar';
import { PlaylistTable } from '@/features/media-player.playlists/components/PlaylistTable';
import { EuiPageTemplate, EuiSpacer, useEuiTheme } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

interface PlaylistSectionProps {
	playlist: IPlaylistStore;
}

export const PlaylistSection = observer(
	({ playlist }: PlaylistSectionProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<EuiPageTemplate.Section>
				<PlaylistCommandBar playlist={playlist} />

				<EuiSpacer
					size="l"
					style={{
						position: 'sticky',
						top: 48 + 40,
						zIndex: 998,
						background: euiTheme.colors.backgroundBasePlain,
					}}
				/>

				{playlist.isEmpty ? (
					<></>
				) : (
					<PlaylistTable playlist={playlist} />
				)}
			</EuiPageTemplate.Section>
		);
	},
);
