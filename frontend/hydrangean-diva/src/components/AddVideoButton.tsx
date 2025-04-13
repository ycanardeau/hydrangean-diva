import { AddVideoModal } from '@/components/AddVideoModal';
import { PlayQueueItemDto } from '@/stores/IPlayQueueItemStore';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { EuiButton } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import React from 'react';

interface AddVideoButtonProps {
	playQueueStore: PlayQueueStore;
}

export const AddVideoButton = React.memo(
	({ playQueueStore }: AddVideoButtonProps): React.ReactElement => {
		const [addVideoModalOpen, setAddVideoModalOpen] = React.useState(false);

		const handleSave = React.useCallback(
			async (e: PlayQueueItemDto): Promise<void> => {
				await playQueueStore.addItems([playQueueStore.createItem(e)]);

				setAddVideoModalOpen(false);
			},
			[playQueueStore],
		);

		return (
			<>
				<EuiButton
					onClick={(): void => setAddVideoModalOpen(true)}
					iconType={AddRegular}
					color="primary"
				>
					Add video{/* LOC */}
				</EuiButton>

				{addVideoModalOpen && (
					<AddVideoModal
						onCancel={(): void => setAddVideoModalOpen(false)}
						onSave={handleSave}
					/>
				)}
			</>
		);
	},
);
