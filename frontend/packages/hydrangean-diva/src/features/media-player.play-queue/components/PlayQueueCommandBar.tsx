import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
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
import { type ReactElement } from 'react';

interface PlayNextButtonProps {
	playQueue: IPlayQueueStore;
}

const PlayNextButton = observer(
	({ playQueue }: PlayNextButtonProps): ReactElement => {
		return (
			<EuiButton
				disabled={!playQueue.canPlaySelectedItemsNext}
				onClick={playQueue.playSelectedItemsNext}
			>
				Play next{/* LOC */}
			</EuiButton>
		);
	},
);

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
					<PlayNextButton playQueue={playQueue} />
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<AddToPlayQueueButton playQueue={playQueue} />
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
					<AddVideoButton onSave={playQueue.addItemFromDto} />
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	},
);
