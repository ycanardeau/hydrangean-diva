import { featureFlags } from '@/features/common/helpers/featureFlags';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddToSelectablePopover } from '@/features/media-player.play-queue/components/AddToSelectablePopover';
import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import { DeveloperToolsButton } from '@/features/media-player.play-queue/components/DeveloperToolsButton';
import type { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	useEuiTheme,
} from '@elastic/eui';
import {
	AddRegular,
	DeleteRegular,
	DismissRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback } from 'react';

interface AddToPlayQueueButtonProps {
	playQueue: IPlayQueueStore;
}

const AddToPlayQueueButton = observer(
	({ playQueue }: AddToPlayQueueButtonProps): ReactElement => {
		return (
			<EuiButton
				iconType={AddRegular}
				onClick={playQueue.addSelectedItems}
				disabled={!playQueue.canAddSelectedItems}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);

interface PlayQueueCommandBarProps {
	playQueue: IPlayQueueStore;
}

export const PlayQueueCommandBar = observer(
	({ playQueue }: PlayQueueCommandBarProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		const handleAddToPlaylist =
			useCallback(async (): Promise<void> => {}, []);

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
						disabled={!playQueue.canPlaySelectedItemsNext}
						onClick={playQueue.playSelectedItemsNext}
					>
						Play next{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<AddToPlayQueueButton playQueue={playQueue} />
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<AddToSelectablePopover
						disabled={!featureFlags.mediaPlayer.enablePlaylists}
						onAddToPlaylist={handleAddToPlaylist}
					/>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<EuiButton
						iconType={DismissRegular}
						onClick={playQueue.removeSelectedItems}
						disabled={!playQueue.canRemoveSelectedItems}
					>
						Remove{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<EuiButton
						iconType={DeleteRegular}
						onClick={playQueue.clear}
						disabled={!playQueue.canClear}
					>
						Clear{/* LOC */}
					</EuiButton>
				</EuiFlexItem>
				<EuiFlexItem grow={true} />
				<EuiFlexItem grow={false}>
					{false && (
						<DeveloperToolsButton
							playQueue={playQueue as PlayQueueStore}
						/>
					)}

					<AddVideoButton onSave={playQueue.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
