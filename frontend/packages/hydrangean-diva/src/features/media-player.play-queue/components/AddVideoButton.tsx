import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { AddVideoModal } from '@/features/media-player.play-queue/components/AddVideoModal';
import { EuiButton } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import EasyModal from 'ez-modal-react';
import { type ReactElement, memo } from 'react';

interface AddVideoButtonProps {
	onFulfilled: (value: PlayQueueItemDto) => Promise<void>;
}

export const AddVideoButton = memo(
	({ onFulfilled }: AddVideoButtonProps): ReactElement => {
		const handleClick = (): Promise<void> =>
			EasyModal.show(AddVideoModal).then(onFulfilled);

		return (
			<EuiButton
				onClick={handleClick}
				iconType={AddRegular}
				color="primary"
			>
				Add video{/* LOC */}
			</EuiButton>
		);
	},
);
