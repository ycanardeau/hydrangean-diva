import { findVideoService } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { memo, ReactElement, useCallback, useState } from 'react';

import { PlayQueueStore } from '@/features/media-player/stores/PlayQueueStore';

interface AddVideoModalProps {
	onCancel: () => void;
	onSave: (e: { url: string; title: string }) => Promise<void>;
}

const AddVideoModal = ({
	onCancel,
	onSave,
}: AddVideoModalProps): ReactElement => {
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=url]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>Add video{/* LOC */}</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm component="form">
					<EuiFormRow label="URL" /* LOC */>
						<EuiFieldText
							name="url"
							value={url}
							onChange={(e): void => setUrl(e.target.value)}
						/>
					</EuiFormRow>

					<EuiFormRow label="Title">
						<EuiFieldText
							name="title"
							value={title}
							onChange={(e): void => setTitle(e.target.value)}
						/>
					</EuiFormRow>
				</EuiForm>
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButtonEmpty onClick={onCancel}>
					Cancel{/* LOC */}
				</EuiButtonEmpty>

				<EuiButton
					type="submit"
					onClick={async (): Promise<void> => {
						try {
							setLoading(true);

							await onSave({ url, title });
						} finally {
							setLoading(false);
						}
					}}
					fill
					disabled={url.trim().length === 0}
					isLoading={loading}
				>
					Save{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};

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

export const AddVideoButton = memo(
	({ playQueueStore }: AddVideoButtonProps): ReactElement => {
		const [addVideoModalOpen, setAddVideoModalOpen] = useState(false);

		const handleSave = useCallback(
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
