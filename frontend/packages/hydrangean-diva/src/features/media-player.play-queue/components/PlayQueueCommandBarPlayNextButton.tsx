import { usePlayQueue } from '@/features/media-player.play-queue.abstractions/contexts/PlayQueueContext';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { EuiButton } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useCallback } from 'react';

interface PlayQueueCommandBarPlayNextButtonProps {
	selection: {
		readonly selectedItems: {
			readonly dto: PlayQueueItemDto;
		}[];
		unselectAll(): void;
	};
}

export const PlayQueueCommandBarPlayNextButton = observer(
	({ selection }: PlayQueueCommandBarPlayNextButtonProps): ReactElement => {
		const playQueue = usePlayQueue();

		const handleClick = useCallback(async (): Promise<void> => {
			const items = selection.selectedItems.map((item) =>
				playQueue.createItemFromDto(item.dto),
			);

			await playQueue.playNext(items);

			selection.unselectAll();
		}, [selection, playQueue]);

		return (
			<EuiButton
				disabled={selection.selectedItems.length === 0}
				onClick={handleClick}
			>
				Play next{/* LOC */}
			</EuiButton>
		);
	},
);
