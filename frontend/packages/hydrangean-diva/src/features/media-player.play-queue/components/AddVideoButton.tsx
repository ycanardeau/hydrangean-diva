import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { isNoembedResult } from '@/features/media-player.play-queue/helpers/isNoembedResult';
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
	useGeneratedHtmlId,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { type ReactElement, memo, useCallback, useState } from 'react';

interface AddVideoFormSubmitEvent {
	url: string;
	title: string;
}

interface AddVideoModalProps {
	onCancel: () => void;
	onSave: (e: AddVideoFormSubmitEvent) => Promise<void>;
}

const AddVideoModal = ({
	onCancel,
	onSave,
}: AddVideoModalProps): ReactElement => {
	const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=url]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>Add video{/* LOC */}</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm
					id={modalFormId}
					component="form"
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						try {
							setLoading(true);

							await onSave({ url, title });
						} finally {
							setLoading(false);
						}
					}}
				>
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
					form={modalFormId}
					fill
					disabled={url.trim().length === 0}
					isLoading={loading}
				>
					Add video{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};

interface AddVideoButtonProps {
	onSave: (e: PlayQueueItemDto) => Promise<void>;
}

export const AddVideoButton = memo(
	({ onSave }: AddVideoButtonProps): ReactElement => {
		const [isModalOpen, setModalOpen] = useState(false);

		const handleSave = useCallback(
			async (e: AddVideoFormSubmitEvent): Promise<void> => {
				const videoService = findVideoService(e.url);
				if (videoService === undefined) {
					return;
				}

				const videoId = videoService.extractVideoId(e.url);
				if (videoId === undefined) {
					return;
				}

				const response = await fetch(
					`https://noembed.com/embed?url=${encodeURIComponent(e.url)}`,
				);
				const jsonData = await response.json();

				await onSave({
					url: e.url,
					type: videoService.type,
					videoId: videoId,
					title:
						e.title ||
						(isNoembedResult(jsonData) ? jsonData.title : videoId),
				});

				setModalOpen(false);
			},
			[onSave],
		);

		return (
			<>
				<EuiButton
					onClick={(): void => setModalOpen(true)}
					iconType={AddRegular}
					color="primary"
				>
					Add video{/* LOC */}
				</EuiButton>

				{isModalOpen && (
					<AddVideoModal
						onCancel={(): void => setModalOpen(false)}
						onSave={handleSave}
					/>
				)}
			</>
		);
	},
);
