import { AddVideoModal } from '@/components/AddVideoModal';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { findVideoService } from '@aigamo/nostalgic-diva';
import { EuiButton } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import React from 'react';

interface NoembedResult {
	title: string;
}

function isNoembedResult(value: any): value is NoembedResult {
	return (
		value !== null &&
		typeof value === 'object' &&
		'title' in value &&
		typeof value.title === 'string'
	);
}

interface AddVideoButtonProps {
	playQueueStore: PlayQueueStore;
}

export const AddVideoButton = React.memo(
	({ playQueueStore }: AddVideoButtonProps): React.ReactElement => {
		const [addVideoModalOpen, setAddVideoModalOpen] = React.useState(false);

		const handleSave = React.useCallback(
			async (e: { url: string; title: string }): Promise<void> => {
				const videoService = findVideoService(e.url);
				if (videoService !== undefined) {
					const videoId = videoService.extractVideoId(e.url);
					if (videoId !== undefined) {
						const response = await fetch(
							`https://noembed.com/embed?url=${encodeURIComponent(
								e.url,
							)}`,
						);
						const jsonData = await response.json();

						await playQueueStore.addItems([
							playQueueStore.createItem({
								url: e.url,
								type: videoService.type,
								videoId: videoId,
								title:
									e.title ||
									(isNoembedResult(jsonData)
										? jsonData.title
										: videoId),
							}),
						]);
					}
				}

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
