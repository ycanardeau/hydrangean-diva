import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { EuiButton } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback } from 'react';

interface PlayQueueCommandBarAddToPlayQueueButtonProps {
	selection: {
		readonly selectedItems: {
			readonly dto: PlayQueueItemDto;
		}[];
		unselectAll(): void;
	};
}

export const PlayQueueCommandBarAddToPlayQueueButton = observer(
	({
		selection,
	}: PlayQueueCommandBarAddToPlayQueueButtonProps): ReactElement => {
		const playQueue = usePlayQueue();

		const handleClick = useCallback(async (): Promise<void> => {
			const items = selection.selectedItems.map((item) =>
				playQueue.createItemFromDto(item.dto),
			);

			await playQueue.addItems(items);

			selection.unselectAll();
		}, [selection, playQueue]);

		return (
			<EuiButton
				iconType={AddRegular}
				onClick={handleClick}
				disabled={selection.selectedItems.length === 0}
			>
				Add to play queue{/* LOC */}
			</EuiButton>
		);
	},
);
