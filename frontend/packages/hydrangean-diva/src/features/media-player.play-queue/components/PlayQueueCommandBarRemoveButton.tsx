import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { EuiButton } from '@elastic/eui';
import { DismissRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback } from 'react';

interface PlayQueueCommandBarRemoveButtonProps {
	selection: {
		readonly selectedItems: {
			readonly dto: PlayQueueItemDto;
		}[];
		removeItems(
			items: {
				readonly dto: PlayQueueItemDto;
			}[],
		): Promise<void>;
	};
}

export const PlayQueueCommandBarRemoveButton = observer(
	({ selection }: PlayQueueCommandBarRemoveButtonProps): ReactElement => {
		const handleClick = useCallback(async (): Promise<void> => {
			await selection.removeItems(selection.selectedItems);
		}, [selection]);

		return (
			<EuiButton
				iconType={DismissRegular}
				onClick={handleClick}
				disabled={selection.selectedItems.length === 0}
			>
				Remove{/* LOC */}
			</EuiButton>
		);
	},
);
