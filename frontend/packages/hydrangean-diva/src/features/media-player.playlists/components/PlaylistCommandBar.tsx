import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import { PlayQueueCommandBarAddToPlayQueueButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarAddToPlayQueueButton';
import { PlayQueueCommandBarPlayNextButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarPlayNextButton';
import { PlayQueueCommandBarRemoveButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarRemoveButton';
import type { IPlaylistStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistStore';
import { EuiFlexGroup, EuiFlexItem, useEuiTheme } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

interface PlaylistCommandBarProps {
	playlist: IPlaylistStore;
}

export const PlaylistCommandBar = observer(
	({ playlist }: PlaylistCommandBarProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<EuiFlexGroup
				alignItems="center"
				gutterSize="m"
				style={{
					position: 'sticky',
					top: 48,
					zIndex: 998,
					background: euiTheme.colors.backgroundBasePlain,
				}}
			>
				<EuiFlexItem grow={false}>
					<PlayQueueCommandBarPlayNextButton selection={playlist} />
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<PlayQueueCommandBarAddToPlayQueueButton
						selection={playlist}
					/>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<PlayQueueCommandBarRemoveButton selection={playlist} />
				</EuiFlexItem>
				<EuiFlexItem grow={true} />
				<EuiFlexItem grow={false}>
					<AddVideoButton onSave={playlist.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
