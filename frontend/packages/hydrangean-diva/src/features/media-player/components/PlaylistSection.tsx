import { PlaylistCommandBar } from '@/features/media-player/components/PlaylistCommandBar';
import { PlaylistTable } from '@/features/media-player/components/PlaylistTable';
import { commandBarHeight } from '@/features/media-player/helpers/commandBarHeight';
import { headerHeight } from '@/features/media-player/helpers/headerHeight';
import type { IPlaylistStore } from '@/features/media-player/interfaces/IPlaylistStore';
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
						top: headerHeight + commandBarHeight,
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
