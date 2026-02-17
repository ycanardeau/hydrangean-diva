import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import { PlayQueueCommandBarAddToPlayQueueButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarAddToPlayQueueButton';
import { PlayQueueCommandBarPlayNextButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarPlayNextButton';
import { PlayQueueCommandBarRemoveButton } from '@/features/media-player.play-queue/components/PlayQueueCommandBarRemoveButton';
import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	useEuiTheme,
} from '@elastic/eui';
import { DeleteRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

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
					<PlayQueueCommandBarPlayNextButton selection={playQueue} />
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<PlayQueueCommandBarAddToPlayQueueButton
						selection={playQueue}
					/>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<PlayQueueCommandBarRemoveButton selection={playQueue} />
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
