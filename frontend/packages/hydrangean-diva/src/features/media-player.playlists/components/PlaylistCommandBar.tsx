import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import type { IPlaylistStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistStore';
import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	useEuiTheme,
} from '@elastic/eui';
import { AddRegular, DismissRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

interface AddToPlaylistButtonProps {
	playlist: IPlaylistStore;
}

const AddToPlaylistButton = observer(
	({ playlist }: AddToPlaylistButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playlist.addSelectedItems}
				disabled={!playlist.canAddSelectedItems}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

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
					<EuiButton
						disabled={!playlist.canPlaySelectedItemsNext}
						onClick={playlist.playSelectedItemsNext}
					>
						Play next{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<AddToPlaylistButton playlist={playlist} />
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<EuiButton
						iconType={DismissRegular}
						onClick={playlist.removeSelectedItems}
						disabled={!playlist.canRemoveSelectedItems}
					>
						Remove{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
				<EuiFlexItem grow={true} />
				<EuiFlexItem grow={false}>
					<AddVideoButton onSave={playlist.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
